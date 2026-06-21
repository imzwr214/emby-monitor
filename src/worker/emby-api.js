/*
 * Emby/Jellyfin API 访问。
 *
 * 负责 Emby 客户端认证头、登录、Token 响应摘要和媒体库数量读取。
 * 这些 Header 和路径影响 Emby/Jellyfin 兼容性，修改后需要验证登录和 `/Items/Counts`。
 */
  getEmbyClientProfiles() {
      return [
          { id: 'forward', client: 'Forward', device: 'Forward', version: '1.0.0', userAgent: 'Forward/1.0.0' },
          { id: 'android', client: 'Emby for Android', device: 'Android', version: '3.3.80', userAgent: 'Dalvik/2.1.0 (Linux; U; Android 13)' }
      ];
  },

  getPreferredEmbyClientProfiles(server, profileId = '') {
      const profiles = this.getEmbyClientProfiles();
      const media = server.mediaStats || {};
      const preferredId = String(profileId || media.clientProfile || '').trim();
      if (!preferredId) return profiles;
      const preferred = profiles.find((profile) => profile.id === preferredId);
      return preferred ? [preferred, ...profiles.filter((profile) => profile.id !== preferred.id)] : profiles;
  },

  buildEmbyAuthHeader(server, token = '', profile = null) {
      const media = server.mediaStats || {};
      const clientProfile = profile || this.getPreferredEmbyClientProfiles(server)[0];
      const deviceId = String(media.deviceId || server.id || 'forward');
      const parts = [
          'MediaBrowser Client="' + clientProfile.client + '"',
          'Device="' + clientProfile.device + '"',
          'DeviceId="' + deviceId + '"',
          'Version="' + clientProfile.version + '"'
      ];
      if (token) parts.push('Token="' + token + '"');
      return parts.join(', ');
  },

  buildEmbyClientHeaders(server, token = '', profile = null) {
      const media = server.mediaStats || {};
      const clientProfile = profile || this.getPreferredEmbyClientProfiles(server)[0];
      const deviceId = media.deviceId || server.id || 'forward';
      const authHeader = this.buildEmbyAuthHeader(server, token, clientProfile);
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': authHeader, 'X-Emby-Authorization': authHeader, 'X-Emby-Client': clientProfile.client, 'X-Emby-Device-Name': clientProfile.device, 'X-Emby-Device-Id': String(deviceId), 'X-Emby-Client-Version': clientProfile.version, 'User-Agent': clientProfile.userAgent };
      if (token) headers['X-Emby-Token'] = token;
      return headers;
  },

  async readShortResponse(response) { try { return (await response.text()).slice(0, 160); } catch(e) { return ''; } },

  parseEmbyDate(value) {
      const text = String(value || '').trim();
      if (!text) return 0;
      const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(text) ? text : text + 'Z';
      const time = Date.parse(normalized);
      return Number.isFinite(time) && time > 0 ? time : 0;
  },

  getEmbyApiBases(server) {
      const target = this.normalizeServerUrl(server.url);
      if (!target) throw new Error('服务器地址无效');
      const base = target.toString().replace(/\/$/, '');
      const bases = [base];
      if (!base.toLowerCase().endsWith('/emby')) bases.push(base + '/emby');
      return [...new Set(bases)];
  },

  async fetchEmbyServerName(server, token, options = {}) {
      const maxBases = Math.max(1, Number(options.maxBases) || 2);
      const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 8000);
      const bases = this.getEmbyApiBases(server).slice(0, maxBases);
      const profile = this.getPreferredEmbyClientProfiles(server, options.clientProfile)[0];
      for (const base of bases) {
          try {
              const response = await this.fetchWithTimeout(base + '/System/Info?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
              if (!response.ok) continue;
              const name = this.extractEmbyServerName(await response.json());
              if (name) return name;
          } catch(e) {}
      }
      return '';
  },

  async loginEmbyForMedia(server, options = {}) {
      const media = server.mediaStats || {};
      if (!media.username) throw new Error('缺少媒体库用户名');
      const maxBases = Math.max(1, Number(options.maxBases) || 10);
      const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
      const maxAttempts = Math.max(1, Number(options.maxAttempts) || 2);
      const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 15000);
      const bases = this.getEmbyApiBases(server).slice(0, maxBases);
      let lastError = '媒体库登录失败';
      const logStartedAt = Date.now();
      const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, maxAttempts, timeoutMs };
      const logMedia = async (stage, meta = {}) => {
          console.log('[trace] media.login.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
      };
      await logMedia('start', { hasUsername: Boolean(media.username), hasPassword: Boolean(media.password), baseCount: bases.length });
      for (const base of bases) {
          await logMedia('base.start', { base });
          for (const profile of this.getPreferredEmbyClientProfiles(server).slice(0, maxProfiles)) {
              await logMedia('profile.start', { base, profile: profile.id });
              const attempts = [
                  { headers: this.buildEmbyClientHeaders(server, '', profile), body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' }) },
                  { headers: { ...this.buildEmbyClientHeaders(server, '', profile), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: new URLSearchParams({ Username: media.username, Pw: media.password || '', Password: media.password || '' }).toString() }
              ].slice(0, maxAttempts);
              for (const [attemptIndex, attempt] of attempts.entries()) {
                  await logMedia('attempt.start', { base, profile: profile.id, attemptIndex: attemptIndex + 1, contentType: attempt.headers['Content-Type'] || 'application/json' });
                  try {
                      const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', { method: 'POST', headers: attempt.headers, body: attempt.body, env: options.env }, timeoutMs);
                      if (!response.ok) {
                          const detail = await this.readShortResponse(response);
                          lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                          await logMedia('attempt.httpError', { base, profile: profile.id, attemptIndex: attemptIndex + 1, status: response.status, error: lastError, responsePreview: detail });
                          continue;
                      }
                      const data = await response.json();
                      if (data.AccessToken) {
                          await logMedia('done', { base, profile: profile.id, hasUserId: Boolean(data.User && data.User.Id) });
                          return { accessToken: data.AccessToken, userId: data.User && data.User.Id ? String(data.User.Id) : '', base, clientProfile: profile.id };
                      }
                      lastError = '未获取到媒体库 Token';
                      await logMedia('attempt.noToken', { base, profile: profile.id, attemptIndex: attemptIndex + 1 });
                  } catch(e) {
                      lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败');
                      await logMedia('attempt.error', { base, profile: profile.id, attemptIndex: attemptIndex + 1, error: lastError });
                  }
              }
          }
      }
      await logMedia('error', { error: lastError });
      throw new Error(lastError);
  },

  async fetchEmbyMediaCounts(server, token, options = {}) {
      const maxBases = Math.max(1, Number(options.maxBases) || 10);
      const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
      const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 15000);
      const bases = this.getEmbyApiBases(server).slice(0, maxBases);
      let lastError = '资源统计失败';
      const logStartedAt = Date.now();
      const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, timeoutMs, clientProfile: options.clientProfile || '' };
      const logMedia = async (stage, meta = {}) => {
          console.log('[trace] media.counts.api.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
      };
      await logMedia('start', { baseCount: bases.length, tokenPresent: Boolean(token) });
      for (const base of bases) {
          await logMedia('base.start', { base });
          for (const profile of this.getPreferredEmbyClientProfiles(server, options.clientProfile).slice(0, maxProfiles)) {
              await logMedia('profile.start', { base, profile: profile.id });
              try {
                  const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
                  if (!response.ok) {
                      const detail = await this.readShortResponse(response);
                      lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                      await logMedia('profile.httpError', { base, profile: profile.id, status: response.status, error: lastError, responsePreview: detail });
                      continue;
                  }
                  const data = await response.json();
                  await logMedia('done', { base, profile: profile.id, counts: { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0) } });
                  return { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0), time: Date.now(), clientProfile: profile.id };
              } catch(e) {
                  lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败');
                  await logMedia('profile.error', { base, profile: profile.id, error: lastError });
              }
          }
      }
      await logMedia('error', { error: lastError });
      throw new Error(lastError);
  },

  async fetchEmbyLastPlayed(server, token, userId, options = {}) {
      if (!userId) throw new Error('未获取到媒体库 UserId');
      const maxBases = Math.max(1, Number(options.maxBases) || 10);
      const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
      const maxEndpoints = Math.max(1, Number(options.maxEndpoints) || 3);
      const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 0);
      const bases = this.getEmbyApiBases(server).slice(0, maxBases);
      let lastError = '最后播放时间读取失败';
      const includeItem = Boolean(options.includeItem);
      const debugEnabled = Boolean(options.debug);
      const debug = [];
      let successfulProfileId = String(options.clientProfile || (server.mediaStats && server.mediaStats.clientProfile) || '').trim();

      const extractPlayedAt = (item) => {
          if (!item) return 0;
          const candidates = [
              item.UserData && item.UserData.LastPlayedDate,
              item.LastPlayedDate,
              item.DatePlayed
          ];
          return Math.max(...candidates.map((value) => this.parseEmbyDate(value)));
      };
      const collectLatestPlayedItem = (items, latestPlayedAt = 0, latestItem = null) => {
          let endpointLatestPlayedAt = 0;
          let endpointLatestItem = null;
          for (const item of items) {
              const playedAt = extractPlayedAt(item);
              if (playedAt > endpointLatestPlayedAt) {
                  endpointLatestPlayedAt = playedAt;
                  endpointLatestItem = this.normalizeLastPlayedItem(item, playedAt);
              }
              if (playedAt > latestPlayedAt) {
                  latestPlayedAt = playedAt;
                  latestItem = this.normalizeLastPlayedItem(item, playedAt);
              }
          }
          return { latestPlayedAt, latestItem, endpointLatestPlayedAt, endpointLatestItem };
      };
      const buildDebugSample = (item) => {
          if (!item || typeof item !== 'object') return null;
          return {
              id: item.Id || '',
              name: item.Name || '',
              type: item.Type || '',
              userDataLastPlayedDate: item.UserData && item.UserData.LastPlayedDate ? item.UserData.LastPlayedDate : '',
              userDataPlayed: item.UserData && item.UserData.Played !== undefined ? Boolean(item.UserData.Played) : null,
              lastPlayedDate: item.LastPlayedDate || '',
              datePlayed: item.DatePlayed || '',
              parsedPlayedAt: extractPlayedAt(item),
              keys: Object.keys(item).slice(0, 20)
          };
      };
      let latestPlayedAt = 0;
      let latestItem = null;
      let topCandidate = null;
      const buildQuery = (params) => Object.entries(params).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');
      const baseItemsQuery = {
          SortBy: 'DatePlayed',
          SortOrder: 'Descending',
          Recursive: 'true',
          GroupItems: 'false',
          EnableUserData: 'true',
          Fields: 'UserData,DatePlayed,LastPlayedDate',
          IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video',
          Limit: '50',
          api_key: token
      };
      const logStartedAt = Date.now();
      const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, maxEndpoints, timeoutMs, clientProfile: successfulProfileId };
      const logMedia = async (stage, meta = {}) => {
          console.log('[trace] media.lastPlayed.api.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
      };
      await logMedia('start', { baseCount: bases.length, includeItem, tokenPresent: Boolean(token), hasUserId: Boolean(userId) });
      for (const base of bases) {
          try {
              await logMedia('base.start', { base });
              const endpoints = [
                  { label: 'played-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery({ ...baseItemsQuery, Filters: 'IsPlayed', Limit: '10' }), timeout: 8000 },
                  { label: 'resume', path: '/Users/' + encodeURIComponent(userId) + '/Items/Resume?' + buildQuery({ Limit: '50', Recursive: 'true', EnableUserData: 'true', Fields: 'UserData,DatePlayed,LastPlayedDate', IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video', api_key: token }), timeout: 5000 },
                  { label: 'all-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery(baseItemsQuery), timeout: 12000 }
              ].slice(0, maxEndpoints);

              for (const endpoint of endpoints) {
                  await logMedia('endpoint.start', { base, endpoint: endpoint.label });
                  for (const profile of this.getPreferredEmbyClientProfiles(server, successfulProfileId).slice(0, maxProfiles)) {
                      await logMedia('profile.start', { base, endpoint: endpoint.label, profile: profile.id });
                      try {
                          const response = await this.fetchWithTimeout(base + endpoint.path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs || endpoint.timeout);
                          if (!response.ok) {
                              const detail = await this.readShortResponse(response);
                              lastError = response.status === 401 ? '媒体库 Token 失效' : '最后播放时间读取失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                              await logMedia('profile.httpError', { base, endpoint: endpoint.label, profile: profile.id, status: response.status, error: lastError, responsePreview: detail });
                              if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: response.status, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError, responsePreview: detail });
                              continue;
                          }

                          successfulProfileId = profile.id;
                          const responseText = await response.text();
                          const data = JSON.parse(responseText);
                          const items = data && Array.isArray(data.Items) ? data.Items : (Array.isArray(data) ? data : []);
                          if (items[0] && !topCandidate) topCandidate = { base, profile, item: items[0] };
                          const latest = collectLatestPlayedItem(items, latestPlayedAt, latestItem);
                          latestPlayedAt = latest.latestPlayedAt;
                          latestItem = latest.latestItem;
                          await logMedia('profile.done', { base, endpoint: endpoint.label, profile: profile.id, itemCount: items.length, latestPlayedAt: latest.endpointLatestPlayedAt, totalRecordCount: data && Number.isFinite(Number(data.TotalRecordCount)) ? Number(data.TotalRecordCount) : null });
                          if (debugEnabled) {
                              debug.push({
                                  base,
                                  endpoint: endpoint.label,
                                  profile: profile.id,
                                  status: response.status,
                                  ok: true,
                                  itemCount: items.length,
                                  totalRecordCount: data && Number.isFinite(Number(data.TotalRecordCount)) ? Number(data.TotalRecordCount) : null,
                                  latestParsedAt: latest.endpointLatestPlayedAt,
                                  latestItem: latest.endpointLatestItem,
                                  dataKeys: data && typeof data === 'object' ? Object.keys(data).slice(0, 20) : [],
                                  samples: items.slice(0, 3).map(buildDebugSample).filter(Boolean),
                                  responsePreview: responseText.slice(0, 500)
                              });
                          }
                          if (items[0] && items[0].Id && endpoint.label !== 'all-items') {
                              try {
                                  await logMedia('candidateDetail.start', { base, endpoint: endpoint.label, profile: profile.id });
                                  const detail = await this.fetchEmbyItemDetail(base, server, token, userId, items[0].Id, profile, options);
                                  const detailPlayedAt = extractPlayedAt(detail);
                                  if (detailPlayedAt > latestPlayedAt) {
                                      latestPlayedAt = detailPlayedAt;
                                      latestItem = this.normalizeLastPlayedItem(detail, detailPlayedAt);
                                      successfulProfileId = profile.id;
                                      await logMedia('candidateDetail.done', { base, endpoint: endpoint.label, detailPlayedAt });
                                  } else {
                                      await logMedia('candidateDetail.done', { base, endpoint: endpoint.label, detailPlayedAt });
                                  }
                              } catch(e) {
                                  await logMedia('candidateDetail.error', { base, endpoint: endpoint.label, error: e.message || String(e) });
                                  if (debugEnabled) debug.push({ endpoint: endpoint.label + '-candidate-detail', status: 0, ok: false, error: e.message || String(e) });
                              }
                          }
                          break;
                      } catch(e) {
                          lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
                          await logMedia('profile.error', { base, endpoint: endpoint.label, profile: profile.id, error: lastError });
                          if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: 0, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError });
                      }
                  }
              }

          } catch(e) {
              lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
              await logMedia('base.error', { base, error: lastError });
          }
      }
      if (topCandidate) {
          try {
              await logMedia('itemDetail.start', { base: topCandidate.base, profile: topCandidate.profile && topCandidate.profile.id ? topCandidate.profile.id : successfulProfileId });
              const detail = await this.fetchEmbyItemDetail(topCandidate.base, server, token, userId, topCandidate.item.Id, topCandidate.profile, options);
              const detailPlayedAt = extractPlayedAt(detail);
              if (detailPlayedAt >= latestPlayedAt) {
                  latestPlayedAt = detailPlayedAt;
                  latestItem = this.normalizeLastPlayedItem(detail, detailPlayedAt);
                  successfulProfileId = topCandidate.profile.id;
              }
              await logMedia('itemDetail.done', { base: topCandidate.base, detailPlayedAt, latestPlayedAt });
          } catch(e) {
              await logMedia('itemDetail.error', { error: e.message || String(e) });
              if (debugEnabled) debug.push({ endpoint: 'item-detail', status: 0, ok: false, error: e.message || String(e) });
          }
      }
      if (latestPlayedAt) {
          await logMedia('done', { lastPlayedAt: latestPlayedAt, hasItem: Boolean(latestItem), clientProfile: successfulProfileId });
          return includeItem ? { lastPlayedAt: latestPlayedAt, item: latestItem, clientProfile: successfulProfileId, debug } : latestPlayedAt;
      }
      const error = new Error(lastError);
      error.debug = debug;
      await logMedia('error', { error: lastError, debugCount: debug.length });
      throw error;
  },

  normalizeLastPlayedItem(item, playedAt = 0) {
      if (!item || typeof item !== 'object') return null;
      const userData = item.UserData || {};
      return {
          id: String(item.Id || ''),
          name: String(item.Name || ''),
          type: String(item.Type || ''),
          seriesName: String(item.SeriesName || ''),
          seasonName: String(item.SeasonName || ''),
          indexNumber: Number.isFinite(Number(item.IndexNumber)) ? Number(item.IndexNumber) : null,
          playedPercentage: Number.isFinite(Number(userData.PlayedPercentage)) ? Number(userData.PlayedPercentage) : null,
          playedAt: Number(playedAt) || 0
      };
  },

  async fetchEmbyItemDetail(base, server, token, userId, itemId, profile, options = {}) {
      if (!itemId) throw new Error('缺少 ItemId');
      const query = 'Fields=' + encodeURIComponent('DatePlayed,UserData,LastPlayedDate') + '&api_key=' + encodeURIComponent(token);
      const path = '/Users/' + encodeURIComponent(userId) + '/Items/' + encodeURIComponent(itemId) + '?' + query;
      const response = await this.fetchWithTimeout(base + path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, 8000);
      if (!response.ok) throw new Error('条目详情读取失败 HTTP ' + response.status);
      return response.json();
  },
