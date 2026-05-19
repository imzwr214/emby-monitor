/*
 * Emby/Jellyfin API 访问。
 *
 * 负责 Emby 客户端认证头、登录、Token 响应摘要和媒体库数量读取。
 * 这些 Header 和路径影响 Emby/Jellyfin 兼容性，修改后需要验证登录和 `/Items/Counts`。
 */
  buildEmbyAuthHeader(server) {
      const media = server.mediaStats || {};
      return 'MediaBrowser Client="Forward", Device="Forward", DeviceId="' + (media.deviceId || server.id || 'forward') + '", Version="1.0.0"';
  },

  buildEmbyClientHeaders(server, token = '') {
      const media = server.mediaStats || {};
      const deviceId = media.deviceId || server.id || 'forward';
      const authHeader = this.buildEmbyAuthHeader(server);
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': authHeader, 'X-Emby-Authorization': authHeader, 'X-Emby-Client': 'Forward', 'X-Emby-Device-Name': 'Forward', 'X-Emby-Device-Id': String(deviceId), 'X-Emby-Client-Version': '1.0.0', 'User-Agent': 'Forward/1.0.0' };
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
          try {
              const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', { method: 'POST', headers: this.buildEmbyClientHeaders(server), body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' }) }, 8000);
              if (!response.ok) {
                  const detail = await this.readShortResponse(response);
                  lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                  continue;
              }
              const data = await response.json();
              if (data.AccessToken) return { accessToken: data.AccessToken, userId: data.User && data.User.Id ? String(data.User.Id) : '' };
              lastError = '未获取到媒体库 Token';
          } catch(e) { lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败'); }
      }
      throw new Error(lastError);
  },

  async fetchEmbyMediaCounts(server, token) {
      const bases = this.getEmbyApiBases(server);
      let lastError = '资源统计失败';
      for (const base of bases) {
          try {
              const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token) }, 8000);
              if (!response.ok) {
                  const detail = await this.readShortResponse(response);
                  lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                  continue;
              }
              const data = await response.json();
              return { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0), time: Date.now() };
          } catch(e) { lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败'); }
      }
      throw new Error(lastError);
  },

  async fetchEmbyLastPlayed(server, token, userId, options = {}) {
      if (!userId) throw new Error('未获取到媒体库 UserId');
      const bases = this.getEmbyApiBases(server);
      let lastError = '最后播放时间读取失败';
      const deepScan = Boolean(options.deepScan);
      const extractItems = (data) => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (Array.isArray(data.Items)) return data.Items;
          return [];
      };
      const parseEmbyDate = (value) => {
          const text = String(value || '').trim();
          if (!text) return 0;
          const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(text) ? text : text + 'Z';
          const time = Date.parse(normalized);
          return Number.isFinite(time) && time > 0 ? time : 0;
      };
      const extractPlayedAt = (item) => {
          if (!item) return 0;
          const played = item.UserData && item.UserData.LastPlayedDate ? item.UserData.LastPlayedDate : (item.DatePlayed || '');
          return parseEmbyDate(played);
      };
      const quickQueryPlans = [
          {
              path: '/Items/Latest',
              variants: [
                  ['Limit=10', 'StartIndex=0', 'IsPlayed=true', 'GroupItems=false', 'EnableUserData=true', 'Fields=UserData,DatePlayed', 'IncludeItemTypes=Movie,Episode,Audio,MusicVideo,Video'],
                  ['Limit=10', 'StartIndex=0', 'Filters=IsPlayed', 'GroupItems=false', 'EnableUserData=true', 'Fields=UserData,DatePlayed', 'IncludeItemTypes=Movie,Episode,Audio,MusicVideo,Video']
              ]
          }
      ];
      const deepQueryPlans = [
          {
              path: '/Items',
              variants: [
                  ['SortBy=DatePlayed', 'SortOrder=Descending', 'IsPlayed=true'],
                  ['SortBy=DatePlayed', 'SortOrder=Descending', 'Filters=IsPlayed'],
                  ['SortBy=DatePlayed', 'SortOrder=Descending'],
                  ['SortBy=DateLastMediaAdded', 'SortOrder=Descending']
              ]
          }
      ];
      let latestPlayedAt = 0;
      for (const base of bases) {
          const plans = deepScan ? [...quickQueryPlans, ...deepQueryPlans] : quickQueryPlans;
          for (const plan of plans) {
              const pageLimit = plan.path === '/Items/Latest' ? 10 : 50;
              const maxScan = plan.path === '/Items/Latest' ? 30 : 300;
              for (const variant of plan.variants) {
                  for (let startIndex = 0; startIndex < maxScan; startIndex += pageLimit) {
                      try {
                          const query = [
                              'StartIndex=' + startIndex,
                              'Limit=' + pageLimit,
                              ...variant,
                              ...(plan.path === '/Items' ? ['Recursive=true'] : [])
                          ].join('&');
                          const response = await this.fetchWithTimeout(base + '/Users/' + encodeURIComponent(userId) + plan.path + '?' + query + '&api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token) }, 8000);
                          if (!response.ok) {
                              const detail = await this.readShortResponse(response);
                              lastError = response.status === 401 ? '媒体库 Token 失效' : '最后播放时间读取失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                              break;
                          }
                          const data = await response.json();
                          const items = extractItems(data);
                          const totalCount = Number(data && data.TotalRecordCount);
                          const hasTotalCount = Number.isFinite(totalCount) && totalCount > 0;
                          for (const item of items) {
                              const playedAt = extractPlayedAt(item);
                              if (playedAt > latestPlayedAt) latestPlayedAt = playedAt;
                              if (!playedAt && item && item.Id) {
                                  const detailResponse = await this.fetchWithTimeout(base + '/Users/' + encodeURIComponent(userId) + '/Items/' + encodeURIComponent(item.Id) + '?EnableUserData=true&Fields=UserData&api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token) }, 8000);
                                  if (detailResponse.ok) {
                                      const detail = await detailResponse.json();
                                      const detailPlayedAt = extractPlayedAt(detail);
                                      if (detailPlayedAt > latestPlayedAt) latestPlayedAt = detailPlayedAt;
                                  }
                              }
                          }
                          if (items.length < pageLimit) break;
                          if (hasTotalCount && startIndex + pageLimit >= totalCount) break;
                      } catch(e) {
                          lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
                          break;
                      }
                  }
              }
          }
      }
      if (latestPlayedAt) return latestPlayedAt;
      throw new Error(lastError);
  },
