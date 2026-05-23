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
      if (!media.enabled) return null;
      const start = Date.now();
      if (!media.accessToken && !media.username) return null;
      try {
          if (media.accessToken) await this.fetchEmbyMediaCounts(server, media.accessToken);
          else await this.loginEmbyForMedia(server);
          return { ok: true, latency: Date.now() - start };
      } catch(e) {
          const message = String(e.message || '');
          if (message.includes('Token 失效') && media.username) {
              try {
                  await this.loginEmbyForMedia(server);
                  return { ok: true, latency: Date.now() - start };
              } catch(loginError) {
                  const loginMessage = String(loginError.message || '');
                  if (loginMessage.includes('账号或密码错误') || loginMessage.includes('HTTP 401')) return { ok: true, latency: Date.now() - start };
              }
          }
          if (message.includes('账号或密码错误') || message.includes('HTTP 401')) return { ok: true, latency: Date.now() - start };
          return { ok: false, latency: Date.now() - start };
      }
  },

  async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), timeoutMs);
      try { return await fetch(url, { ...options, signal: c.signal }); } finally { clearTimeout(t); }
  },

  async probeEmbyServer(server, targetUrl) {
      const headers = { 'Accept': 'application/json,text/plain,*/*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' };
      const primaryPath = '/System/Info/Public';
      const fallbackPaths = ['/emby/System/Info/Public', '/emby/Users/Public'];
      const start = Date.now();
      const probePath = async (path) => {
          try {
              const response = await this.fetchWithTimeout(targetUrl + path, { method: 'GET', headers }, 12000);
              if (response.status >= 200 && response.status < 400) return { ok: true, latency: Date.now() - start };
              if (response.status === 401 || response.status === 403) return { ok: true, latency: Date.now() - start };
              return { ok: false, latency: 0 };
          } catch(e) {
              return { ok: false, latency: 0 };
          }
      };
      const primaryResult = await probePath(primaryPath);
      if (primaryResult.ok) return primaryResult;
      for (const path of fallbackPaths) {
          const result = await probePath(path);
          if (result.ok) return result;
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
      if (!force && media.lastCheck && !needsDailySnapshot) return server;
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
          server.mediaStats = {
              ...media, accessToken: token, userId, previousCounts: previous, counts, todayCounts: dailyStats.todayCounts, yesterdayCounts: dailyStats.yesterdayCounts, dailyDelta: dailyStats.dailyDelta, dailyKey: dailyStats.dailyKey,
              delta24h: previous ? { movie: counts.movie - previous.movie, series: counts.series - previous.series, episode: counts.episode - previous.episode, time: counts.time } : { movie: 0, series: 0, episode: 0, time: counts.time },
              lastCheck: counts.time, lastError: ''
          };
      } catch(e) { server.mediaStats = { ...media, lastError: e.message || '媒体库统计失败' }; }
      return server;
  },

  shouldRefreshLastPlayed(media, now = Date.now()) {
      if (!media || !media.enabled || !media.username) return false;
      const lastPlayed = media.lastPlayed || {};
      if (!Number(lastPlayed.checkedAt)) return true;
      return this.getShanghaiDayKey(lastPlayed.checkedAt) !== this.getShanghaiDayKey(now);
  },

  async refreshLastPlayedIfNeeded(env, server, force = false, now = Date.now(), debug = false) {
      const media = server.mediaStats || {};
      if (!media.enabled || !media.username) return { server, touched: false };
      if (!force && !this.shouldRefreshLastPlayed(media, now)) return { server, touched: false };
      const previousLastPlayed = media.lastPlayed || {};
      let token = media.accessToken || '';
      let userId = media.userId || '';
      try {
          const login = await this.loginEmbyForMedia(server);
          token = login.accessToken;
          userId = login.userId || userId;
          const result = await this.fetchEmbyLastPlayed(server, token, userId, { deepScan: true, includeItem: true, debug });
          const lastPlayed = {
              lastPlayedAt: Number(result.lastPlayedAt) || 0,
              item: result.item || null,
              checkedAt: now,
              lastError: ''
          };
          if (debug) {
              await this.appendRuntimeLog(env, 'info', 'media.lastPlayed.lookup', '上次播放查询完成', {
                  serverId: server.id,
                  serverName: server.name,
                  userId,
                  lastPlayedAt: lastPlayed.lastPlayedAt,
                  item: lastPlayed.item || null,
                  debug: result.debug || []
              }, { force: true });
          }
          return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, lastPlayed } }, touched: true };
      } catch(e) {
          if (debug) {
              await this.appendRuntimeLog(env, 'warn', 'media.lastPlayed.lookup', '上次播放查询失败', {
                  serverId: server.id,
                  serverName: server.name,
                  userId,
                  error: e.message || '上次播放读取失败',
                  debug: e && e.debug ? e.debug : []
              }, { force: true });
          }
          return {
              server: { ...server, mediaStats: { ...media, accessToken: token, userId, lastPlayed: { ...previousLastPlayed, lastError: e.message || '上次观看读取失败' } } },
              touched: true
          };
      }
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
          return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, keepAlive: nextKeepAlive } }, alert, touched: true };
      } catch(e) {
          return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, keepAlive: nextKeepAlive } }, alert: null, touched: true };
      }
  },

  async mapWithConcurrency(items, limit, mapper) {
      const list = Array.isArray(items) ? items : [];
      const concurrency = Math.max(1, Math.min(Number(limit) || 1, list.length || 1));
      const results = new Array(list.length);
      let nextIndex = 0;
      const workers = Array.from({ length: concurrency }, async () => {
          while (nextIndex < list.length) {
              const currentIndex = nextIndex;
              nextIndex += 1;
              results[currentIndex] = await mapper(list[currentIndex], currentIndex);
          }
      });
      await Promise.all(workers);
      return results;
  },

  async probeServerRuntimeState(env, server, forceMedia = false) {
      const cleanServers = this.sanitizeConfig({ servers: [server] }).servers;
      let s = cleanServers[0] || { ...server };
      const previousStatus = s.status;
      s.totalChecks = (s.totalChecks || 0) + 1;
      s.history = this.normalizeHistory(s.history, s.lastCheck);
      const checkedAt = Date.now();

      const probeTargets = this.getProbeTargets(s);
      const needsMediaRefresh = Boolean(forceMedia) || !s.mediaStats || !Number(s.mediaStats.lastCheck);

      if (!probeTargets.length) {
          s.consecutiveFailures = Math.max(Number(s.consecutiveFailures) || 0, Number(this.OFFLINE_CONFIRMATION_THRESHOLD) || 2);
          s.firstFailureAt = Number(s.firstFailureAt) || checkedAt;
          s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
          s.addressProbeResults = [];
          if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
          s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
          s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
          await this.refreshMediaStatsIfNeeded(s, needsMediaRefresh);
          const lastPlayedResult = await this.refreshLastPlayedIfNeeded(env, s, Boolean(forceMedia) || this.shouldRefreshLastPlayed(s.mediaStats, checkedAt), checkedAt, Boolean(forceMedia));
          s = lastPlayedResult.server;
          s.mediaStatsTouched = Boolean(s.mediaStatsTouched || lastPlayedResult.touched);
          s.previousStatus = previousStatus; return s;
      }

      let isAlive = false;
      let finalLatency = 0;
      let addressProbeResults = [];

      try {
          const result = await this.probeEmbyServerWithFallbacks(s);
          isAlive = result.ok; finalLatency = result.latency; addressProbeResults = result.addressProbeResults || [];
      } catch(e) { isAlive = false; }
      if (!isAlive) {
          const loginState = await this.verifyWithLoginState(s);
          if (loginState && loginState.ok) {
              isAlive = true;
              finalLatency = Number(loginState.latency) || finalLatency;
          }
      }
      s.addressProbeResults = addressProbeResults;

      if (isAlive) {
          s.consecutiveFailures = 0; s.firstFailureAt = 0; s.successfulChecks = (s.successfulChecks || 0) + 1; s.status = 'online'; s.latency = finalLatency; s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
      } else {
          s.consecutiveFailures = (Number(s.consecutiveFailures) || 0) + 1;
          s.firstFailureAt = Number(s.firstFailureAt) || checkedAt;
          const failureWindowMs = checkedAt - s.firstFailureAt;
          const shouldConfirmOffline = previousStatus === 'offline' || (s.consecutiveFailures >= 1 && failureWindowMs >= (Number(this.OFFLINE_CONFIRMATION_WINDOW_MS) || 3 * 60 * 1000));
          if (shouldConfirmOffline) {
              s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
          } else {
              s.totalChecks = Math.max(0, (s.totalChecks || 0) - 1);
              s.status = previousStatus === 'online' ? 'online' : 'unknown';
              s.latency = Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0;
          }
      }

      if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
      s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
      s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
      await this.refreshMediaStatsIfNeeded(s, needsMediaRefresh);
      const lastPlayedResult = await this.refreshLastPlayedIfNeeded(env, s, Boolean(forceMedia) || this.shouldRefreshLastPlayed(s.mediaStats, checkedAt), checkedAt, Boolean(forceMedia));
      s = lastPlayedResult.server;
      s.mediaStatsTouched = Boolean(s.mediaStatsTouched || lastPlayedResult.touched);
      s.previousStatus = previousStatus; return s;
  },

  mergeProbedRuntimeFields(latest, probed) {
      if (!probed) return latest;
      return {
          ...latest,
          status: probed.status,
          totalChecks: probed.totalChecks,
          successfulChecks: probed.successfulChecks,
          uptime: probed.uptime,
          latency: probed.latency,
          lastCheck: probed.lastCheck,
          offlineSince: probed.offlineSince,
          offlineAlertSentAt: probed.offlineAlertSentAt,
          consecutiveFailures: probed.consecutiveFailures || 0,
          firstFailureAt: probed.firstFailureAt || 0,
          addressProbeResults: probed.addressProbeResults || [],
          history: probed.history,
          mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats
      };
  },

  hasSameProbeConfig(a, b) {
      return Boolean(a && b && a.url === b.url && JSON.stringify(a.fallbackUrls || []) === JSON.stringify(b.fallbackUrls || []));
  },

  async runSingleProbeLogic(env, config, serverId, options = {}) {
      const cleanConfig = this.sanitizeConfig(config);
      const targetId = String(serverId || '');
      const target = cleanConfig.servers.find((server) => String(server.id) === targetId);
      if (!target) return { ok: false, status: 404, error: 'Server not found' };

      const probeStartedAt = Date.now();
      const forceMedia = Boolean(options.forceMedia);
      await this.appendRuntimeLog(env, 'info', 'probe.single.start', '单体测速开始', { source: 'manual', forceMedia, serverId: target.id, serverName: target.name }, { config: cleanConfig });
      const probed = await this.probeServerRuntimeState(env, target, forceMedia);

      const latestConfig = await this.loadConfig(env);
      const baseConfig = this.sanitizeConfig(latestConfig);
      const latestTarget = baseConfig.servers.find((server) => String(server.id) === targetId);
      if (!latestTarget) return { ok: false, status: 404, error: 'Server not found' };

      const notifyQueue = [];
      let mergedServer = this.hasSameProbeConfig(probed, latestTarget) ? this.mergeProbedRuntimeFields(latestTarget, probed) : latestTarget;
      const oldStatus = this.hasSameProbeConfig(probed, latestTarget) ? probed.previousStatus : latestTarget.status;
      const telegramEnabled = this.isTelegramEnabled(env, baseConfig);
      if (telegramEnabled && mergedServer.status === 'offline' && this.shouldSendOfflineAlert(mergedServer)) {
          notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
      } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && latestTarget.offlineAlertSentAt) {
          notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: latestTarget.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
      }

      const keepAliveResult = await this.refreshKeepAliveIfNeeded(mergedServer);
      if (keepAliveResult && keepAliveResult.touched) mergedServer = keepAliveResult.server;
      if (keepAliveResult && keepAliveResult.alert && telegramEnabled) {
          notifyQueue.push({ ...keepAliveResult.alert, kind: 'keepAlive' });
      }

      const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(env, item.message, baseConfig)));
      for (const [index, ok] of sendResults.entries()) {
          const item = notifyQueue[index];
          if (!ok || !item) continue;
          if (item.kind === 'offline') {
              mergedServer.offlineAlertSentAt = item.lastCheck;
          } else if (item.kind === 'keepAlive' && mergedServer.mediaStats && mergedServer.mediaStats.keepAlive) {
              mergedServer.mediaStats = { ...mergedServer.mediaStats, keepAlive: { ...mergedServer.mediaStats.keepAlive, alertSentAt: item.checkedAt || Date.now() } };
          }
      }

      const configBeforeSave = this.sanitizeConfig(await this.loadConfig(env));
      const targetBeforeSave = configBeforeSave.servers.find((server) => String(server.id) === targetId);
      if (!targetBeforeSave) return { ok: false, status: 404, error: 'Server not found' };
      const serverToSave = this.hasSameProbeConfig(mergedServer, targetBeforeSave) ? {
          ...targetBeforeSave,
          status: mergedServer.status,
          totalChecks: mergedServer.totalChecks,
          successfulChecks: mergedServer.successfulChecks,
          uptime: mergedServer.uptime,
          latency: mergedServer.latency,
          lastCheck: mergedServer.lastCheck,
          offlineSince: mergedServer.offlineSince,
          offlineAlertSentAt: mergedServer.offlineAlertSentAt,
          consecutiveFailures: mergedServer.consecutiveFailures || 0,
          firstFailureAt: mergedServer.firstFailureAt || 0,
          addressProbeResults: mergedServer.addressProbeResults || [],
          history: mergedServer.history,
          mediaStats: mergedServer.mediaStats
      } : targetBeforeSave;
      const mergedConfig = {
          ...configBeforeSave,
          servers: configBeforeSave.servers.map((server) => String(server.id) === targetId ? serverToSave : server)
      };
      const savedConfig = await this.saveConfig(env, mergedConfig);
      const savedServer = savedConfig.servers.find((server) => String(server.id) === targetId) || mergedServer;
      await this.appendRuntimeLog(env, 'info', 'probe.single.done', '单体测速完成', {
          source: 'manual',
          forceMedia,
          elapsedMs: Date.now() - probeStartedAt,
          notifyCount: notifyQueue.length,
          notifySuccessCount: sendResults.filter(Boolean).length,
          target: { id: savedServer.id, name: savedServer.name, previousStatus: probed.previousStatus, status: savedServer.status, latency: savedServer.latency, failures: savedServer.consecutiveFailures || 0 }
      }, { config: savedConfig });
      return { ok: true, config: savedConfig, server: savedServer };
  },

  async runProbeLogic(env, config, options = {}) {
      if (!config || !config.servers || config.servers.length === 0) return config;
      const probeStartedAt = Date.now();
      const forceMedia = Boolean(options.forceMedia);
      const probeSource = options.source === 'manual' ? 'manual' : 'scheduled';
      const concurrencyLimit = Math.max(1, Number(this.PROBE_CONCURRENCY_LIMIT) || 4);
      const batchSize = 3;
      const totalServers = config.servers.length;
      const rawCursor = probeSource === 'scheduled'
          ? Number(config.nextScheduledCursor) || 0
          : Number(options.cursor) || 0;
      const cursor = totalServers > 0 ? (rawCursor >= totalServers ? 0 : Math.max(0, rawCursor)) : 0;
      const batchEnd = Math.min(totalServers, cursor + batchSize);
      const batchIds = new Set(config.servers.slice(cursor, batchEnd).map((s) => s.id));
      const probeTargets = config.servers.filter((s) => batchIds.has(s.id));
      await this.appendRuntimeLog(env, 'info', 'probe.start', (probeSource === 'manual' ? '手动刷新开始' : '定时探测开始'), { source: probeSource, forceMedia, cursor, batchEnd, totalServers, targetCount: probeTargets.length }, { config });

      const probedServers = await this.mapWithConcurrency(probeTargets, concurrencyLimit, async (s) => {
          return this.probeServerRuntimeState(env, s, forceMedia);
      });

      const suppressProbeFailures = false; // 分批探测模式下禁用单批次大面积掉线防误报拦截

      const probedById = new Map(probedServers.map((s) => [s.id, s]));
      const latestConfig = await this.loadConfig(env);
      const latestById = new Map(latestConfig.servers.map((s) => [s.id, s]));
      const notifyQueue = [];
      const sourceConfig = latestConfig;
      const baseConfig = this.sanitizeConfig({ icons: sourceConfig.icons !== undefined ? sourceConfig.icons : latestConfig.icons, telegram: sourceConfig.telegram !== undefined ? sourceConfig.telegram : latestConfig.telegram, logging: sourceConfig.logging !== undefined ? sourceConfig.logging : latestConfig.logging, servers: sourceConfig.servers, updatedAt: sourceConfig.updatedAt || latestConfig.updatedAt || 0 });
      const mergedConfig = {
          icons: baseConfig.icons, telegram: baseConfig.telegram, logging: baseConfig.logging, updatedAt: Math.max(baseConfig.updatedAt || 0, latestConfig.updatedAt || 0),
          servers: baseConfig.servers.map((latest) => {
              const probed = probedById.get(latest.id);
              const previouslySaved = latestById.get(latest.id) || latest;
              let mergedServer = latest;
              let oldStatus = previouslySaved.status;
              if (probed && probed.url === latest.url) {
                  mergedServer = this.mergeProbedRuntimeFields(latest, probed);
                  oldStatus = previouslySaved.url === latest.url && JSON.stringify(previouslySaved.fallbackUrls || []) === JSON.stringify(latest.fallbackUrls || []) ? previouslySaved.status : probed.previousStatus;
              }
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
              if (telegramEnabled && mergedServer.status === 'offline' && shouldSendOffline) {
                  notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
              } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && previouslySaved.offlineAlertSentAt) {
                  notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: previouslySaved.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
              }
              return mergedServer;
          })
      };
      const nextCursor = batchEnd < totalServers ? batchEnd : 0;
      mergedConfig.nextCursor = nextCursor;
      mergedConfig.hasMore = nextCursor !== 0;
      if (probeSource === 'scheduled') {
          mergedConfig.nextScheduledCursor = nextCursor;
      }
      const keepAliveTargets = mergedConfig.servers.filter((server) => batchIds.has(server.id));
      const keepAliveResults = await this.mapWithConcurrency(keepAliveTargets, concurrencyLimit, (server) => this.refreshKeepAliveIfNeeded(server));
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
      const statusCounts = mergedConfig.servers.reduce((counts, server) => {
          const status = ['online', 'offline', 'unknown'].includes(server.status) ? server.status : 'unknown';
          counts[status] = (counts[status] || 0) + 1;
          return counts;
      }, { online: 0, offline: 0, unknown: 0 });
      const probeDetails = probedServers.map((server) => ({
          id: server.id,
          name: server.name,
          previousStatus: server.previousStatus,
          status: server.status,
          latency: server.latency,
          failures: server.consecutiveFailures || 0,
          addresses: Array.isArray(server.addressProbeResults) ? server.addressProbeResults.map((item) => ({ url: item.url, ok: item.ok, latency: item.latency || 0, error: item.error || '' })) : []
      }));
      await this.appendRuntimeLog(env, suppressProbeFailures ? 'warn' : 'info', 'probe.done', (probeSource === 'manual' ? '手动刷新完成' : '定时探测完成'), {
          source: probeSource,
          forceMedia,
          cursor,
          hasMore: Boolean(mergedConfig.hasMore),
          nextScheduledCursor: Number(mergedConfig.nextScheduledCursor) || 0,
          elapsedMs: Date.now() - probeStartedAt,
          statusCounts,
          suppressedBroadFailure: Boolean(suppressProbeFailures),
          notifyCount: notifyQueue.length,
          notifySuccessCount: sendResults.filter(Boolean).length,
          targets: probeDetails
      }, { config: mergedConfig });
      return mergedConfig;
  }
,
