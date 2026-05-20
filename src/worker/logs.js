/*
 * 运行日志。
 *
 * 负责把 Worker 关键操作写入 KV，供后台设置页查看和下载。
 * 日志只记录排障需要的摘要字段，敏感字段会脱敏。
 */
  LOG_KEY: 'runtime_logs',
  LOG_LIMIT: 300,

  redactLogValue(key, value) {
      const lowerKey = String(key || '').toLowerCase();
      if (/(token|password|secret|authorization|cookie|apikey|api_key)/.test(lowerKey)) {
          return value ? '[redacted]' : value;
      }
      if (typeof value === 'string') {
          return value.length > 500 ? value.slice(0, 500) + '...' : value;
      }
      return value;
  },

  sanitizeLogMeta(input, depth = 0) {
      if (depth > 4) return '[max-depth]';
      if (input === null || input === undefined) return input;
      if (typeof input !== 'object') return this.redactLogValue('', input);
      if (Array.isArray(input)) return input.slice(0, 80).map((item) => this.sanitizeLogMeta(item, depth + 1));
      const output = {};
      for (const [key, value] of Object.entries(input).slice(0, 80)) {
          output[key] = this.redactLogValue(key, typeof value === 'object' && value !== null ? this.sanitizeLogMeta(value, depth + 1) : value);
      }
      return output;
  },

  async readRuntimeLogs(env) {
      const raw = await env.EMBY_DB.get(this.LOG_KEY);
      if (!raw) return [];
      try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
      } catch(e) {
          return [];
      }
  },

  isRuntimeLoggingEnabled(config) {
      return Boolean(config && config.logging && config.logging.enabled);
  },

  async appendRuntimeLog(env, level, event, message, meta = {}, options = {}) {
      if (!env || !env.EMBY_DB) return;
      if (!options.force) {
          const config = options.config || await this.loadConfig(env);
          if (!this.isRuntimeLoggingEnabled(config)) return;
      }
      const entry = {
          time: Date.now(),
          level: ['debug', 'info', 'warn', 'error'].includes(level) ? level : 'info',
          event: String(event || 'event').slice(0, 80),
          message: String(message || '').slice(0, 500),
          meta: this.sanitizeLogMeta(meta)
      };
      try {
          const logs = await this.readRuntimeLogs(env);
          logs.push(entry);
          await env.EMBY_DB.put(this.LOG_KEY, JSON.stringify(logs.slice(-this.LOG_LIMIT)));
      } catch(e) {
          console.log('[logs] append failed', e && e.message ? e.message : String(e));
      }
  },

  async clearRuntimeLogs(env) {
      await env.EMBY_DB.put(this.LOG_KEY, JSON.stringify([]));
  },

  formatRuntimeLogs(logs) {
      return (Array.isArray(logs) ? logs : []).map((entry) => {
          const time = new Date(Number(entry.time) || Date.now()).toISOString();
          const meta = entry.meta && Object.keys(entry.meta).length ? ' ' + JSON.stringify(entry.meta) : '';
          return '[' + time + '] [' + String(entry.level || 'info').toUpperCase() + '] ' + String(entry.event || 'event') + ' - ' + String(entry.message || '') + meta;
      }).join('\n') + '\n';
  },
