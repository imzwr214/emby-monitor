/*
 * KV 配置持久化和配置规范化。
 *
 * 负责 `config` 主配置读写、revision、服务器配置清洗、历史记录和媒体库字段规范化。
 * KV key `config` 和配置字段 shape 需要兼容旧数据。
 */
  async loadConfig(env) {
      const raw = await env.EMBY_DB.get('config');
      if (!raw) return this.withRevision({ servers: [], icons: {}, updatedAt: 0, nextScheduledCursor: 0, lastPlayedQueueDayKey: '', lastPlayedQueue: [] });
      try { return this.withRevision(JSON.parse(raw)); } catch(e) { return this.withRevision({ servers: [], icons: {}, updatedAt: 0, nextScheduledCursor: 0, lastPlayedQueueDayKey: '', lastPlayedQueue: [] }); }
  },

  async saveConfig(env, config) {
      const currentConfig = await this.loadConfig(env);
      const nextScheduledCursor = Number.isFinite(Number(config && config.nextScheduledCursor))
          ? Math.max(0, Number(config.nextScheduledCursor))
          : (Number.isFinite(Number(currentConfig.nextScheduledCursor)) ? Math.max(0, Number(currentConfig.nextScheduledCursor)) : 0);
      const cleanConfig = this.withRevision({ ...currentConfig, ...config, nextScheduledCursor });
      await env.EMBY_DB.put('config', JSON.stringify(this.sanitizeConfig(cleanConfig)));
      return cleanConfig;
  },

  withRevision(config) {
      const clean = this.sanitizeConfig(config);
      clean.revision = this.configRevision(clean);
      return clean;
  },

  configRevision(config) {
      const clean = this.sanitizeConfig(config);
      const settingsOnly = {
          icons: clean.icons, telegram: clean.telegram, logging: clean.logging,
          servers: clean.servers.map((server) => ({ id: server.id, name: server.name, url: server.url, fallbackUrls: server.fallbackUrls, customIcon: server.customIcon, mediaStats: { enabled: Boolean(server.mediaStats && server.mediaStats.enabled), username: server.mediaStats ? server.mediaStats.username : '', password: server.mediaStats ? server.mediaStats.password : '', keepAlive: server.mediaStats ? { enabled: Boolean(server.mediaStats.keepAlive && server.mediaStats.keepAlive.enabled), periodDays: server.mediaStats.keepAlive ? server.mediaStats.keepAlive.periodDays : 30, alertDays: server.mediaStats.keepAlive ? server.mediaStats.keepAlive.alertDays : 27 } : { enabled: false, periodDays: 30, alertDays: 27 } } }))
      };
      const text = JSON.stringify(settingsOnly);
      let hash = 2166136261;
      for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
      return (hash >>> 0).toString(36);
  },

  sanitizeConfig(config) {
      const clean = { servers: [], icons: {}, telegram: { enabled: false, botToken: '', chatId: '' }, logging: { enabled: false }, updatedAt: 0, nextScheduledCursor: 0, lastPlayedDailyKey: '', lastPlayedCursor: 0, lastPlayedQueueDayKey: '', lastPlayedQueue: [] };
      if (config && Number.isFinite(Number(config.updatedAt))) clean.updatedAt = Math.max(0, Number(config.updatedAt));
      if (config && Number.isFinite(Number(config.nextScheduledCursor))) clean.nextScheduledCursor = Math.max(0, Number(config.nextScheduledCursor));
      if (config && typeof config.lastPlayedDailyKey === 'string') clean.lastPlayedDailyKey = config.lastPlayedDailyKey.slice(0, 16);
      if (config && Number.isFinite(Number(config.lastPlayedCursor))) clean.lastPlayedCursor = Math.max(0, Number(config.lastPlayedCursor));
      if (config && typeof config.lastPlayedQueueDayKey === 'string') clean.lastPlayedQueueDayKey = config.lastPlayedQueueDayKey.slice(0, 16);
      if (config && Array.isArray(config.lastPlayedQueue)) {
          clean.lastPlayedQueue = config.lastPlayedQueue
              .map((value) => String(value || '').slice(0, 120))
              .filter(Boolean)
              .slice(0, 512);
      }
      if (config && config.telegram && typeof config.telegram === 'object') {
          clean.telegram = { enabled: Boolean(config.telegram.enabled), botToken: String(config.telegram.botToken || '').trim(), chatId: String(config.telegram.chatId || '').trim() };
      }
      if (config && config.logging && typeof config.logging === 'object') {
          clean.logging = { enabled: Boolean(config.logging.enabled) };
      }
      if (config && Array.isArray(config.servers)) {
          clean.servers = config.servers
              .map((s) => {
                  const parsed = this.normalizeServerUrl(s && s.url);
                  if (!parsed) return null;
                  const mainUrl = parsed.toString().replace(/\/$/, '');
                  const seenFallbackUrls = new Set([mainUrl.toLowerCase()]);
                  const fallbackUrls = Array.isArray(s.fallbackUrls) ? s.fallbackUrls
                      .map((fallbackUrl) => this.normalizeServerUrl(fallbackUrl))
                      .filter(Boolean)
                      .map((fallbackUrl) => fallbackUrl.toString().replace(/\/$/, ''))
                      .filter((fallbackUrl) => {
                          const key = fallbackUrl.toLowerCase();
                          if (seenFallbackUrls.has(key)) return false;
                          seenFallbackUrls.add(key);
                          return true;
                      })
                      .slice(0, 4) : [];
                  return {
                      id: s.id || Date.now(), name: String(s.name || parsed.hostname).slice(0, 80), url: mainUrl, fallbackUrls, customIcon: typeof s.customIcon === 'string' ? s.customIcon : null,
                      status: ['online', 'offline', 'unknown'].includes(s.status) ? s.status : 'unknown',
                      totalChecks: Number.isFinite(Number(s.totalChecks)) ? Math.max(0, Number(s.totalChecks)) : 0, successfulChecks: Number.isFinite(Number(s.successfulChecks)) ? Math.max(0, Number(s.successfulChecks)) : 0,
                      uptime: typeof s.uptime === 'string' ? s.uptime : '0.0', latency: Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0,
                      lastCheck: Number.isFinite(Number(s.lastCheck)) ? Number(s.lastCheck) : 0, offlineSince: Number.isFinite(Number(s.offlineSince)) ? Math.max(0, Number(s.offlineSince)) : 0,
                      offlineAlertSentAt: Number.isFinite(Number(s.offlineAlertSentAt)) ? Math.max(0, Number(s.offlineAlertSentAt)) : 0,
                      consecutiveFailures: Number.isFinite(Number(s.consecutiveFailures)) ? Math.max(0, Number(s.consecutiveFailures)) : 0,
                      firstFailureAt: Number.isFinite(Number(s.firstFailureAt)) ? Math.max(0, Number(s.firstFailureAt)) : 0,
                      addressProbeResults: this.normalizeAddressProbeResults(s.addressProbeResults),
                      history: this.normalizeHistory(s.history, s.lastCheck), mediaStats: this.normalizeMediaStats(s.mediaStats)
                  };
              })
              .filter(Boolean);
      }
      if (config && config.icons && typeof config.icons === 'object' && !Array.isArray(config.icons)) clean.icons = this.extractIcons(config.icons);
      return clean;
  },

  normalizeAddressProbeResults(results) {
      if (!Array.isArray(results)) return [];
      return results.slice(0, 5).map((item) => {
          const parsed = this.normalizeServerUrl(item && item.url);
          if (!parsed) return null;
          return {
              url: parsed.toString().replace(/\/$/, ''),
              ok: Boolean(item.ok),
              latency: Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : 0
          };
      }).filter(Boolean);
  },

  normalizeHistory(history, fallbackTime = 0) {
      if (!Array.isArray(history)) return [];
      const now = Date.now();
      const baseTime = Number.isFinite(Number(fallbackTime)) && Number(fallbackTime) > 0 ? Number(fallbackTime) : now;
      return history.slice(-this.HISTORY_LIMIT).map((entry, index, arr) => {
          if (entry && typeof entry === 'object') {
              const status = entry.status === 'online' || entry.status === 1 || entry.value === 1 ? 'online' : 'offline';
              const time = Number.isFinite(Number(entry.time)) && Number(entry.time) > 0 ? Number(entry.time) : baseTime - ((arr.length - index - 1) * 60000);
              return { status, time, latency: Number.isFinite(Number(entry.latency)) ? Math.max(0, Number(entry.latency)) : 0 };
          }
          return { status: entry ? 'online' : 'offline', time: baseTime - ((arr.length - index - 1) * 60000), latency: 0 };
      });
  },

  normalizeMediaStats(mediaStats) {
      const emptyCounts = { movie: 0, series: 0, episode: 0 };
      const normalizeKeepAlive = (value) => {
          const source = value && typeof value === 'object' ? value : {};
          const periodDays = Number.isFinite(Number(source.periodDays)) && Number(source.periodDays) > 0 ? Math.floor(Number(source.periodDays)) : 30;
          const rawAlertDays = Number.isFinite(Number(source.alertDays)) && Number(source.alertDays) > 0 ? Math.floor(Number(source.alertDays)) : 27;
          const alertDays = Math.min(rawAlertDays, Math.max(1, periodDays - 1));
          return {
              enabled: Boolean(source.enabled),
              periodDays,
              alertDays,
              lastPlayedAt: Number.isFinite(Number(source.lastPlayedAt)) ? Math.max(0, Number(source.lastPlayedAt)) : 0,
              lastCheckedAt: Number.isFinite(Number(source.lastCheckedAt)) ? Math.max(0, Number(source.lastCheckedAt)) : 0,
              alertSentAt: Number.isFinite(Number(source.alertSentAt)) ? Math.max(0, Number(source.alertSentAt)) : 0
          };
      };
      if (!mediaStats || typeof mediaStats !== 'object') {
          return { enabled: false, username: '', password: '', accessToken: '', userId: '', deviceId: '', clientProfile: '', lastCheck: 0, lastError: '', counts: null, previousCounts: null, delta24h: null, todayCounts: null, yesterdayCounts: null, dailyDelta: null, dailyKey: '', lastPlayedAt: 0, lastPlayedCheck: 0, lastPlayedError: '', lastPlayedItem: null, keepAlive: normalizeKeepAlive(null) };
      }
      const cleanCounts = (counts) => {
          if (!counts || typeof counts !== 'object') return null;
          return { movie: Number.isFinite(Number(counts.movie)) ? Math.max(0, Number(counts.movie)) : emptyCounts.movie, series: Number.isFinite(Number(counts.series)) ? Math.max(0, Number(counts.series)) : emptyCounts.series, episode: Number.isFinite(Number(counts.episode)) ? Math.max(0, Number(counts.episode)) : emptyCounts.episode, time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0 };
      };
      const cleanDeltaCounts = (counts) => {
          if (!counts || typeof counts !== 'object') return null;
          return { movie: Number.isFinite(Number(counts.movie)) ? Number(counts.movie) : 0, series: Number.isFinite(Number(counts.series)) ? Number(counts.series) : 0, episode: Number.isFinite(Number(counts.episode)) ? Number(counts.episode) : 0, time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0 };
      };
      const clean = {
          enabled: Boolean(mediaStats.enabled), username: String(mediaStats.username || '').slice(0, 120), password: String(mediaStats.password || ''), accessToken: String(mediaStats.accessToken || ''), userId: String(mediaStats.userId || ''),
          deviceId: String(mediaStats.deviceId || ('forward-' + Math.random().toString(36).slice(2))).slice(0, 120), clientProfile: String(mediaStats.clientProfile || '').slice(0, 40), lastCheck: Number.isFinite(Number(mediaStats.lastCheck)) ? Number(mediaStats.lastCheck) : 0,
          lastError: String(mediaStats.lastError || '').slice(0, 160), counts: cleanCounts(mediaStats.counts), previousCounts: cleanCounts(mediaStats.previousCounts), delta24h: cleanDeltaCounts(mediaStats.delta24h),
          todayCounts: cleanCounts(mediaStats.todayCounts), yesterdayCounts: cleanCounts(mediaStats.yesterdayCounts), dailyDelta: cleanDeltaCounts(mediaStats.dailyDelta), dailyKey: String(mediaStats.dailyKey || ''),
          lastPlayedAt: Number.isFinite(Number(mediaStats.lastPlayedAt)) ? Math.max(0, Number(mediaStats.lastPlayedAt)) : 0,
          lastPlayedCheck: Number.isFinite(Number(mediaStats.lastPlayedCheck)) ? Math.max(0, Number(mediaStats.lastPlayedCheck)) : 0,
          lastPlayedError: String(mediaStats.lastPlayedError || '').slice(0, 160),
          lastPlayedItem: mediaStats.lastPlayedItem && typeof mediaStats.lastPlayedItem === 'object' ? {
              id: String(mediaStats.lastPlayedItem.id || '').slice(0, 80),
              name: String(mediaStats.lastPlayedItem.name || '').slice(0, 180),
              type: String(mediaStats.lastPlayedItem.type || '').slice(0, 40),
              seriesName: String(mediaStats.lastPlayedItem.seriesName || '').slice(0, 180),
              seasonName: String(mediaStats.lastPlayedItem.seasonName || '').slice(0, 120),
              indexNumber: Number.isFinite(Number(mediaStats.lastPlayedItem.indexNumber)) ? Number(mediaStats.lastPlayedItem.indexNumber) : null,
              playedPercentage: Number.isFinite(Number(mediaStats.lastPlayedItem.playedPercentage)) ? Math.max(0, Math.min(100, Number(mediaStats.lastPlayedItem.playedPercentage))) : null
          } : null,
          keepAlive: normalizeKeepAlive(mediaStats.keepAlive)
      };
      const hasStoredDailySnapshots = Boolean(clean.todayCounts || clean.yesterdayCounts);
      if (!clean.todayCounts && clean.counts) clean.todayCounts = clean.counts;
      if (!clean.yesterdayCounts && !hasStoredDailySnapshots && clean.previousCounts) clean.yesterdayCounts = clean.previousCounts;
      if (!clean.dailyDelta && clean.counts && clean.yesterdayCounts) {
          clean.dailyDelta = { movie: clean.counts.movie - clean.yesterdayCounts.movie, series: clean.counts.series - clean.yesterdayCounts.series, episode: clean.counts.episode - clean.yesterdayCounts.episode, time: clean.counts.time };
      }
      if (!clean.dailyKey && clean.counts && clean.counts.time) clean.dailyKey = this.getShanghaiDayKey(clean.counts.time);
      return clean;
  },
