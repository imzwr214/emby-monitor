/*
 * Optional outbound relay support.
 *
 * Cloudflare Workers cannot pin normal fetch() traffic to a country. When
 * EGRESS_PROXY_URL is configured, Emby probes are forwarded to that relay so
 * the relay's non-Japan server becomes the IP seen by Emby.
 */
  getEgressProxyUrl(env = null) {
      const value = env && env.EGRESS_PROXY_URL !== undefined ? env.EGRESS_PROXY_URL : this.EGRESS_PROXY_URL;
      const text = String(value || '').trim();
      if (!text) return '';
      try {
          const parsed = new URL(text);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : '';
      } catch(e) {
          return '';
      }
  },

  getEgressProxyToken(env = null) {
      const value = env && env.EGRESS_PROXY_TOKEN !== undefined ? env.EGRESS_PROXY_TOKEN : this.EGRESS_PROXY_TOKEN;
      return String(value || '').trim();
  },

  isEgressProxyBypassed(url, env = null) {
      const proxyUrl = this.getEgressProxyUrl(env);
      if (!proxyUrl) return true;
      try {
          const target = new URL(String(url || ''));
          const proxy = new URL(proxyUrl);
          return target.origin === proxy.origin;
      } catch(e) {
          return true;
      }
  },

  normalizeEgressHeaders(headers = {}) {
      const normalized = {};
      const source = headers instanceof Headers ? Object.fromEntries(headers.entries()) : (headers || {});
      for (const [key, value] of Object.entries(source)) {
          const name = String(key || '').trim();
          if (!name) continue;
          const lower = name.toLowerCase();
          if (['host', 'connection', 'content-length'].includes(lower)) continue;
          normalized[name] = String(value);
      }
      return normalized;
  },

  async bodyToEgressPayload(body) {
      if (body === undefined || body === null) return { bodyText: '' };
      if (typeof body === 'string') return { bodyText: body };
      if (body instanceof URLSearchParams) return { bodyText: body.toString() };
      if (body instanceof ArrayBuffer) {
          const bytes = new Uint8Array(body);
          let binary = '';
          for (const byte of bytes) binary += String.fromCharCode(byte);
          return { bodyBase64: btoa(binary) };
      }
      return { bodyText: String(body) };
  },

  decodeEgressBody(data) {
      if (!data || typeof data !== 'object') return '';
      if (data.bodyBase64) {
          const binary = atob(String(data.bodyBase64));
          const bytes = new Uint8Array(binary.length);
          for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
          return bytes;
      }
      return String(data.bodyText || data.body || '');
  },

  async fetchViaEgressProxy(url, options = {}, timeoutMs = 5000, env = null) {
      const proxyUrl = this.getEgressProxyUrl(env);
      if (!proxyUrl || this.isEgressProxyBypassed(url, env)) return null;
      const bodyPayload = await this.bodyToEgressPayload(options.body);
      const payload = {
          url: String(url),
          method: String(options.method || 'GET').toUpperCase(),
          headers: this.normalizeEgressHeaders(options.headers),
          ...bodyPayload
      };
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
      const token = this.getEgressProxyToken(env);
      if (token) headers.Authorization = 'Bearer ' + token;
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), timeoutMs);
      try {
          const response = await fetch(proxyUrl, { method: 'POST', headers, body: JSON.stringify(payload), signal: c.signal });
          if (!response.ok) throw new Error('出口中转请求失败 HTTP ' + response.status);
          const data = await response.json();
          const responseHeaders = new Headers(data.headers || {});
          responseHeaders.delete('content-encoding');
          responseHeaders.delete('content-length');
          return new Response(this.decodeEgressBody(data), {
              status: Number(data.status) || 502,
              statusText: String(data.statusText || ''),
              headers: responseHeaders
          });
      } finally {
          clearTimeout(t);
      }
  },

