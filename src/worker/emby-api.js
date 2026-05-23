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

  getEmbyApiBases(server) {
      const target = this.normalizeServerUrl(server.url);
      if (!target) throw new Error('服务器地址无效');
      const base = target.toString().replace(/\/$/, '');
      const bases = [base];
      if (!base.toLowerCase().endsWith('/emby')) bases.push(base + '/emby');
      return [...new Set(bases)];
  },

  async loginEmbyForMedia(server) {
      const media = server.mediaStats || {};
      if (!media.username) throw new Error('缺少媒体库用户名');
      const bases = this.getEmbyApiBases(server);
      let lastError = '媒体库登录失败';
      for (const base of bases) {
          for (const profile of this.getPreferredEmbyClientProfiles(server)) {
              const attempts = [
                  { headers: this.buildEmbyClientHeaders(server, '', profile), body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' }) },
                  { headers: { ...this.buildEmbyClientHeaders(server, '', profile), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: new URLSearchParams({ Username: media.username, Pw: media.password || '', Password: media.password || '' }).toString() }
              ];
              for (const attempt of attempts) {
                  try {
                      const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', { method: 'POST', headers: attempt.headers, body: attempt.body }, 15000);
                      if (!response.ok) {
                          const detail = await this.readShortResponse(response);
                          lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                          continue;
                      }
                      const data = await response.json();
                      if (data.AccessToken) return { accessToken: data.AccessToken, userId: data.User && data.User.Id ? String(data.User.Id) : '', base, clientProfile: profile.id };
                      lastError = '未获取到媒体库 Token';
                  } catch(e) {
                      lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败');
                  }
              }
          }
      }
      throw new Error(lastError);
  },

  async fetchEmbyMediaCounts(server, token, options = {}) {
      const bases = this.getEmbyApiBases(server);
      let lastError = '资源统计失败';
      for (const base of bases) {
          for (const profile of this.getPreferredEmbyClientProfiles(server, options.clientProfile)) {
              try {
                  const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile) }, 15000);
                  if (!response.ok) {
                      const detail = await this.readShortResponse(response);
                      lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                      continue;
                  }
                  const data = await response.json();
                  return { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0), time: Date.now(), clientProfile: profile.id };
              } catch(e) {
                  lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败');
              }
          }
      }
      throw new Error(lastError);
  },

  async fetchEmbyLastPlayed(server, token, userId, options = {}) {
      if (!userId) throw new Error('未获取到媒体库 UserId');
      const bases = this.getEmbyApiBases(server);
      let lastError = '最后播放时间读取失败';
      const includeItem = Boolean(options.includeItem);
      const debugEnabled = Boolean(options.debug);
      const debug = [];
      let successfulProfileId = String(options.clientProfile || (server.mediaStats && server.mediaStats.clientProfile) || '').trim();

      const parseEmbyDate = (value) => {
          const text = String(value || '').trim();
          if (!text) return 0;
          const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(text) ? text : text + 'Z';
          const time = Date.parse(normalized);
          return Number.isFinite(time) && time > 0 ? time : 0;
      };
      const extractPlayedAt = (item) => {
          if (!item) return 0;
          const candidates = [
              item.UserData && item.UserData.LastPlayedDate,
              item.LastPlayedDate,
              item.DatePlayed
          ];
          return Math.max(...candidates.map(parseEmbyDate));
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
      for (const base of bases) {
          try {
              const endpoints = [
                  { label: 'all-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery(baseItemsQuery), timeout: 8000 },
                  { label: 'resume', path: '/Users/' + encodeURIComponent(userId) + '/Items/Resume?' + buildQuery({ Limit: '50', Recursive: 'true', EnableUserData: 'true', Fields: 'UserData,DatePlayed,LastPlayedDate', IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video', api_key: token }), timeout: 5000 },
                  { label: 'played-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery({ ...baseItemsQuery, Filters: 'IsPlayed' }), timeout: 10000 }
              ];

              for (const endpoint of endpoints) {
                  for (const profile of this.getPreferredEmbyClientProfiles(server, successfulProfileId)) {
                      try {
                          const response = await this.fetchWithTimeout(base + endpoint.path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile) }, endpoint.timeout);
                          if (!response.ok) {
                              const detail = await this.readShortResponse(response);
                              lastError = response.status === 401 ? '媒体库 Token 失效' : '最后播放时间读取失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                              if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: response.status, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError, responsePreview: detail });
                              continue;
                          }

                          successfulProfileId = profile.id;
                          const responseText = await response.text();
                          const data = JSON.parse(responseText);
                          const items = data && Array.isArray(data.Items) ? data.Items : (Array.isArray(data) ? data : []);
                          if (endpoint.label === 'all-items' && items[0] && !topCandidate) topCandidate = { base, profile, item: items[0] };
                          const latest = collectLatestPlayedItem(items, latestPlayedAt, latestItem);
                          latestPlayedAt = latest.latestPlayedAt;
                          latestItem = latest.latestItem;
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
                          break;
                      } catch(e) {
                          lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
                          if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: 0, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError });
                      }
                  }
              }

          } catch(e) {
              lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
          }
      }
      if (topCandidate) {
          try {
              const detail = await this.fetchEmbyItemDetail(topCandidate.base, server, token, userId, topCandidate.item.Id, topCandidate.profile);
              const detailPlayedAt = extractPlayedAt(detail);
              if (detailPlayedAt >= latestPlayedAt) {
                  latestPlayedAt = detailPlayedAt;
                  latestItem = this.normalizeLastPlayedItem(detail, detailPlayedAt);
                  successfulProfileId = topCandidate.profile.id;
              }
          } catch(e) {
              if (debugEnabled) debug.push({ endpoint: 'item-detail', status: 0, ok: false, error: e.message || String(e) });
          }
      }
      if (latestPlayedAt) return includeItem ? { lastPlayedAt: latestPlayedAt, item: latestItem, clientProfile: successfulProfileId, debug } : latestPlayedAt;
      const error = new Error(lastError);
      error.debug = debug;
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

  async fetchEmbyItemDetail(base, server, token, userId, itemId, profile) {
      if (!itemId) throw new Error('缺少 ItemId');
      const query = 'Fields=' + encodeURIComponent('DatePlayed,UserData,LastPlayedDate') + '&api_key=' + encodeURIComponent(token);
      const path = '/Users/' + encodeURIComponent(userId) + '/Items/' + encodeURIComponent(itemId) + '?' + query;
      const response = await this.fetchWithTimeout(base + path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile) }, 8000);
      if (!response.ok) throw new Error('条目详情读取失败 HTTP ' + response.status);
      return response.json();
  },
