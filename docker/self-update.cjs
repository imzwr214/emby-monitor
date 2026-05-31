const fs = require('fs');
const http = require('http');

class DockerSelfUpdater {
  constructor(options = {}) {
    this.socketPath = String(options.socketPath || '/var/run/docker.sock');
    this.image = String(options.image || '').trim();
    this.containerId = String(options.containerId || '').trim();
    this.enabled = !['0', 'false', 'no', 'off'].includes(String(options.enabled === undefined ? '1' : options.enabled).toLowerCase());
    this.apiVersion = String(options.apiVersion || process.env.DOCKER_API_VERSION || '').trim();
    this.apiVersionPromise = null;
    this.updatePromise = null;
    this.lastStartedAt = 0;
  }

  async getCapability() {
    const missing = [];
    if (!this.enabled) missing.push('DOCKER_SELF_UPDATE_ENABLED');
    if (!this.socketPath || !fs.existsSync(this.socketPath)) missing.push('DOCKER_SOCKET');
    if (!this.image) missing.push('DOCKER_UPDATE_IMAGE');
    if (!this.containerId) missing.push('DOCKER_CONTAINER_ID');
    return {
      mode: 'docker',
      canUpdate: missing.length === 0,
      missing,
      image: this.image,
      busy: Boolean(this.updatePromise)
    };
  }

  async scheduleSelfUpdate(meta = {}) {
    const capability = await this.getCapability();
    if (!capability.canUpdate) {
      return {
        ok: false,
        error: 'Docker self update is not configured',
        ...capability
      };
    }
    if (this.updatePromise) {
      return {
        ok: true,
        queued: true,
        alreadyRunning: true,
        startedAt: this.lastStartedAt,
        ...capability
      };
    }

    this.lastStartedAt = Date.now();
    this.updatePromise = this.launchUpdateWorker(meta)
      .catch((error) => {
        console.error('[docker-update] failed:', error && error.stack ? error.stack : error);
        throw error;
      })
      .finally(() => {
        this.updatePromise = null;
      });

    return {
      ok: true,
      queued: true,
      startedAt: this.lastStartedAt,
      ...capability
    };
  }

  async launchUpdateWorker(meta = {}) {
    const inspect = await this.inspectContainer(this.containerId);
    const helperImage = String((((inspect || {}).Config || {}).Image) || '').trim() || this.image;
    const targetImage = this.image || helperImage;
    if (!helperImage) throw new Error('Missing helper image');
    if (!targetImage) throw new Error('Missing target image');

    const originalName = String(inspect.Name || '').replace(/^\/+/, '') || 'emby-monitor';
    const helperName = `${originalName}-update-helper-${Date.now()}`;
    const created = await this.createContainer(helperName, this.buildHelperCreateBody(inspect, helperImage, targetImage, meta));
    const helperId = String((created && created.Id) || '');
    if (!helperId) throw new Error('Docker create helper container returned no Id');
    await this.startContainer(helperId);
    console.log(`[docker-update] helper started: ${helperName}, target=${originalName}, image=${targetImage}, version=${meta.latestVersion || 'unknown'}`);
    return {
      ok: true,
      helperId,
      helperName,
      image: targetImage
    };
  }

  async runSelfUpdate(meta = {}) {
    const inspect = await this.inspectContainer(this.containerId);
    const targetImage = this.image || String((((inspect || {}).Config || {}).Image) || '').trim();
    if (!targetImage) throw new Error('Missing target image');

    const originalName = String(inspect.Name || '').replace(/^\/+/, '') || 'emby-monitor';
    const backupName = `${originalName}-old-${Date.now()}`;
    const wasRunning = Boolean(inspect.State && inspect.State.Running);
    let createdId = '';
    let renamed = false;
    let stopped = false;

    console.log(`[docker-update] checking update for ${originalName}, target image=${targetImage}, version=${meta.latestVersion || 'unknown'}`);
    await this.pullImage(targetImage);

    try {
      await this.renameContainer(this.containerId, backupName);
      renamed = true;

      if (wasRunning) {
        await this.stopContainer(this.containerId, 10);
        stopped = true;
      }

      const created = await this.createContainer(originalName, this.buildCreateBody(inspect, targetImage));
      createdId = String((created && created.Id) || '');
      if (!createdId) throw new Error('Docker create container returned no Id');
      await this.startContainer(createdId);

      try {
        await this.removeContainer(this.containerId, true);
      } catch (removeError) {
        console.error('[docker-update] old container cleanup failed:', removeError && removeError.stack ? removeError.stack : removeError);
      }

      return {
        ok: true,
        containerId: createdId,
        image: targetImage
      };
    } catch (error) {
      if (createdId) {
        await this.removeContainer(createdId, true).catch(() => {});
      }
      if (renamed) {
        await this.renameContainer(this.containerId, originalName).catch(() => {});
        if (stopped) {
          await this.startContainer(this.containerId).catch(() => {});
        }
      }
      throw error;
    }
  }

  buildHelperCreateBody(inspect, helperImage, targetImage, meta = {}) {
    const socketBind = this.resolveSocketBind(inspect);
    const labels = {
      'com.pototazhang.emby-js.role': 'docker-update-helper',
      'com.pototazhang.emby-js.target': String(inspect && inspect.Name ? inspect.Name : '').replace(/^\/+/, '') || 'emby-monitor',
      'com.pototazhang.emby-js.target-id': this.containerId
    };
    const envVars = [
      `DOCKER_CONTAINER_ID=${this.containerId}`,
      `DOCKER_UPDATE_IMAGE=${targetImage}`,
      `DOCKER_SOCKET_PATH=${this.socketPath}`
    ];
    if (meta && meta.latestVersion) envVars.push(`DOCKER_UPDATE_LATEST_VERSION=${String(meta.latestVersion)}`);

    return this.omitEmpty({
      Image: helperImage,
      WorkingDir: ((inspect && inspect.Config && inspect.Config.WorkingDir) || '/app'),
      Cmd: ['node', 'docker/update-runner.cjs'],
      Env: envVars,
      Labels: labels,
      HostConfig: this.omitEmpty({
        Binds: socketBind ? [socketBind] : undefined,
        NetworkMode: 'none',
        RestartPolicy: { Name: 'no' }
      })
    });
  }

  buildCreateBody(inspect, image) {
    const config = inspect && inspect.Config ? inspect.Config : {};
    const hostConfig = inspect && inspect.HostConfig ? inspect.HostConfig : {};
    const labels = { ...(config.Labels || {}) };
    const envVars = Array.isArray(config.Env) ? config.Env.slice() : [];
    const exposedPorts = config.ExposedPorts && typeof config.ExposedPorts === 'object' ? { ...config.ExposedPorts } : undefined;

    return this.omitEmpty({
      Image: image,
      Env: envVars.length ? envVars : undefined,
      Cmd: Array.isArray(config.Cmd) ? config.Cmd.slice() : config.Cmd,
      Entrypoint: Array.isArray(config.Entrypoint) ? config.Entrypoint.slice() : config.Entrypoint,
      WorkingDir: config.WorkingDir || undefined,
      Labels: Object.keys(labels).length ? labels : undefined,
      ExposedPorts: exposedPorts && Object.keys(exposedPorts).length ? exposedPorts : undefined,
      HostConfig: this.omitEmpty({
        AutoRemove: hostConfig.AutoRemove,
        Binds: Array.isArray(hostConfig.Binds) ? hostConfig.Binds.slice() : undefined,
        CapAdd: Array.isArray(hostConfig.CapAdd) ? hostConfig.CapAdd.slice() : undefined,
        CapDrop: Array.isArray(hostConfig.CapDrop) ? hostConfig.CapDrop.slice() : undefined,
        Dns: Array.isArray(hostConfig.Dns) ? hostConfig.Dns.slice() : undefined,
        DnsOptions: Array.isArray(hostConfig.DnsOptions) ? hostConfig.DnsOptions.slice() : undefined,
        DnsSearch: Array.isArray(hostConfig.DnsSearch) ? hostConfig.DnsSearch.slice() : undefined,
        ExtraHosts: Array.isArray(hostConfig.ExtraHosts) ? hostConfig.ExtraHosts.slice() : undefined,
        Init: typeof hostConfig.Init === 'boolean' ? hostConfig.Init : undefined,
        LogConfig: hostConfig.LogConfig && hostConfig.LogConfig.Type ? { ...hostConfig.LogConfig } : undefined,
        NetworkMode: hostConfig.NetworkMode || undefined,
        PortBindings: hostConfig.PortBindings && typeof hostConfig.PortBindings === 'object' ? JSON.parse(JSON.stringify(hostConfig.PortBindings)) : undefined,
        Privileged: hostConfig.Privileged,
        PublishAllPorts: hostConfig.PublishAllPorts,
        ReadonlyRootfs: hostConfig.ReadonlyRootfs,
        RestartPolicy: hostConfig.RestartPolicy && (hostConfig.RestartPolicy.Name || hostConfig.RestartPolicy.MaximumRetryCount)
          ? { ...hostConfig.RestartPolicy }
          : undefined,
        SecurityOpt: Array.isArray(hostConfig.SecurityOpt) ? hostConfig.SecurityOpt.slice() : undefined,
        ShmSize: Number.isFinite(Number(hostConfig.ShmSize)) && Number(hostConfig.ShmSize) > 0 ? Number(hostConfig.ShmSize) : undefined,
        Tmpfs: hostConfig.Tmpfs && typeof hostConfig.Tmpfs === 'object' ? { ...hostConfig.Tmpfs } : undefined,
        Ulimits: Array.isArray(hostConfig.Ulimits) ? JSON.parse(JSON.stringify(hostConfig.Ulimits)) : undefined
      })
    });
  }

  omitEmpty(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    const next = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined || entry === null) continue;
      if (Array.isArray(entry) && entry.length === 0) continue;
      if (!Array.isArray(entry) && typeof entry === 'object' && Object.keys(entry).length === 0) continue;
      next[key] = entry;
    }
    return next;
  }

  resolveSocketBind(inspect) {
    const mounts = Array.isArray(inspect && inspect.Mounts) ? inspect.Mounts : [];
    for (const mount of mounts) {
      if (String(mount && mount.Destination || '') !== this.socketPath) continue;
      if (String(mount && mount.Type || '') !== 'bind') break;
      if (!mount.Source) break;
      if (mount.RW === false) throw new Error(`Docker socket mount ${this.socketPath} is read-only`);
      return `${mount.Source}:${mount.Destination}`;
    }

    const binds = Array.isArray(inspect && inspect.HostConfig && inspect.HostConfig.Binds) ? inspect.HostConfig.Binds : [];
    for (const bind of binds) {
      const parsed = this.parseBindMount(bind);
      if (parsed.destination !== this.socketPath) continue;
      if (parsed.readOnly) throw new Error(`Docker socket bind ${this.socketPath} is read-only`);
      return bind;
    }

    return `${this.socketPath}:${this.socketPath}`;
  }

  parseBindMount(bind) {
    const parts = String(bind || '').split(':');
    const source = parts[0] || '';
    const destination = parts[1] || '';
    const mode = parts.slice(2).join(':');
    return {
      source,
      destination,
      mode,
      readOnly: mode.split(',').includes('ro')
    };
  }

  async pullImage(imageRef) {
    const parsed = this.parseImageReference(imageRef);
    const response = await this.request('POST', `/images/create?fromImage=${encodeURIComponent(parsed.name)}&tag=${encodeURIComponent(parsed.tag)}`);
    const lines = String(response.body || '').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      try {
        const payload = JSON.parse(line);
        if (payload && payload.error) throw new Error(String(payload.error));
      } catch (error) {
        if (error && error.message && !error.message.startsWith('Unexpected token')) throw error;
      }
    }
    return response.body;
  }

  parseImageReference(imageRef) {
    const trimmed = String(imageRef || '').trim();
    const lastColon = trimmed.lastIndexOf(':');
    const lastSlash = trimmed.lastIndexOf('/');
    if (lastColon > lastSlash) {
      return { name: trimmed.slice(0, lastColon), tag: trimmed.slice(lastColon + 1) || 'latest' };
    }
    return { name: trimmed, tag: 'latest' };
  }

  async getApiVersion() {
    if (this.apiVersion) return this.apiVersion;
    if (this.apiVersionPromise) return this.apiVersionPromise;

    this.apiVersionPromise = (async () => {
      const response = await this.request('GET', '/version', undefined, { versioned: false });
      const parsed = response.body ? JSON.parse(response.body) : {};
      const version = String((parsed && (parsed.ApiVersion || parsed.APIVersion)) || '').trim();
      if (!version) throw new Error('Docker API version not reported by daemon');
      this.apiVersion = version;
      return version;
    })().finally(() => {
      this.apiVersionPromise = null;
    });

    return this.apiVersionPromise;
  }

  async inspectContainer(containerId) {
    const response = await this.requestJson('GET', `/containers/${encodeURIComponent(containerId)}/json`);
    return response;
  }

  async renameContainer(containerId, newName) {
    await this.request('POST', `/containers/${encodeURIComponent(containerId)}/rename?name=${encodeURIComponent(newName)}`);
  }

  async stopContainer(containerId, timeoutSeconds) {
    await this.request('POST', `/containers/${encodeURIComponent(containerId)}/stop?t=${encodeURIComponent(String(timeoutSeconds || 10))}`);
  }

  async createContainer(name, body) {
    return this.requestJson('POST', `/containers/create?name=${encodeURIComponent(name)}`, body);
  }

  async startContainer(containerId) {
    await this.request('POST', `/containers/${encodeURIComponent(containerId)}/start`);
  }

  async removeContainer(containerId, force) {
    await this.request('DELETE', `/containers/${encodeURIComponent(containerId)}?force=${force ? '1' : '0'}`);
  }

  async requestJson(method, path, body) {
    const response = await this.request(method, path, body);
    if (!response.body) return {};
    try {
      return JSON.parse(response.body);
    } catch (error) {
      throw new Error(`Docker API returned invalid JSON for ${method} ${path}: ${response.body.slice(0, 300)}`);
    }
  }

  async request(method, path, body, options = {}) {
    const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
    const versioned = options.versioned !== false;
    const apiVersion = versioned ? await this.getApiVersion() : '';
    const dockerPath = versioned ? `/v${apiVersion}${path}` : path;
    return new Promise((resolve, reject) => {
      const req = http.request({
        socketPath: this.socketPath,
        path: dockerPath,
        method,
        headers: payload ? {
          'Content-Type': 'application/json',
          'Content-Length': String(payload.length)
        } : undefined
      }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const responseBody = chunks.length ? Buffer.concat(chunks).toString('utf8') : '';
          if (res.statusCode >= 400) {
            reject(new Error(`Docker API ${method} ${path} failed HTTP ${res.statusCode}${responseBody ? `: ${responseBody.slice(0, 300)}` : ''}`));
            return;
          }
          resolve({ statusCode: res.statusCode, body: responseBody });
        });
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }
}

module.exports = { DockerSelfUpdater };
