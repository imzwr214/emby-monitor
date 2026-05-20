/*
 * Worker HTTP 路由和定时任务入口。
 *
 * 负责 `fetch()` 路由分发和 `scheduled()` 定时探测入口。
 * 新增 API 时优先在这里注册路由；管理接口必须确认是否需要 `requireAdmin()`。
 */
  async fetch(request, env) {
    const url = new URL(request.url);
    const publicShareHost = this.isPublicShareHost(request, env);
    if (publicShareHost && !this.isAllowedPublicSharePath(url.pathname)) {
      return new Response('Not Found', { status: 404 });
    }

    if (url.pathname === '/manifest.webmanifest') {
      return this.json({
          name: 'Emby 服务器探针',
          short_name: 'Emby 探针',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#dce8fb',
          theme_color: '#dce8fb',
          icons: [
              { src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
      });
    }

    if (url.pathname === '/app-icon.svg') {
      return new Response(this.APP_ICON_SVG, {
          headers: {
              'Content-Type': 'image/svg+xml;charset=utf-8',
              'Cache-Control': 'public, max-age=604800'
          }
      });
    }

    if (url.pathname === '/public') {
      return new Response('Link required', { status: 404, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    }

    if (request.method === 'GET' && /^\/public\/[a-f0-9]{24}$/i.test(url.pathname)) {
      if (this.shouldBlockPublicShareAccess(request)) {
        return new Response('海外敏感内容，大陆ip禁止访问', { status: 403, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      }
      const token = url.pathname.split('/').pop();
      const tokenRecord = await this.getPublicShareToken(env, token);
      if (!tokenRecord || (Number(tokenRecord.expiresAt) > 0 && Number(tokenRecord.expiresAt) <= Date.now())) return new Response('Link expired', { status: 410, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      await this.recordPublicShareView(env, token, tokenRecord, request);
      const config = await this.loadConfig(env);
      const ownerProfile = tokenRecord.telegramProfile || null;
      const publicPageState = {
          ownerProfile,
          hideCounts: Boolean(tokenRecord.hideCounts)
      };
      return new Response(this.buildPublicPage(config, publicPageState), {
          headers: {
              'Content-Type': 'text/html;charset=utf-8',
              'Cache-Control': 'no-store'
          }
      });
    }

    if (url.pathname === '/api/public/share-token' && request.method === 'POST') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;
      const body = await request.json().catch(() => ({}));
      const lifetime = body.lifetime === 'forever' ? 'forever' : 'hour';
      const token = this.generatePublicShareToken();
      const expiresAt = lifetime === 'forever' ? 0 : Date.now() + (60 * 60 * 1000);
      const config = await this.loadConfig(env);
      const profile = body.includeTelegramProfile ? await this.readTelegramChatProfile(env, config) : null;
      await this.storePublicShareToken(env, token, expiresAt, {
          origin: url.origin || '',
          telegramProfile: profile,
          hideCounts: Boolean(body.hideCounts)
      });
      const baseUrl = url.origin || '';
      const publicUrl = baseUrl.replace(/\/$/, '') + '/public/' + token;
      return this.json({ ok: true, token, url: publicUrl, expiresAt });
    }

    const publicTokenApiMatch = url.pathname.match(/^\/api\/public\/share-token\/([a-f0-9]{24})$/i);
    if (publicTokenApiMatch && request.method === 'DELETE') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;
      await this.deletePublicShareToken(env, publicTokenApiMatch[1]);
      return this.json({ ok: true });
    }

    if (url.pathname === '/api/public/share-stats' && request.method === 'GET') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;
      return this.json({ ok: true, items: await this.listPublicShareStats(env, url.origin || '') });
    }

    if (url.pathname === '/api/card/share-token' && request.method === 'POST') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;
      const body = await request.json().catch(() => ({}));
      const serverId = String(body.serverId || '');
      const config = await this.loadConfig(env);
      const clean = this.sanitizeConfig(config);
      const server = clean.servers.find((item) => String(item.id) === serverId);
      if (!server) return this.json({ ok: false, error: 'Server not found' }, 404);
      const token = this.generatePublicShareToken();
      const expiresAt = Date.now() + (60 * 60 * 1000);
      await this.storeCardShareToken(env, token, { expiresAt, serverId });
      const baseUrl = url.origin || '';
      const cardUrl = baseUrl.replace(/\/$/, '') + '/card/' + token + '.svg';
      return this.json({ ok: true, token, url: cardUrl, expiresAt });
    }

    const cardMatch = url.pathname.match(/^\/card\/([a-f0-9]{24})\.svg$/i);
    if (cardMatch && request.method === 'GET') {
      const tokenRecord = await this.getCardShareToken(env, cardMatch[1]);
      if (!tokenRecord || tokenRecord.expiresAt <= Date.now()) return new Response('Link expired', { status: 410, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      const config = await this.loadConfig(env);
      const clean = this.sanitizeConfig(config);
      const server = clean.servers.find((item) => String(item.id) === String(tokenRecord.serverId));
      if (!server) return new Response('Not Found', { status: 404 });
      return new Response(new Blob([this.buildServerCardSvg(server, clean)], { type: 'image/svg+xml;charset=utf-8' }), {
          headers: {
              'Content-Type': 'image/svg+xml;charset=utf-8',
              'Cache-Control': 'no-store'
          }
      });
    }

    if (url.pathname === '/api/config') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      if (request.method === 'GET') {
          const config = await this.loadConfig(env);
          return this.json({ ...config, notifyEnabled: this.isTelegramEnabled(env, config), telegram: this.getTelegramConfig(env, config), publicShareBaseUrl: this.getPublicShareBaseUrl(env), publicShareWildcardDomain: this.getPublicShareWildcardDomain(env) });
      }
      if (request.method === 'POST') {
          const nextConfig = await request.json();
          const cleanConfig = this.sanitizeConfig(nextConfig);
          const latestConfig = await this.loadConfig(env);
          if (nextConfig.baseRevision && latestConfig.revision && nextConfig.baseRevision !== latestConfig.revision) {
              return this.json({ ok: false, error: 'Config changed, reload required', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
          }
          if (latestConfig.updatedAt && cleanConfig.updatedAt && cleanConfig.updatedAt < latestConfig.updatedAt) {
              return this.json({ ok: false, error: 'Stale config rejected', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
          }
          const savedConfig = await this.saveConfig(env, cleanConfig);
          return this.json({ ok: true, updatedAt: savedConfig.updatedAt, revision: savedConfig.revision });
      }
    }

    if (url.pathname === '/api/telegram/test' && request.method === 'POST') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      const body = await request.json().catch(() => ({}));
      const currentConfig = await this.loadConfig(env);
      const testConfig = this.sanitizeConfig({
          ...currentConfig,
          telegram: body.telegram && typeof body.telegram === 'object' ? body.telegram : currentConfig.telegram
      });
      const result = await this.testTelegram(env, testConfig);
      return this.json(result, result.ok ? 200 : 400);
    }

    if (url.pathname === '/api/fetch-icons') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      try {
          const iconUrl = this.parsePublicHttpUrl(url.searchParams.get('url'));
          if (!iconUrl) return new Response('Invalid URL', { status: 400 });
          const r = await fetch(iconUrl.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' }
          });
          if (!r.ok) return new Response('{}', { status: 502, headers: { 'Content-Type': 'application/json' } });
          let txt = await r.text();

          try {
              txt = txt.replace(/，/g, ',').replace(/“|”/g, '"').replace(/'/g, '"').replace(/,(\s*[}\\]])/g, '$1').trim();
              const parsedIcons = this.extractIcons(JSON.parse(txt));
              return this.json(parsedIcons);
          } catch(e) {
              const urls = txt.match(/https?:\/\/[^"'\s]+/g) || [];
              return this.json(this.extractIcons(urls));
          }
      } catch(e) { return new Response('{}', { status: 500 }); }
    }

    if (url.pathname === '/proxy-img') {
        try {
            const target = this.parsePublicHttpUrl(url.searchParams.get('url'));
            if (!target) return new Response('Missing URL', { status: 400 });
            const imgRes = await fetch(target.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' } });
            const h = new Headers(imgRes.headers);
            const contentType = h.get('Content-Type') || '';
            if (!contentType.startsWith('image/')) return new Response('Not an image', { status: 415 });
            h.set('Access-Control-Allow-Origin', '*');
            h.set('Cache-Control', 'public, max-age=864000');
            return new Response(imgRes.body, { status: imgRes.status, headers: h });
        } catch(e) {
            return new Response('Error Proxying Image', { status: 500 });
        }
    }

    if (url.pathname === '/api/ping-all' && request.method === 'POST') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      const requestBody = await request.json().catch(() => ({}));
      const currentConfig = await this.loadConfig(env);
      const updatedConfig = await this.runProbeLogic(env, currentConfig, { forceMedia: Boolean(requestBody.forceMedia), cursor: Number(requestBody.cursor) || 0 });
      return this.json({ ...updatedConfig, notifyEnabled: this.isTelegramEnabled(env, updatedConfig) });
    }

    if (url.pathname === '/api/update/check' && request.method === 'GET') {
      const auth = this.requireStrictAdmin(request, env);
      if (auth) return auth;

      try {
          const latestSource = await this.fetchLatestWorkerSource(env);
          const latestVersion = this.extractAppVersion(latestSource) || 'unknown';
          const releaseNotes = this.extractUpdateNotes(latestSource);
          return this.json({
              currentVersion: this.APP_VERSION,
              latestVersion,
              hasUpdate: latestVersion !== 'unknown' && latestVersion !== this.APP_VERSION,
              releaseNotes,
              canUpdate: this.canSelfUpdate(env),
              sourceUrl: this.getUpdateRawUrl(env),
              missing: this.getMissingUpdateEnv(env)
          });
      } catch(e) {
          return this.json({
              currentVersion: this.APP_VERSION,
              latestVersion: 'unknown',
              hasUpdate: false,
              releaseNotes: [],
              canUpdate: this.canSelfUpdate(env),
              error: e.message || 'Check update failed',
              missing: this.getMissingUpdateEnv(env)
          }, 502);
      }
    }

    if (url.pathname === '/api/update/apply' && request.method === 'POST') {
      const auth = this.requireStrictAdmin(request, env);
      if (auth) return auth;

      if (!this.canSelfUpdate(env)) {
          return this.json({ ok: false, error: 'Self update is not configured', missing: this.getMissingUpdateEnv(env) }, 400);
      }
      try {
          const latestSource = await this.fetchLatestWorkerSource(env);
          const latestVersion = this.extractAppVersion(latestSource);
          if (!latestVersion) return this.json({ ok: false, error: 'Latest source has no APP_VERSION' }, 422);
          const releaseNotes = this.extractUpdateNotes(latestSource);
          if (latestVersion === this.APP_VERSION) return this.json({ ok: true, updated: false, version: this.APP_VERSION, releaseNotes });
          await this.deployWorkerSource(env, latestSource);
          return this.json({ ok: true, updated: true, previousVersion: this.APP_VERSION, version: latestVersion, releaseNotes });
      } catch(e) {
          return this.json({ ok: false, error: e.message || 'Update failed' }, 502);
      }
    }

    return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  },

  async scheduled(event, env, ctx) {
      ctx.waitUntil(this.loadConfig(env).then((config) => this.runProbeLogic(env, config)));
  },
