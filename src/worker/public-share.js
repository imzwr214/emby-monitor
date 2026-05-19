/*
 * 公开分享与卡片分享。
 *
 * 负责公开页 host/path 限制、公开分享 token、访问统计和单卡 SVG token。
 * KV key 前缀和 token URL 形态是线上兼容协议，禁止随意改名。
 */
  getPublicShareBaseUrl(env) {
      const raw = String(env.PUBLIC_SHARE_BASE_URL || '').trim();
      if (!raw) return '';
      try {
          const parsed = new URL(raw);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
          parsed.pathname = parsed.pathname.replace(/\/+$/, '');
          parsed.search = '';
          parsed.hash = '';
          return parsed.toString().replace(/\/$/, '');
      } catch(e) {
          return '';
      }
  },

  getPublicShareWildcardDomain(env) {
      const raw = String(env.PUBLIC_SHARE_WILDCARD_DOMAIN || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^\*\./, '').replace(/\.+$/, '').toLowerCase();
      if (!raw) return '';
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(raw)) return '';
      return raw;
  },

  shouldBlockPublicShareAccess(request) {
      const country = String(request.headers.get('CF-IPCountry') || '').trim().toUpperCase();
      return country === 'CN';
  },

  getHostnameFromBaseUrl(value) {
      try { return new URL(value).hostname.toLowerCase(); } catch(e) { return ''; }
  },

  isPublicShareHost(request, env) {
      const host = String(request.headers.get('Host') || '').split(':')[0].toLowerCase();
      if (!host) return false;
      const wildcardDomain = this.getPublicShareWildcardDomain(env);
      if (wildcardDomain && host.endsWith('.' + wildcardDomain)) return true;
      const baseHost = this.getHostnameFromBaseUrl(this.getPublicShareBaseUrl(env));
      return Boolean(baseHost && host === baseHost);
  },

  isAllowedPublicSharePath(pathname) {
      return pathname === '/public' || /^\/public\/[a-f0-9]{24}$/i.test(pathname) || /^\/card\/[a-f0-9]{24}\.svg$/i.test(pathname) || pathname === '/proxy-img' || pathname === '/app-icon.svg';
  },

  generatePublicShareToken() {
      const bytes = new Uint8Array(12);
      if (globalThis.crypto && globalThis.crypto.getRandomValues) {
          globalThis.crypto.getRandomValues(bytes);
      } else {
          for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
      }
      return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  },

  async storePublicShareToken(env, token, expiresAt, data = {}) {
      if (!env.EMBY_DB) return false;
      const now = Date.now();
      const record = {
          token: String(token || ''),
          createdAt: Number(data.createdAt) || now,
          expiresAt: Number(expiresAt) || 0,
          origin: String(data.origin || ''),
          views: Number(data.views) || 0,
          lastViewedAt: Number(data.lastViewedAt) || 0,
          telegramProfile: data.telegramProfile && typeof data.telegramProfile === 'object' ? data.telegramProfile : null,
          hideCounts: Boolean(data.hideCounts)
      };
      await env.EMBY_DB.put('public_share_token:' + token, JSON.stringify(record));
      return true;
  },

  async deletePublicShareToken(env, token) {
      if (!env.EMBY_DB || !token) return false;
      await env.EMBY_DB.delete('public_share_token:' + token);
      return true;
  },

  async getPublicShareToken(env, token) {
      if (!env.EMBY_DB) return null;
      const raw = await env.EMBY_DB.get('public_share_token:' + token);
      if (!raw) return null;
      try {
          return JSON.parse(raw);
      } catch(e) {
          return null;
      }
  },

  async hashPublicShareVisitor(value) {
      const text = String(value || '').trim();
      if (!text) return '';
      if (!globalThis.crypto || !globalThis.crypto.subtle) return text.replace(/[^a-zA-Z0-9_.:-]/g, '').slice(0, 120);
      const input = new TextEncoder().encode(text);
      const digest = await globalThis.crypto.subtle.digest('SHA-256', input);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  getPublicShareVisitorId(request) {
      const cfIp = request.headers.get('CF-Connecting-IP');
      if (cfIp) return cfIp.trim();
      const forwarded = request.headers.get('X-Forwarded-For');
      if (forwarded) return forwarded.split(',')[0].trim();
      const realIp = request.headers.get('X-Real-IP');
      if (realIp) return realIp.trim();
      return '';
  },

  async recordPublicShareView(env, token, tokenRecord, request) {
      if (!env.EMBY_DB || !token) return tokenRecord;
      const now = Date.now();
      const visitorId = this.getPublicShareVisitorId(request);
      const visitorHash = await this.hashPublicShareVisitor(visitorId || 'unknown');
      const visitorKey = 'public_share_visitor:' + token + ':' + visitorHash;
      const seen = await env.EMBY_DB.get(visitorKey);
      const nextRecord = { ...(tokenRecord || {}), token: String(token), lastViewedAt: now };
      if (!seen) {
          nextRecord.views = (Number(nextRecord.views) || 0) + 1;
          await env.EMBY_DB.put(visitorKey, JSON.stringify({ firstViewedAt: now }), { expirationTtl: 90 * 24 * 60 * 60 });
      }
      await env.EMBY_DB.put('public_share_token:' + token, JSON.stringify(nextRecord));
      return nextRecord;
  },

  async listPublicShareStats(env, origin = '') {
      if (!env.EMBY_DB || !env.EMBY_DB.list) return [];
      const keys = [];
      let cursor = undefined;
      do {
          const listed = await env.EMBY_DB.list({ prefix: 'public_share_token:', cursor });
          if (listed && Array.isArray(listed.keys)) keys.push(...listed.keys);
          cursor = listed && listed.list_complete === false ? listed.cursor : undefined;
      } while (cursor);
      const items = [];
      for (const key of keys) {
          const name = key && key.name ? key.name : '';
          const raw = name ? await env.EMBY_DB.get(name) : null;
          if (!raw) continue;
          try {
              const data = JSON.parse(raw);
              const token = String(data.token || name.replace('public_share_token:', ''));
              items.push({
                  token,
                  url: (data.origin || origin || '').replace(/\/$/, '') + '/public/' + token,
                  createdAt: Number(data.createdAt) || 0,
                  expiresAt: Number(data.expiresAt) || 0,
                  views: Number(data.views) || 0,
                  lastViewedAt: Number(data.lastViewedAt) || 0,
                  hasTelegramProfile: Boolean(data.telegramProfile && data.telegramProfile.name),
                  hideCounts: Boolean(data.hideCounts)
              });
          } catch(e) {}
      }
      return items.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
  },

  async storeCardShareToken(env, token, data) {
      if (!env.EMBY_DB) return false;
      await env.EMBY_DB.put('card_share_token:' + token, JSON.stringify({ expiresAt: Number(data.expiresAt) || 0, serverId: String(data.serverId || '') }));
      return true;
  },

  async getCardShareToken(env, token) {
      if (!env.EMBY_DB) return null;
      const raw = await env.EMBY_DB.get('card_share_token:' + token);
      if (!raw) return null;
      try {
          return JSON.parse(raw);
      } catch(e) {
          return null;
      }
  },

  escapeHtml(value) {
      return String(value === undefined || value === null ? '' : value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
  },
