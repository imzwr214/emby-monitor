/*
 * URL 归一化和外部请求安全边界。
 *
 * 负责服务器地址和外部资源 URL 的协议/地址安全校验。
 * 这是 SSRF 防护边界；不要放宽到非 http/https，也不要绕过内网地址拦截。
 */
  normalizeServerUrl(value) {
      if (!value || typeof value !== 'string') return null;
      let input = value.trim();
      if (!/^https?:\/\//i.test(input)) input = 'https://' + input;
      return this.parsePublicHttpUrl(input);
  },

  parsePublicHttpUrl(value) {
      try {
          const parsed = new URL(value);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
          const host = parsed.hostname.toLowerCase();
          if (host === 'localhost' || host.endsWith('.localhost') || host === 'metadata.google.internal' || host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === '0.0.0.0' || host === '::1' || host.startsWith('169.254.')) return null;
          parsed.hash = ''; return parsed;
      } catch(e) { return null; }
  },
