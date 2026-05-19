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
