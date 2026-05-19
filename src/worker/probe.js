/*
 * 在线探测和媒体库统计刷新。
 *
 * 负责上海自然日媒体增量、登录态验证、HTTP 超时、主/备用地址探测、媒体统计刷新和 `runProbeLogic()`。
 * 这里会写回历史、在线率、通知状态和媒体统计，不能改变配置 shape。
 */
  getShanghaiDayKey(time = Date.now(), offsetDays = 0) {
      const shanghaiTime = time + (8 * 60 * 60 * 1000) + (offsetDays * 24 * 60 * 60 * 1000);
      return new Date(shanghaiTime).toISOString().slice(0, 10);
  },

  isShanghaiMidnightWindow(time = Date.now()) {
      const shanghai = new Date(time + (8 * 60 * 60 * 1000));
      return shanghai.getUTCHours() === 0;
  },

  buildDailyMediaStats(media, counts, now = Date.now()) {
      const todayKey = this.getShanghaiDayKey(now);
      const yesterdayKey = this.getShanghaiDayKey(now, -1);
      const countsWithTime = { ...counts, time: counts.time || now };
      let todayCounts = media.todayCounts || null;
      let yesterdayCounts = media.yesterdayCounts || null;

      if (media.dailyKey && media.dailyKey !== todayKey) {
          if (media.dailyKey === yesterdayKey && todayCounts) { yesterdayCounts = todayCounts; } else if (!yesterdayCounts && media.counts) { yesterdayCounts = media.counts; }
          todayCounts = countsWithTime;
      } else if (!todayCounts) { todayCounts = countsWithTime; }

      if (this.isShanghaiMidnightWindow(now)) { todayCounts = countsWithTime; }

      const baseline = yesterdayCounts || media.previousCounts || null;
      const dailyDelta = baseline ? { movie: countsWithTime.movie - baseline.movie, series: countsWithTime.series - baseline.series, episode: countsWithTime.episode - baseline.episode, time: countsWithTime.time } : { movie: 0, series: 0, episode: 0, time: countsWithTime.time };

      return { todayCounts, yesterdayCounts, dailyDelta, dailyKey: todayKey };
  },

  async verifyWithLoginState(server) {
      const media = server.mediaStats || {};
      if (!media.enabled || !media.accessToken) return null;
      try {
          const start = Date.now();
          await this.fetchEmbyMediaCounts(server, media.accessToken);
          return { ok: true, latency: Date.now() - start };
      } catch(e) {
          if (String(e.message || '').includes('Token 失效')) return null;
          return { ok: false, latency: 0 };
      }
  },

  async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), timeoutMs);
      try { return await fetch(url, { ...options, signal: c.signal }); } finally { clearTimeout(t); }
  },

  async probeEmbyServer(server, targetUrl) {
      const headers = { 'Accept': 'application/json,text/plain,*/*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' };
      const paths = ['/emby/System/Info/Public', '/System/Info/Public', '/emby/Users/Public'];
      const start = Date.now();
      for (const path of paths) {
          try {
              const r = await this.fetchWithTimeout(targetUrl + path, { method: 'GET', headers }, 5000);
              if (r.status >= 200 && r.status < 400) return { ok: true, latency: Date.now() - start };
              if (r.status === 401 || r.status === 403) return { ok: true, latency: Date.now() - start };
          } catch(e) {}
      }
      return { ok: false, latency: 0 };
  },

  getProbeTargets(server) {
      const targets = [];
      const seen = new Set();
      for (const value of [server.url, ...(Array.isArray(server.fallbackUrls) ? server.fallbackUrls : [])]) {
          const parsed = this.normalizeServerUrl(value);
          if (!parsed) continue;
          const targetUrl = parsed.toString().replace(/\/$/, '');
          const key = targetUrl.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          targets.push(targetUrl);
          if (targets.length >= 5) break;
      }
      return targets;
  },

  async probeEmbyServerWithFallbacks(server) {
      const targets = this.getProbeTargets(server);
      const addressProbeResults = [];
      for (const targetUrl of targets) {
          let result = { ok: false, latency: 0 };
          try {
              result = await this.probeEmbyServer(server, targetUrl);
          } catch(e) {}
          addressProbeResults.push({ url: targetUrl, ok: Boolean(result.ok), latency: Number(result.latency) || 0 });
          if (result.ok) {
              return { ok: true, latency: Number(result.latency) || 0, addressProbeResults };
          }
      }
      return { ok: false, latency: 0, addressProbeResults };
  },

  async refreshMediaStatsIfNeeded(server, force = false) {
      const media = server.mediaStats || {};
      server.mediaStatsTouched = false;
      if (!media.enabled) return server;
      const now = Date.now();
      const todayKey = this.getShanghaiDayKey(now);
      const needsDailySnapshot = media.dailyKey !== todayKey || !media.todayCounts || !media.dailyDelta;
      const needsLastPlayedBackfill = !Number(media.lastPlayedAt);
      if (!force && media.lastCheck && !needsDailySnapshot && !needsLastPlayedBackfill) return server;
      server.mediaStatsTouched = true;

      try {
          let token = media.accessToken;
          let userId = media.userId || '';
          let counts;
          try {
              if (!token) {
                  const login = await this.loginEmbyForMedia(server);
                  token = login.accessToken;
                  userId = login.userId || userId;
              }
              counts = await this.fetchEmbyMediaCounts(server, token);
          } catch(e) {
              const login = await this.loginEmbyForMedia(server);
              token = login.accessToken;
              userId = login.userId || userId;
              counts = await this.fetchEmbyMediaCounts(server, token);
          }
          const dailyStats = this.buildDailyMediaStats(media, counts, now);
          const previous = dailyStats.yesterdayCounts || media.previousCounts || media.counts || null;
          let lastPlayedAt = Number(media.lastPlayedAt) || 0;
          try {
              lastPlayedAt = await this.fetchEmbyLastPlayed(server, token, userId) || lastPlayedAt;
          } catch(e) {}
          server.mediaStats = {
              ...media, accessToken: token, userId, previousCounts: previous, counts, todayCounts: dailyStats.todayCounts, yesterdayCounts: dailyStats.yesterdayCounts, dailyDelta: dailyStats.dailyDelta, dailyKey: dailyStats.dailyKey,
              delta24h: previous ? { movie: counts.movie - previous.movie, series: counts.series - previous.series, episode: counts.episode - previous.episode, time: counts.time } : { movie: 0, series: 0, episode: 0, time: counts.time },
              lastCheck: counts.time, lastPlayedAt, lastPlayedCheckAt: lastPlayedAt ? now : (Number(media.lastPlayedCheckAt) || 0), lastError: ''
          };
      } catch(e) { server.mediaStats = { ...media, lastError: e.message || '媒体库统计失败' }; }
      return server;
  },

  getKeepAliveState(server, now = Date.now()) {
      const keepAlive = server && server.mediaStats ? server.mediaStats.keepAlive : null;
      if (!keepAlive || !keepAlive.enabled) return { enabled: false, label: '保号', tone: 'disabled', days: null };
      const periodDays = Math.max(1, Math.floor(Number(keepAlive.periodDays) || 30));
      const lastPlayedAt = Number(keepAlive.lastPlayedAt) || 0;
      if (!lastPlayedAt) return { enabled: true, label: '保号', tone: 'warning', days: null };
      const inactiveDays = Math.max(0, Math.floor((now - lastPlayedAt) / (24 * 60 * 60 * 1000)));
      const remainingDays = periodDays - inactiveDays;
      if (remainingDays < 0) return { enabled: true, label: '!逾期', tone: 'danger', days: remainingDays };
      if (remainingDays <= 3) return { enabled: true, label: '!' + remainingDays + '天', tone: 'warning', days: remainingDays };
      return { enabled: true, label: remainingDays + '天', tone: 'ok', days: remainingDays };
  },

  buildKeepAliveMessage(server, keepAlive, inactiveDays, lastPlayedAt) {
      const periodDays = Math.max(1, Math.floor(Number(keepAlive.periodDays) || 30));
      const remainingDays = periodDays - inactiveDays;
      const lastPlayedText = lastPlayedAt ? new Date(lastPlayedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }) : '未知';
      return [
          '⚠️ 保号提醒',
          '',
          '服务器：' + (server.name || server.url || 'Unknown'),
          '',
          '已有 ' + inactiveDays + ' 天未播放',
          '',
          '活跃周期：' + periodDays + ' 天',
          '',
          '距账号删除还剩：' + remainingDays + ' 天',
          '',
          '最后播放：' + lastPlayedText,
          '',
          '请尽快播放任意内容以保留账号。'
      ].join('\n');
  },

  async refreshKeepAliveIfNeeded(server, now = Date.now()) {
      const media = server.mediaStats || {};
      const keepAlive = media.keepAlive || {};
      if (!keepAlive.enabled) return { server, alert: null, touched: false };
      const nextKeepAlive = { ...keepAlive, lastCheckedAt: now };
      let token = media.accessToken || '';
      let userId = media.userId || '';
      try {
          const login = await this.loginEmbyForMedia(server);
          token = login.accessToken;
          userId = login.userId || userId;
          const lastPlayedAt = await this.fetchEmbyLastPlayed(server, token, userId);
          const previousPlayedAt = Number(keepAlive.lastPlayedAt) || 0;
          if (lastPlayedAt && lastPlayedAt > previousPlayedAt) nextKeepAlive.alertSentAt = 0;
          nextKeepAlive.lastPlayedAt = lastPlayedAt || previousPlayedAt;
          const effectiveLastPlayedAt = nextKeepAlive.lastPlayedAt;
          const periodDays = Math.max(1, Math.floor(Number(nextKeepAlive.periodDays) || 30));
          const alertDays = Math.min(Math.max(1, Math.floor(Number(nextKeepAlive.alertDays) || 27)), Math.max(1, periodDays - 1));
          nextKeepAlive.periodDays = periodDays;
          nextKeepAlive.alertDays = alertDays;
          let alert = null;
          if (effectiveLastPlayedAt) {
              const inactiveDays = Math.max(0, Math.floor((now - effectiveLastPlayedAt) / (24 * 60 * 60 * 1000)));
              const canRepeat = !nextKeepAlive.alertSentAt || now - nextKeepAlive.alertSentAt >= 24 * 60 * 60 * 1000;
              if (inactiveDays >= alertDays && canRepeat) {
                  alert = { message: this.buildKeepAliveMessage(server, nextKeepAlive, inactiveDays, effectiveLastPlayedAt), serverId: server.id, checkedAt: now };
              }
          }
          return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, lastPlayedAt: effectiveLastPlayedAt || Number(media.lastPlayedAt) || 0, lastPlayedCheckAt: now, keepAlive: nextKeepAlive } }, alert, touched: true };
      } catch(e) {
          return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, keepAlive: nextKeepAlive } }, alert: null, touched: true };
      }
  },

  async runProbeLogic(env, config, options = {}) {
      if (!config || !config.servers || config.servers.length === 0) return config;
      const forceMedia = Boolean(options.forceMedia);
      const batchSize = forceMedia ? 4 : config.servers.length;
      const cursor = forceMedia ? Math.max(0, Number(options.cursor) || 0) : 0;
      const batchEnd = Math.min(config.servers.length, cursor + batchSize);
      const batchIds = new Set(config.servers.slice(cursor, batchEnd).map((s) => s.id));

      const probePromises = config.servers.filter((s) => batchIds.has(s.id)).map(async (s) => {
          const previousStatus = s.status;
          s.totalChecks = (s.totalChecks || 0) + 1;
          s.history = this.normalizeHistory(s.history, s.lastCheck);
          const checkedAt = Date.now();

          const probeTargets = this.getProbeTargets(s);
          if (!probeTargets.length) {
              s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
              s.addressProbeResults = [];
              if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
              s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
              s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
              await this.refreshMediaStatsIfNeeded(s, forceMedia || !s.mediaStats || !s.mediaStats.lastCheck);
              s.previousStatus = previousStatus; return s;
          }

          let isAlive = false;
          let finalLatency = 0;
          let addressProbeResults = [];

          try {
              const result = await this.probeEmbyServerWithFallbacks(s);
              isAlive = result.ok; finalLatency = result.latency; addressProbeResults = result.addressProbeResults || [];
          } catch(e) { isAlive = false; }
          s.addressProbeResults = addressProbeResults;

          if (isAlive) {
              s.successfulChecks = (s.successfulChecks || 0) + 1; s.status = 'online'; s.latency = finalLatency; s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
          } else {
              s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
          }

          if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
          s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
          s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
          await this.refreshMediaStatsIfNeeded(s, forceMedia || !s.mediaStats || !s.mediaStats.lastCheck);
          s.previousStatus = previousStatus; return s;
      });

      const probedServers = await Promise.all(probePromises);
      const probedById = new Map(probedServers.map((s) => [s.id, s]));
      const latestConfig = await this.loadConfig(env);
      const latestById = new Map(latestConfig.servers.map((s) => [s.id, s]));
      const notifyQueue = [];
      const sourceConfig = latestConfig;
      const baseConfig = this.sanitizeConfig({ icons: sourceConfig.icons !== undefined ? sourceConfig.icons : latestConfig.icons, telegram: sourceConfig.telegram !== undefined ? sourceConfig.telegram : latestConfig.telegram, servers: sourceConfig.servers, updatedAt: sourceConfig.updatedAt || latestConfig.updatedAt || 0 });
      const mergedConfig = {
          icons: baseConfig.icons, telegram: baseConfig.telegram, updatedAt: Math.max(baseConfig.updatedAt || 0, latestConfig.updatedAt || 0),
          servers: baseConfig.servers.map((latest) => {
              const probed = probedById.get(latest.id);
              if (!probed || probed.url !== latest.url) return latest;
              const previouslySaved = latestById.get(latest.id) || latest;
              const mergedServer = { ...latest, status: probed.status, totalChecks: probed.totalChecks, successfulChecks: probed.successfulChecks, uptime: probed.uptime, latency: probed.latency, lastCheck: probed.lastCheck, offlineSince: probed.offlineSince, offlineAlertSentAt: probed.offlineAlertSentAt, addressProbeResults: probed.addressProbeResults || [], history: probed.history, mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats };
              const oldStatus = previouslySaved.url === latest.url && JSON.stringify(previouslySaved.fallbackUrls || []) === JSON.stringify(latest.fallbackUrls || []) ? previouslySaved.status : probed.previousStatus;
              const telegramEnabled = this.isTelegramEnabled(env, baseConfig);
              const shouldSendOffline = this.shouldSendOfflineAlert(mergedServer);
              if (mergedServer.status === 'offline') {
                  console.log('[notify] offline check', {
                      serverId: mergedServer.id,
                      serverName: mergedServer.name,
                      oldStatus,
                      status: mergedServer.status,
                      telegramEnabled,
                      offlineSince: mergedServer.offlineSince,
                      lastCheck: mergedServer.lastCheck,
                      offlineMs: mergedServer.offlineSince ? mergedServer.lastCheck - mergedServer.offlineSince : 0,
                      offlineAlertSentAt: mergedServer.offlineAlertSentAt,
                      shouldSendOffline
                  });
              }
              if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'offline' && shouldSendOffline) {
                  notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
              } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && previouslySaved.offlineAlertSentAt) {
                  notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: previouslySaved.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
              }
              return mergedServer;
          })
      };
      if (forceMedia) {
          mergedConfig.nextCursor = batchEnd < baseConfig.servers.length ? batchEnd : 0;
          mergedConfig.hasMore = batchEnd < baseConfig.servers.length;
      }
      const keepAliveTargets = forceMedia ? mergedConfig.servers.filter((server) => batchIds.has(server.id)) : mergedConfig.servers;
      const keepAliveResults = await Promise.all(keepAliveTargets.map((server) => this.refreshKeepAliveIfNeeded(server)));
      for (const result of keepAliveResults) {
          if (!result || !result.touched) continue;
          const index = mergedConfig.servers.findIndex((server) => server.id === result.server.id);
          if (index >= 0) mergedConfig.servers[index] = result.server;
          if (result.alert && this.isTelegramEnabled(env, baseConfig)) {
              notifyQueue.push({ ...result.alert, kind: 'keepAlive' });
          }
      }
      if (notifyQueue.length) {
          console.log('[notify] queue prepared', notifyQueue.map((item) => ({ kind: item.kind, serverId: item.serverId || null, lastCheck: item.lastCheck || null })));
      }
      const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(env, item.message, baseConfig)));
      if (notifyQueue.length) {
          console.log('[notify] send results', sendResults);
          let updated = false;
          for (const [index, ok] of sendResults.entries()) {
              const item = notifyQueue[index];
              if (!ok || !item) continue;
              const targetId = item.serverId;
              const targetServer = mergedConfig.servers.find((server) => server.id === targetId);
              if (targetServer && item.kind === 'offline') {
                  targetServer.offlineAlertSentAt = item.lastCheck;
                  updated = true;
              } else if (targetServer && item.kind === 'keepAlive' && targetServer.mediaStats && targetServer.mediaStats.keepAlive) {
                  targetServer.mediaStats = { ...targetServer.mediaStats, keepAlive: { ...targetServer.mediaStats.keepAlive, alertSentAt: item.checkedAt || Date.now() } };
                  updated = true;
              }
          }
          if (updated) {
              mergedConfig.updatedAt = Math.max(mergedConfig.updatedAt || 0, Date.now());
          }
      }
      await this.saveConfig(env, mergedConfig);
      return mergedConfig;
  }
,
