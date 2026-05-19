/*
 * 公开页面和 SVG 渲染。
 *
 * 负责 HTML/XML/SVG 转义、公开页图标匹配、公开状态页 HTML 和服务器卡片 SVG。
 * 公开输出不能包含后台地址、管理 token 或 Emby 凭据。
 */
  escapeXml(value) {
      return this.escapeSvgText(value);
  },

  escapeSvgText(value) {
      let output = '';
      for (const char of String(value === undefined || value === null ? '' : value)) {
          const code = char.codePointAt(0);
          if (!code || code === 0x0b || code === 0x0c || code < 0x20 || (code >= 0xd800 && code <= 0xdfff) || code > 0x10ffff) continue;
          if (char === '&') output += '&amp;';
          else if (char === '<') output += '&lt;';
          else if (char === '>') output += '&gt;';
          else if (char === '"') output += '&quot;';
          else if (char === "'") output += '&#39;';
          else if (code > 0x7e) output += '&#' + code + ';';
          else output += char;
      }
      return output;
  },

  publicIconSrc(icon) {
      if (!icon || typeof icon !== 'string') return '';
      if (icon.startsWith('data:image/')) return icon;
      const parsed = this.parsePublicHttpUrl(icon);
      return parsed ? '/proxy-img?url=' + encodeURIComponent(parsed.toString()) : '';
  },

  normalizeTextForPublicMatch(value) {
      try { return String(value || '').normalize('NFKC').toLowerCase(); } catch(e) { return String(value || '').toLowerCase(); }
  },

  getPublicDisplayIcon(server, icons = {}) {
      if (server.customIcon) return server.customIcon;
      if (!server.name || !icons || typeof icons !== 'object' || Array.isArray(icons)) return '';
      const name = this.normalizeTextForPublicMatch(server.name);
      for (const [key, value] of Object.entries(icons)) {
          if (name.includes(this.normalizeTextForPublicMatch(key))) return value;
      }
      return '';
  },

  buildPublicPage(config, pageState = {}) {
      const clean = this.sanitizeConfig(config);
      const ownerProfile = pageState && pageState.ownerProfile ? pageState.ownerProfile : null;
      const hideCounts = Boolean(pageState && pageState.hideCounts);
      const maskCount = (value) => {
          const text = String(Math.max(0, Number(value) || 0));
          if (!hideCounts) return text;
          if (text.length <= 1) return text + '**';
          const keep = text.length >= 5 ? 2 : 1;
          return text.slice(0, keep) + '*'.repeat(Math.max(2, text.length - keep));
      };
      const cards = clean.servers.map((server) => {
          const media = server.mediaStats || {};
          const counts = media.counts || {};
          const icon = this.publicIconSrc(this.getPublicDisplayIcon(server, clean.icons));
          const statusClass = server.status === 'online' ? 'online' : server.status === 'offline' ? 'offline' : 'unknown';
          const statusText = server.status === 'online' ? '在线' : server.status === 'offline' ? '离线' : '检测中';
          const iconHtml = icon ? '<img src="' + this.escapeHtml(icon) + '" alt="" class="avatar-img">' : '<span>' + this.escapeHtml((server.name || '?').slice(0, 1)) + '</span>';
          return '<article class="public-card public-card-' + statusClass + '">' +
              '<div class="card-glow card-glow-' + statusClass + '"></div>' +
              '<div class="public-card-head">' +
                  '<div class="avatar">' + iconHtml + '</div>' +
              '<div class="server-title"><h2>' + this.escapeHtml(server.name) + '</h2><div class="status-pill status-' + statusClass + '"><i></i>' + statusText + '</div></div>' +
              '</div>' +
              '<div class="metric-grid">' +
                  '<div class="metric metric-movie"><span>电影</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.movie)) ? maskCount(counts.movie) : '--') + '</strong></div>' +
                  '<div class="metric metric-series"><span>剧集</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.series)) ? maskCount(counts.series) : '--') + '</strong></div>' +
                  '<div class="metric metric-episode"><span>总集数</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.episode)) ? maskCount(counts.episode) : '--') + '</strong></div>' +
              '</div>' +
          '</article>';
      }).join('');
      const ownerHtml = ownerProfile && ownerProfile.name ? (
          '<section class="owner-banner">' +
              '<div class="owner-avatar">' + (ownerProfile.avatarDataUrl ? '<img src="' + this.escapeHtml(ownerProfile.avatarDataUrl) + '" alt="">' : '<span>' + this.escapeHtml(String(ownerProfile.name).slice(0, 1)) + '</span>') + '</div>' +
              '<div class="owner-meta">' +
                  '<div class="owner-name">' + this.escapeHtml(ownerProfile.name) + '</div>' +
              '</div>' +
          '</section>'
      ) : '';
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#dce8fb"><title>Emby Status</title><style>' +
          'html{background:#dde8f8}body{background:#dde8f8;color:#334155;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;min-height:100vh}.bg-canvas{position:fixed;inset:0;z-index:0;background:linear-gradient(135deg,#e8eeff 0%,#dce8fb 30%,#ede4fb 60%,#e0effe 100%);overflow:hidden}.bg-canvas:after{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.04%27/%3E%3C/svg%3E");pointer-events:none;opacity:.6}.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}.orb-1{width:600px;height:600px;background:radial-gradient(circle,#a5c4fd,#c4b5fd);top:-15%;left:-10%}.orb-2{width:500px;height:500px;background:radial-gradient(circle,#fde68a,#fca5a5);top:40%;right:-8%}.orb-3{width:450px;height:450px;background:radial-gradient(circle,#6ee7f7,#a5f3cc);bottom:-10%;left:25%}.app-shell{position:relative;z-index:1;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:42px 0 56px}.brand-title{font-size:clamp(28px,5vw,52px);line-height:1;margin:0;background:linear-gradient(100deg,#0f172a 0%,#0369a1 48%,#059669 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.subtitle{margin:12px 0 30px;color:#64748b;font-weight:700}.public-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}.public-card{position:relative;overflow:hidden;border-radius:28px;padding:22px;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(248,250,255,.48));backdrop-filter:blur(20px) saturate(170%);border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 34px -26px rgba(15,23,42,.28),inset 0 1px 0 rgba(255,255,255,.88)}.public-card-online{border-color:rgba(16,185,129,.2)}.public-card-offline{border-color:rgba(244,63,94,.22)}.card-glow{position:absolute;right:-64px;top:-64px;width:180px;height:180px;border-radius:50%;filter:blur(50px);pointer-events:none}.card-glow-online{background:#10b98133}.card-glow-offline{background:#f43f5e38}.card-glow-unknown{background:#94a3b833}.public-card-head{display:flex;gap:14px;align-items:center;position:relative;z-index:1}.avatar{width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.8);border:1px solid #fff;box-shadow:0 1px 8px rgba(15,23,42,.08);display:flex;align-items:center;justify-content:center;overflow:hidden;color:#334155;font-size:24px;font-weight:900;flex-shrink:0}.avatar-img{width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box}.server-title{min-width:0;display:flex;flex-direction:column;gap:8px}.server-title h2{margin:0;color:#1e293b;font-size:18px;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status-pill{width:max-content;display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.58);font-size:12px;font-weight:900;border:1px solid}.status-pill i{display:block;width:8px;height:8px;border-radius:50%}.status-online{color:#047857;border-color:#a7f3d0}.status-online i{background:#10b981}.status-offline{color:#be123c;border-color:#fecdd3}.status-offline i{background:#f43f5e}.status-unknown{color:#475569;border-color:#cbd5e1}.status-unknown i{background:#94a3b8}.metric-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:20px}.metric{border-radius:16px;background:rgba(255,255,255,.46);border:1px solid rgba(255,255,255,.72);padding:13px 8px;text-align:center}.metric span{display:block;color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}.metric strong{display:block;margin-top:6px;color:#334155;font-size:20px;line-height:1;font-weight:900}.empty{padding:80px 20px;border-radius:28px;background:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.82);text-align:center;color:#64748b;font-weight:800}@media(max-width:640px){.app-shell{padding-top:30px}.public-grid{grid-template-columns:1fr}.brand-title{font-size:32px}}' +
          '.public-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.public-card{overflow:hidden}.owner-banner{display:flex;align-items:center;gap:12px;margin:0 0 14px;padding:14px 16px;border-radius:22px;background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 34px -28px rgba(15,23,42,.2),inset 0 1px 0 rgba(255,255,255,.88)}.owner-avatar{width:42px;height:42px;border-radius:14px;flex-shrink:0;overflow:hidden;background:rgba(248,250,252,.95);border:1px solid rgba(226,232,240,.9);display:flex;align-items:center;justify-content:center;color:#475569;font-size:18px;font-weight:900}.owner-avatar img{width:100%;height:100%;object-fit:cover}.owner-meta{min-width:0;display:flex;flex-direction:column;gap:2px}.owner-name{font-size:13px;font-weight:900;color:#1e293b;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metric-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.metric{min-width:0;overflow:visible;padding:12px 6px}.metric span{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;font-size:10px}.metric strong{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;letter-spacing:-0.02em}.metric-movie strong,.metric-series strong{font-size:20px}.metric-episode strong{font-size:15px;color:#64748b;font-weight:800}.public-footer{margin-top:28px;padding-top:14px;border-top:1px solid rgba(148,163,184,.22);text-align:center;color:#94a3b8;font-size:11px;font-weight:700;line-height:1.6}.public-footer a{color:inherit;text-decoration:none}.public-footer a:hover{color:#64748b}.public-footnote{margin-top:6px;font-size:10px;font-weight:700;color:#cbd5e1}@media(max-width:640px){.public-grid{grid-template-columns:1fr}}</style></head><body><div class="bg-canvas"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div></div><main class="app-shell"><h1 class="brand-title">Emby Status</h1><p class="subtitle">状态数据由各服务器公开接口提供</p>' +
          ownerHtml +
          (cards ? '<section class="public-grid">' + cards + '</section>' : '<div class="empty">暂无服务器</div>') +
          '<footer class="public-footer"><div>项目地址：<a href="https://github.com/pototazhang/emby-js" target="_blank" rel="noopener noreferrer">github.com/pototazhang/emby-js</a></div><div class="public-footnote">更新建议：公开页头像展示、大陆 IP 限制和公开链接设置已完善，建议尽快更新。</div></footer>' +
          '</main></body></html>';
  },

  buildServerCardSvg(server, config = {}) {
      const media = server.mediaStats || {};
      const counts = media.counts || {};
      const status = server.status === 'online' ? '在线' : server.status === 'offline' ? '离线' : '检测中';
      const statusColor = server.status === 'online' ? '#047857' : server.status === 'offline' ? '#be123c' : '#2563eb';
      const statusBg = server.status === 'online' ? '#d1fae5' : server.status === 'offline' ? '#ffe4e6' : '#dbeafe';
      const dotColor = server.status === 'online' ? '#10b981' : server.status === 'offline' ? '#f43f5e' : '#3b82f6';
      const movie = Number.isFinite(Number(counts.movie)) ? String(Number(counts.movie)) : '--';
      const series = Number.isFinite(Number(counts.series)) ? String(Number(counts.series)) : '--';
      const episode = Number.isFinite(Number(counts.episode)) ? String(Number(counts.episode)) : '--';
      const initial = String(server.name || '?').slice(0, 1);
      const name = this.escapeSvgText(server.name || 'Emby Server');
      const icon = this.publicIconSrc(this.getPublicDisplayIcon(server, config.icons || {}));
      const statusLabel = this.escapeSvgText(status);
      const statusTextWidth = Math.max(28, Math.round(Array.from(String(status)).reduce((total, char) => total + (char.codePointAt(0) > 0x7e ? 2 : 1), 0) * 7 + 14));
      const statusChipWidth = statusTextWidth + 28;
      const statusChipLeft = 214;
      const statusDotX = statusChipLeft + 15;
      const statusTextX = statusChipLeft + 28;
      const avatar = icon
          ? '<image x="139" y="129" width="48" height="48" href="' + this.escapeSvgText(icon) + '" preserveAspectRatio="xMidYMid meet"/>'
          : '<text x="163" y="165" text-anchor="middle" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="32" font-weight="900" fill="#334155">' + this.escapeSvgText(initial) + '</text>';
      return '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="760" height="420" viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet" role="img">' +
          '<style>svg{background:#dde8f8;display:block;position:fixed;inset:0;margin:auto;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px)} @media (max-width: 640px){svg{max-width:calc(100vw - 10px);max-height:calc(100vh - 10px)}}</style>' +
          '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8eeff"/><stop offset=".55" stop-color="#ede4fb"/><stop offset="1" stop-color="#e0effe"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity=".18"/></filter><clipPath id="outer"><rect x="28" y="24" width="704" height="372" rx="40"/></clipPath></defs>' +
          '<g clip-path="url(#outer)">' +
          '<rect x="28" y="24" width="704" height="372" rx="40" fill="url(#bg)"/>' +
          '<circle cx="664" cy="86" r="140" fill="' + (server.status === 'online' ? '#10b981' : server.status === 'offline' ? '#f43f5e' : '#3b82f6') + '" opacity=".18"/>' +
          '<circle cx="106" cy="324" r="126" fill="#60a5fa" opacity=".12"/>' +
          '<g filter="url(#shadow)"><rect x="78" y="78" width="604" height="244" rx="30" fill="#ffffff" fill-opacity=".82" stroke="#ffffff" stroke-opacity=".95"/>' +
          '<rect x="126" y="116" width="74" height="74" rx="23" fill="#ffffff" fill-opacity=".92" stroke="#ffffff"/>' +
          avatar +
          '<text x="214" y="145" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="27" font-weight="900" fill="#1e293b">' + name + '</text>' +
          '<rect x="' + statusChipLeft + '" y="167" width="' + statusChipWidth + '" height="26" rx="13" fill="' + statusBg + '" stroke="#ffffff" stroke-opacity=".85"/><circle cx="' + statusDotX + '" cy="180" r="3" fill="' + dotColor + '"/><text x="' + statusTextX + '" y="185" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" font-weight="900" fill="' + statusColor + '">' + statusLabel + '</text>' +
          '<g transform="translate(110 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('电影') + '</text><text x="82" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#334155" font-family="system-ui">' + this.escapeSvgText(movie) + '</text></g>' +
          '<g transform="translate(298 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('剧集') + '</text><text x="82" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#334155" font-family="system-ui">' + this.escapeSvgText(series) + '</text></g>' +
          '<g transform="translate(486 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('总集数') + '</text><text x="82" y="54" text-anchor="middle" font-size="19" font-weight="800" fill="#64748b" font-family="system-ui">' + this.escapeSvgText(episode) + '</text></g>' +
          '</g><text x="110" y="314" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" font-weight="700" fill="#64748b">' + this.escapeSvgText('Emby Status · 状态数据由各服务器公开接口提供') + '</text>' +
          '<a href="https://github.com/pototazhang/emby-js" target="_blank" rel="noopener noreferrer"><text x="650" y="314" text-anchor="end" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="9" font-weight="700" fill="#94a3b8">' + this.escapeSvgText('项目地址') + '</text></a>' +
          '</g></svg>';
  },
