/*
 * Telegram 配置、资料和通知文案。
 *
 * 负责 Telegram 配置合并、消息发送、头像资料读取、通知时间格式化和离线/恢复通知文案。
 * 页面配置优先于环境变量；通知状态字段需要兼容旧配置。
 */
  isTelegramEnabled(env, config = {}) {
      const configured = this.currentTelegramConfig(env, config);
      return configured.enabled && Boolean(configured.botToken) && Boolean(configured.chatId);
  },

  getTelegramConfig(env, config) {
      const current = this.currentTelegramConfig(env, config);
      return { enabled: current.enabled, botToken: current.botToken, chatId: current.chatId };
  },
  currentTelegramConfig(env, config) {
      const stored = config && config.telegram ? config.telegram : {};
      return {
          enabled: stored.enabled !== undefined ? Boolean(stored.enabled) : ['1', 'true', 'yes', 'on'].includes(String(env.TG_NOTIFY || '').toLowerCase()),
          botToken: stored.botToken || env.TG_BOT_TOKEN || '',
          chatId: stored.chatId || env.TG_CHAT_ID || ''
      };
  },

  async sendTelegram(env, text, config = {}) {
      const tg = this.currentTelegramConfig(env, config);
      if (!tg.enabled || !tg.botToken || !tg.chatId) {
          console.log('[notify] telegram disabled or incomplete config', { enabled: tg.enabled, hasBotToken: Boolean(tg.botToken), hasChatId: Boolean(tg.chatId) });
          return false;
      }
      const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: tg.chatId, text, disable_web_page_preview: true })
          });
          if (!response.ok) {
              const detail = await response.text().catch(() => '');
              console.log('[notify] telegram send failed', { status: response.status, detail: detail.slice(0, 300) });
          }
          return response.ok;
      } catch(e) {
          console.log('[notify] telegram send error', e && e.message ? e.message : String(e));
      }
      return false;
  },

  async testTelegram(env, config = {}) {
      const tg = this.currentTelegramConfig(env, config);
      if (!tg.enabled || !tg.botToken || !tg.chatId) {
          return { ok: false, error: 'Telegram 配置未启用或不完整' };
      }
      const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
      const text = [
          'Emby 探针测试通知',
          '',
          '这是一条手动发送的 Telegram 测试消息。',
          '发送时间：' + this.formatNotifyTime(Date.now())
      ].join('\n');
      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: tg.chatId, text, disable_web_page_preview: true })
          });
          const detail = await response.text().catch(() => '');
          if (!response.ok) {
              console.log('[notify] telegram test failed', { status: response.status, detail: detail.slice(0, 300) });
              return { ok: false, status: response.status, error: detail.slice(0, 300) || 'Telegram API 返回失败' };
          }
          return { ok: true, status: response.status };
      } catch(e) {
          const message = e && e.message ? e.message : String(e);
          console.log('[notify] telegram test error', message);
          return { ok: false, error: message || 'Telegram 测试发送失败' };
      }
  },

  bytesToBase64(bytes) {
      if (!bytes || typeof bytes.length !== 'number') return '';
      if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.prototype.slice.call(bytes, i, i + chunkSize));
      }
      if (typeof btoa === 'function') return btoa(binary);
      return '';
  },

  formatTelegramDisplayName(chat, fallbackId = '') {
      if (!chat || typeof chat !== 'object') return String(fallbackId || 'Telegram');
      const title = String(chat.title || '').trim();
      if (title) return title;
      const firstName = String(chat.first_name || '').trim();
      const lastName = String(chat.last_name || '').trim();
      const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
      if (combined) return combined;
      const username = String(chat.username || '').trim();
      if (username) return username.replace(/^@+/, '');
      return String(fallbackId || 'Telegram');
  },

  async readTelegramChatProfile(env, config = {}) {
      const tg = this.currentTelegramConfig(env, config);
      if (!tg.enabled || !tg.botToken || !tg.chatId) return null;
      const cacheKey = 'telegram_public_profile:' + String(tg.chatId);
      if (env.EMBY_DB) {
          const cached = await env.EMBY_DB.get(cacheKey);
          if (cached) {
              try {
                  const data = JSON.parse(cached);
                  if (data && typeof data === 'object' && data.name) return data;
              } catch(e) {}
          }
      }
      try {
          const apiBase = 'https://api.telegram.org/bot' + tg.botToken;
          const chatRes = await fetch(apiBase + '/getChat?chat_id=' + encodeURIComponent(tg.chatId));
          const chatJson = await chatRes.json().catch(() => ({}));
          if (!chatRes.ok || !chatJson.ok || !chatJson.result) return null;
          const chat = chatJson.result;
          const profile = {
              chatId: String(tg.chatId),
              name: this.formatTelegramDisplayName(chat, tg.chatId),
              username: chat.username ? String(chat.username).replace(/^@+/, '') : '',
              avatarDataUrl: ''
          };
          const photo = chat.photo && (chat.photo.small_file_id || chat.photo.big_file_id) ? chat.photo : null;
          if (photo) {
              const fileId = photo.small_file_id || photo.big_file_id;
              const fileRes = await fetch(apiBase + '/getFile?file_id=' + encodeURIComponent(fileId));
              const fileJson = await fileRes.json().catch(() => ({}));
              if (fileRes.ok && fileJson.ok && fileJson.result && fileJson.result.file_path) {
                  const avatarRes = await fetch('https://api.telegram.org/file/bot' + tg.botToken + '/' + fileJson.result.file_path);
                  if (avatarRes.ok) {
                      const contentType = avatarRes.headers.get('Content-Type') || 'image/jpeg';
                      const avatarBytes = new Uint8Array(await avatarRes.arrayBuffer());
                      const base64 = this.bytesToBase64(avatarBytes);
                      if (base64) profile.avatarDataUrl = 'data:' + contentType + ';base64,' + base64;
                  }
              }
          }
          if (env.EMBY_DB) {
              await env.EMBY_DB.put(cacheKey, JSON.stringify(profile), { expirationTtl: 24 * 60 * 60 });
          }
          return profile;
      } catch(e) {
          console.log('[public-share] telegram profile lookup failed', e && e.message ? e.message : String(e));
      }
      return null;
  },

  formatNotifyTime(time) {
      if (!time) return '未知';
      return new Date(time).toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
  },

  formatNotifyDuration(startTime, endTime = Date.now()) {
      if (!startTime) return '未知';
      const minutes = Math.max(1, Math.floor((endTime - startTime) / 60000));
      if (minutes < 60) return minutes + ' 分钟';
      const hours = Math.floor(minutes / 60);
      const rest = minutes % 60;
      return hours + ' 小时' + (rest ? ' ' + rest + ' 分钟' : '');
  },

  formatNotifyLatency(latency) {
      const value = Number(latency);
      return Number.isFinite(value) && value > 0 ? Math.round(value) + 'ms' : '未知';
  },

  formatNotifyUptime(uptime) {
      return uptime === '---' ? '样本不足' : uptime + '%';
  },
  maskNotifyUrl(value) {
      try {
          const url = new URL(value);
          const labels = url.hostname.split('.').filter(Boolean);
          const visible = labels[0] || url.hostname.slice(0, 6);
          return url.protocol + '//' + visible + '.****.****';
      } catch(e) {
          const text = String(value || '');
          if (!text) return '未知';
          return text.slice(0, Math.min(12, text.length)) + '****';
      }
  },

  getRecentHistoryStats(server, windowMs = 24 * 60 * 60 * 1000) {
      const since = Date.now() - windowMs;
      const history = Array.isArray(server.history) ? server.history.filter((item) => item && typeof item === 'object' && item.time && item.time >= since) : [];
      const stats = history.reduce((acc, item) => {
          const isOnline = item.status === 'online';
          const latency = Number(item.latency);
          if (isOnline) {
              acc.online += 1;
              if (Number.isFinite(latency) && latency > 0) { acc.latencyTotal += latency; acc.latencyCount += 1; }
          } else { acc.offline += 1; }
          return acc;
      }, { online: 0, offline: 0, latencyTotal: 0, latencyCount: 0 });
      stats.offlineEvents = history.reduce((count, item, index) => {
          if (item.status !== 'offline') return count;
          const previous = history[index - 1];
          return !previous || previous.status !== 'offline' ? count + 1 : count;
      }, 0);
      stats.total = stats.online + stats.offline;
      stats.uptime = stats.total ? ((stats.online / stats.total) * 100).toFixed(1) : '---';
      stats.avgLatency = stats.latencyCount ? Math.round(stats.latencyTotal / stats.latencyCount) : 0;
      return stats;
  },

  formatAddressProbeResults(results) {
      const items = Array.isArray(results) ? results : [];
      if (!items.length) return ['地址1 未知 ❌'];
      return items.map((item, index) => {
          const latency = item.ok && item.latency ? ' ' + Math.round(item.latency) + 'ms' : '';
          return '地址' + (index + 1) + '：' + this.maskNotifyUrl(item.url) + ' ' + (item.ok ? '✅' : '❌') + latency;
      });
  },

  hasNotifyFallbackUrls(server) {
      return Array.isArray(server && server.fallbackUrls) && server.fallbackUrls.some((url) => String(url || '').trim());
  },

  buildStatusMessage(server, previousStatus, nextStatus) {
      const historyStats = this.getRecentHistoryStats(server);
      const offlineDuration = this.formatNotifyDuration(server.offlineSince, server.lastCheck || Date.now());
      const checkedAt = this.formatNotifyTime(server.lastCheck);
      const maskedUrl = this.maskNotifyUrl(server.url);
      const addressProbeLines = this.hasNotifyFallbackUrls(server) ? this.formatAddressProbeResults(server.addressProbeResults) : [];

      if (nextStatus === 'online') {
          return ['🟢 Emby 服务器已恢复', '', '服务器：' + server.name, '地址：' + maskedUrl, '状态：离线 -> 在线', '离线时长：' + offlineDuration, '恢复时间：' + checkedAt].join('\n');
      }
      return [
          '🔴 ' + server.name + ' 离线', '', '服务器：' + server.name, '地址：' + maskedUrl, ...addressProbeLines, '状态：离线', '离线时长：已持续 ' + offlineDuration, '离线时间：' + this.formatNotifyTime(server.offlineSince), '',
          '近24小时：离线 ' + historyStats.offlineEvents + ' 次', '近期可用率：' + this.formatNotifyUptime(historyStats.uptime)
      ].join('\n');
  },
  updateOfflineNotifyState(server, previousStatus, checkedAt) {
      if (server.status === 'offline') {
          const previousOfflineSince = Number.isFinite(Number(server.offlineSince)) ? Number(server.offlineSince) : 0;
          const previousAlertSentAt = Number.isFinite(Number(server.offlineAlertSentAt)) ? Number(server.offlineAlertSentAt) : 0;
          const shouldPreserveOfflineState = previousStatus === 'offline' || (previousStatus !== 'online' && previousOfflineSince > 0);
          const firstFailureAt = Number.isFinite(Number(server.firstFailureAt)) ? Math.max(0, Number(server.firstFailureAt)) : 0;
          server.offlineSince = shouldPreserveOfflineState && previousOfflineSince > 0 ? previousOfflineSince : (firstFailureAt || checkedAt);
          server.offlineAlertSentAt = shouldPreserveOfflineState ? Math.max(0, previousAlertSentAt) : 0;
          return server;
      }
      if (server.status === 'online') { server.offlineSince = 0; server.offlineAlertSentAt = 0; }
      return server;
  },

  shouldSendOfflineAlert(server) {
      if (server.status !== 'offline') return false;
      if (!server.offlineSince || server.offlineAlertSentAt) return false;
      return server.lastCheck - server.offlineSince >= this.OFFLINE_NOTIFY_DELAY_MS;
  },
