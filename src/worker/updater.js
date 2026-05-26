/*
 * 一键自更新。
 *
 * 负责 GitHub raw 源码拉取、版本/更新说明解析、安全 marker 校验和 Cloudflare Worker 部署。
 * 自更新只拉取和部署根目录 `emby.js` 产物，`HTML_CONTENT`、`export default`、`APP_VERSION` 等 marker 不能删。
 */
  getUpdateRepo(env) {
      return {
          owner: env.UPDATE_REPO_OWNER || this.UPDATE_REPO_OWNER,
          repo: env.UPDATE_REPO_NAME || this.UPDATE_REPO_NAME,
          branch: env.UPDATE_BRANCH || this.UPDATE_BRANCH,
          file: env.UPDATE_FILE || this.UPDATE_FILE
      };
  },

  getUpdateRawUrl(env) {
      const repo = this.getUpdateRepo(env);
      return 'https://raw.githubusercontent.com/' + encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.repo) + '/' + encodeURIComponent(repo.branch) + '/' + repo.file.split('/').map(encodeURIComponent).join('/');
  },

  getMissingUpdateEnv(env) {
      const missing = [];
      if (!['1', 'true', 'yes', 'on'].includes(String(env.UPDATE_ENABLED || '').toLowerCase())) missing.push('UPDATE_ENABLED');
      if (!env.CF_ACCOUNT_ID) missing.push('CF_ACCOUNT_ID');
      if (!env.CF_WORKER_NAME) missing.push('CF_WORKER_NAME');
      if (!env.CF_API_TOKEN) missing.push('CF_API_TOKEN');
      return missing;
  },

  canSelfUpdate(env) { return this.getMissingUpdateEnv(env).length === 0; },

  isDockerRuntime(env) {
      return Boolean(env && env.DOCKER_SELF_UPDATER && typeof env.DOCKER_SELF_UPDATER.getCapability === 'function');
  },

  async getRuntimeUpdateCapability(env) {
      if (this.isDockerRuntime(env)) {
          const capability = await env.DOCKER_SELF_UPDATER.getCapability();
          return {
              mode: 'docker',
              targetLabel: 'Docker 容器',
              canUpdate: Boolean(capability && capability.canUpdate),
              missing: Array.isArray(capability && capability.missing) ? capability.missing : [],
              busy: Boolean(capability && capability.busy),
              image: capability && capability.image ? String(capability.image) : ''
          };
      }
      return {
          mode: 'worker',
          targetLabel: 'Cloudflare Worker',
          canUpdate: this.canSelfUpdate(env),
          missing: this.getMissingUpdateEnv(env),
          busy: false,
          image: ''
      };
  },

  UPDATE_CHECK_KV_KEY: 'last_update_check',
  UPDATE_CHECK_INTERVAL_MS: 12 * 60 * 60 * 1000,

  parseUpdateCheckTimestamp(value) {
      const timestamp = Number(value);
      return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
  },

  async maybeRunScheduledSelfUpdate(env) {
      if (!env || !env.EMBY_DB || !this.canSelfUpdate(env)) return { skipped: true, reason: 'disabled' };

      const checkedAt = Date.now();
      let lastCheckedAt = 0;
      try {
          lastCheckedAt = this.parseUpdateCheckTimestamp(await env.EMBY_DB.get(this.UPDATE_CHECK_KV_KEY));
      } catch (e) {
          console.log('[updater] last_update_check read failed:', e && e.message ? e.message : String(e));
          return { skipped: true, reason: 'kv-read-failed' };
      }

      if (lastCheckedAt && checkedAt - lastCheckedAt < this.UPDATE_CHECK_INTERVAL_MS) {
          return { skipped: true, reason: 'throttled', lastCheckedAt, nextCheckAt: lastCheckedAt + this.UPDATE_CHECK_INTERVAL_MS };
      }

      try {
          const latestSource = await this.fetchLatestWorkerSource(env);
          const latestVersion = this.extractAppVersion(latestSource) || 'unknown';
          const updated = latestVersion !== 'unknown' && latestVersion !== this.APP_VERSION;
          if (updated) await this.deployWorkerSource(env, latestSource);
          try {
              const logConfig = await this.loadConfig(env);
              await this.appendRuntimeLog(env, 'info', updated ? 'update.auto.deploy.done' : 'update.auto.check.done', updated ? '定时自动更新部署完成' : '定时自动更新检查完成', {
                  currentVersion: this.APP_VERSION,
                  latestVersion,
                  updated
              }, { config: logConfig });
          } catch (logError) {}
          return { skipped: false, checkedAt, latestVersion, updated };
      } catch (e) {
          const message = e && e.message ? e.message : String(e || 'Auto update failed');
          console.log('[updater] scheduled self update failed:', message);
          try {
              const logConfig = await this.loadConfig(env);
              await this.appendRuntimeLog(env, 'error', 'update.auto.error', '定时自动更新失败', { error: message }, { config: logConfig });
          } catch (logError) {}
          return { skipped: false, checkedAt, error: message };
      } finally {
          try {
              await env.EMBY_DB.put(this.UPDATE_CHECK_KV_KEY, String(checkedAt));
          } catch (e) {
              console.log('[updater] last_update_check write failed:', e && e.message ? e.message : String(e));
          }
      }
  },

  async fetchLatestWorkerSource(env) {
      const sourceUrl = this.getUpdateRawUrl(env) + '?t=' + Date.now();
      const response = await fetch(sourceUrl, {
          headers: {
              'Accept': 'text/plain',
              'Cache-Control': 'no-cache, no-store, max-age=0',
              'Pragma': 'no-cache',
              'User-Agent': 'Emby-Cluster-Monitor-Updater/' + this.APP_VERSION
          }
      });
      if (!response.ok) throw new Error('GitHub source fetch failed HTTP ' + response.status);
      const source = await response.text();
      if (!this.isSafeWorkerSource(source)) throw new Error('Latest source validation failed');
      return source;
  },

  extractAppVersion(source) {
      const text = String(source || '');
      const exportMatch = text.match(/export\s+default\s*\{[\s\S]*?APP_VERSION:\s*['"]([^'"]+)['"]/);
      if (exportMatch) return exportMatch[1];
      const match = text.match(/APP_VERSION:\s*['"]([^'"]+)['"]/);
      return match ? match[1] : '';
  },

  extractUpdateNotes(source) {
      const match = String(source || '').match(/APP_UPDATE_NOTES:\s*\[([\s\S]*?)\]\s*,/);
      if (!match) return [];
      const notes = [];
      const itemPattern = /['"]([^'"]+)['"]/g;
      let item;
      while ((item = itemPattern.exec(match[1])) && notes.length < 8) {
          if (item[1]) notes.push(item[1]);
      }
      return notes;
  },

  isSafeWorkerSource(source) {
      const text = String(source || '');
      return text.length > 10000 && text.length < 5 * 1024 * 1024 && text.includes('Emby 集群探针') && text.includes('export default') && text.includes('HTML_CONTENT') && Boolean(this.extractAppVersion(text));
  },

  async deployWorkerSource(env, source) {
      const form = new FormData();
      form.append('metadata', JSON.stringify({ main_module: 'emby.js' }));
      form.append('emby.js', new Blob([source], { type: 'application/javascript+module' }), 'emby.js');

      const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(env.CF_ACCOUNT_ID) + '/workers/scripts/' + encodeURIComponent(env.CF_WORKER_NAME) + '/content';
      const response = await fetch(endpoint, { method: 'PUT', headers: { 'Authorization': 'Bearer ' + env.CF_API_TOKEN }, body: form });
      const detail = await response.text();
      if (!response.ok) throw new Error('Cloudflare deploy failed HTTP ' + response.status + (detail ? ': ' + detail.slice(0, 300) : ''));
      try {
          const parsed = JSON.parse(detail);
          if (parsed && parsed.success === false) throw new Error('Cloudflare deploy rejected: ' + JSON.stringify(parsed.errors || parsed.messages || parsed).slice(0, 300));
      } catch(e) { if (e.message && e.message.startsWith('Cloudflare deploy rejected')) throw e; }
      return detail;
  },
