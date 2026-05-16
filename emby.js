/**
 * Emby 集群探针
 */

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Emby 集群探针大盘</title>
    <script>
        function showBootError(message) {
            var el = document.getElementById('boot-error');
            var root = document.getElementById('root');
            if (root) {
                root.innerHTML = '';
            }
            if (el) {
                el.style.display = 'block';
                el.style.position = 'fixed';
                el.style.left = '50%';
                el.style.top = '40px';
                el.style.transform = 'translateX(-50%)';
                el.style.zIndex = '99999';
                el.style.width = 'calc(100% - 32px)';
                el.textContent = message;
            }
        }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" onerror="showBootError('React CDN 加载失败')"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" onerror="showBootError('ReactDOM CDN 加载失败')"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js" onerror="showBootError('Babel CDN 加载失败')"></script>
    <script src="https://cdn.tailwindcss.com" onerror="showBootError('Tailwind CDN 加载失败')"></script>
    <style>
        body { background: #0b0f1a; color: #e2e8f0; font-family: system-ui; margin: 0; }
        .glass-card { background: rgba(30, 41, 59, 0.45); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); }
        .glass-modal { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(28px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); }
        .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; transition: all 0.3s; }
        .online { background: #10b981; box-shadow: 0 0 12px #10b981; }
        .offline { background: #ef4444; box-shadow: 0 0 12px #ef4444; }
        .unknown { background: #64748b; }
        .updating { background: #3b82f6; box-shadow: 0 0 12px #3b82f6; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    </style>
</head>
<body>
    <div id="root"><div style="min-height:100vh;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:700;">页面加载中...</div></div>
    <div id="boot-error" style="display:none;max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;"></div>
    <script>
        window.addEventListener('error', (event) => {
            if (event.message === 'Script error.') return;
            showBootError('页面脚本错误：' + (event.message || 'Unknown error') + (event.filename ? '\\n' + event.filename + ':' + event.lineno : ''));
        });
        window.addEventListener('unhandledrejection', (event) => {
            showBootError('页面异步错误：' + ((event.reason && (event.reason.message || event.reason.toString())) || 'Unknown rejection'));
        });
        setTimeout(function() {
            var root = document.getElementById('root');
            var bootError = document.getElementById('boot-error');
            if (root && root.textContent.indexOf('页面加载中') !== -1 && bootError && bootError.style.display === 'none') {
                showBootError('前端没有启动：' + (window.Babel ? 'Babel 已加载但 JSX 脚本未执行。' : 'Babel CDN 未加载。') + '请清理缓存后重新加载，或检查浏览器控制台。');
            }
        }, 3000);
    </script>
    <script type="text/babel" data-presets="react">
        const { useState, useEffect } = React;
        const APP_VERSION = '2026.05.16.1';

        const StatusBars = ({ history = [] }) => {
            const maxBars = 60;
            const [hoveredIndex, setHoveredIndex] = useState(null);
            const padded = [...Array(Math.max(0, maxBars - history.length)).fill(null), ...history].slice(-maxBars);
            const formatHistoryTime = (time) => {
                if (!time) return '暂无记录';
                return new Date(time).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            };
            const getHistoryStatus = (item) => {
                if (item === null) return null;
                if (typeof item === 'number') return item;
                return item && item.status === 'online' ? 1 : 0;
            };
            const getHistoryTitle = (item) => {
                if (item === null) return '暂无记录';
                const status = getHistoryStatus(item) === 1 ? '在线' : '离线';
                const time = typeof item === 'object' ? formatHistoryTime(item.time) : '旧记录未保存时间';
                const latency = item && item.latency ? '，延迟 ' + item.latency + 'ms' : '';
                return status + ' - ' + time + latency;
            };
            const getDockStyle = (status, index) => {
                const baseHeight = status === null ? 10 : 24;
                const baseWidth = window.innerWidth < 640 ? 4 : 6;
                if (hoveredIndex === null || status === null) {
                    return { height: baseHeight + 'px', width: baseWidth + 'px' };
                }
                const distance = Math.abs(hoveredIndex - index);
                const heightBoost = distance === 0 ? 18 : distance === 1 ? 11 : distance === 2 ? 5 : 0;
                const widthBoost = distance === 0 ? 8 : distance === 1 ? 5 : distance === 2 ? 2 : 0;
                return {
                    height: (baseHeight + heightBoost) + 'px',
                    width: (baseWidth + widthBoost) + 'px',
                    zIndex: 20 - distance
                };
            };
            const getHitboxStyle = (status, index) => {
                const style = getDockStyle(status, index);
                return {
                    width: Math.max(10, parseFloat(style.width) + 4) + 'px',
                    height: '48px'
                };
            };
            return (
                <div className="flex flex-col gap-2 w-full md:w-auto items-end">
                    <div className="flex gap-[2px] items-end h-14 pt-5 overflow-visible">
                        {padded.map((item, i) => {
                            const status = getHistoryStatus(item);
                            let color = 'bg-slate-700/40';
                            if (status === 1) color = 'bg-emerald-400';
                            if (status === 0) color = 'bg-red-500';
                            return (
                                <div
                                    key={i}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="relative flex items-end justify-center overflow-visible transition-all duration-150 ease-out"
                                    style={getHitboxStyle(status, i)}
                                >
                                    <div className={"absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-[10px] text-slate-200 font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all duration-150 " + (hoveredIndex === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")} style={{ zIndex: 50 }}>
                                        {getHistoryTitle(item)}
                                    </div>
                                    <div
                                        className={"origin-bottom rounded-full transition-all duration-150 ease-out hover:opacity-100 opacity-80 " + color}
                                        style={getDockStyle(status, i)}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between w-full text-[9px] text-slate-500 font-bold px-0.5">
                        <span>历史记录</span><span>现在</span>
                    </div>
                </div>
            );
        };

        const App = () => {
            const [servers, setServers] = useState([]);
            const [iconLib, setIconLib] = useState({});
            const [isRefreshing, setIsRefreshing] = useState(false);
            const [showSettings, setShowSettings] = useState(false);
            const [isAddModalOpen, setIsAddModalOpen] = useState(false);
            const [editingServerId, setEditingServerId] = useState(null);
            const [iconModalTarget, setIconModalTarget] = useState(null);
            const [iconInput, setIconInput] = useState('');
            const [iconSearch, setIconSearch] = useState('');
            const [hideServerMeta, setHideServerMeta] = useState(() => localStorage.getItem('hide_server_meta') === '1');
            const [availabilityRange, setAvailabilityRange] = useState(() => localStorage.getItem('availability_range') === 'week' ? 'week' : 'day');
            const [addForm, setAddForm] = useState({ name: '', protocol: 'https://', host: '', port: '443' });
            const [mediaForm, setMediaForm] = useState({ enabled: false, username: '', password: '' });
            const [quickImportText, setQuickImportText] = useState('');
            const [telegramForm, setTelegramForm] = useState({ enabled: false, botToken: '', chatId: '' });
            const [isLoading, setIsLoading] = useState(true);
            const [activeTab, setActiveTab] = useState('cards');
            const [notifyEnabled, setNotifyEnabled] = useState(false);
            const [configUpdatedAt, setConfigUpdatedAt] = useState(0);
            const [configRevision, setConfigRevision] = useState('');
            const [updateInfo, setUpdateInfo] = useState(null);
            const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
            const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);

            // 核心修复 1：云端配置为准，禁止旧浏览器本地备份回写覆盖新配置
            const apiFetch = async (path, options = {}) => {
                const headers = { ...(options.headers || {}) };
                const adminToken = localStorage.getItem('emby_admin_token') || '';
                if (adminToken) headers.Authorization = 'Bearer ' + adminToken;
                return fetch(path, { ...options, headers });
            };

            const fetchConfigData = async () => {
                try {
                    const res = await apiFetch('/api/config');
                    if (res.status === 401) {
                        const token = prompt('请输入管理 Token');
                        if (token) {
                            localStorage.setItem('emby_admin_token', token);
                            return fetchConfigData();
                        }
                        return;
                    }
                    const data = await res.json();
                    const fetchedServers = Array.isArray(data.servers) ? data.servers : [];

                    setServers(fetchedServers);
                    setConfigUpdatedAt(Number(data.updatedAt) || 0);
                    setConfigRevision(data.revision || '');
                    setNotifyEnabled(Boolean(data.notifyEnabled));
                    setTelegramForm(data.telegram || { enabled: false, botToken: '', chatId: '' });
                    if (data.icons) { 
                        setIconLib(data.icons); 
                        setIconInput(localStorage.getItem('last_icon_input') || ""); 
                    }
                    checkForUpdate(false);
                } catch(e) { console.error("读取配置失败", e); }
            };

            useEffect(() => { fetchConfigData().finally(() => setIsLoading(false)); }, []);
            useEffect(() => {
                if (iconModalTarget) setIconSearch('');
            }, [iconModalTarget]);
            useEffect(() => {
                localStorage.setItem('hide_server_meta', hideServerMeta ? '1' : '0');
            }, [hideServerMeta]);
            useEffect(() => {
                localStorage.setItem('availability_range', availabilityRange);
            }, [availabilityRange]);

            // 保存时带版本时间戳，后端会拒绝旧页面/旧请求覆盖新配置
            const syncToCloud = async (newServers, newIcons, nextTelegram = telegramForm) => {
                const serverById = new Map(servers.map(s => [s.id, s]));
                const mergedServers = newServers.map((server) => {
                    const existing = serverById.get(server.id);
                    if (existing && existing.mediaStats && !server.mediaStats) {
                        return { ...server, mediaStats: existing.mediaStats };
                    }
                    return server;
                });
                setServers(mergedServers);
                setIconLib(newIcons || {});
                setTelegramForm(nextTelegram);
                const nextUpdatedAt = Date.now();
                setConfigUpdatedAt(nextUpdatedAt);
                const res = await apiFetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ servers: mergedServers, icons: newIcons, telegram: nextTelegram, updatedAt: nextUpdatedAt, baseRevision: configRevision }) });
                const saveResult = await res.json().catch(() => ({}));
                if (!res.ok) {
                    if (res.status === 409) {
                        await fetchConfigData();
                        throw new Error('配置已被其它页面或 KV 修改，请刷新后再保存');
                    }
                    throw new Error('配置保存失败');
                }
                setConfigRevision(saveResult.revision || '');
                return nextUpdatedAt;
            };

            const manualPing = async (currentServers = servers, requestUpdatedAt = configUpdatedAt) => {
                if (isRefreshing || !currentServers.length) return;
                setIsRefreshing(true);
                try {
                    const res = await apiFetch('/api/ping-all', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (!res.ok) throw new Error('测速接口异常');
                    const updatedData = await res.json();
                    setServers(updatedData.servers);
                    setIconLib(updatedData.icons);
                    setTelegramForm(updatedData.telegram || telegramForm);
                    setConfigUpdatedAt(Number(updatedData.updatedAt) || configUpdatedAt);
                    setConfigRevision(updatedData.revision || configRevision);
                    setNotifyEnabled(Boolean(updatedData.notifyEnabled));
                } catch(e) {
                    alert("测速接口异常");
                } finally {
                    setIsRefreshing(false);
                }
            };

            const getProxyImgSrc = (u) => {
                if (!u) return "";
                if (u.startsWith('data:')) return u; 
                return "/proxy-img?url=" + encodeURIComponent(u);
            };

            // 核心修复 2：安全图标渲染器，防止乱码数据导致黑屏崩溃
            const getSafeIconLib = () => {
                return (typeof iconLib === 'object' && iconLib !== null && !Array.isArray(iconLib)) ? iconLib : {};
            };

            const getDisplayIcon = (server) => {
                if (server.customIcon) return server.customIcon;
                if (!server.name) return null;
                const n = server.name.toLowerCase();
                const safeIcons = getSafeIconLib();
                for (let k in safeIcons) { if (n.includes(k.toLowerCase())) return safeIcons[k]; }
                return null;
            };

            const formatCheckTime = (time) => {
                if (!time) return 'N/A';
                return new Date(time).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            };

            const getHistoryStatus = (item) => {
                if (typeof item === 'number') return item ? 'online' : 'offline';
                if (item && typeof item === 'object') return item.status === 'online' ? 'online' : 'offline';
                return 'unknown';
            };

            const getAvailabilityStats = (server, range = availabilityRange) => {
                const now = Date.now();
                const rangeMs = range === 'week' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
                const history = Array.isArray(server.history)
                    ? server.history.filter(item => item && typeof item === 'object' && item.time && item.time >= now - rangeMs)
                    : [];
                const valid = history.filter(item => getHistoryStatus(item) !== 'unknown');
                const online = valid.filter(item => getHistoryStatus(item) === 'online').length;
                const offline = valid.filter(item => getHistoryStatus(item) === 'offline').length;
                return {
                    total: valid.length,
                    online,
                    offline,
                    uptime: valid.length ? ((online / valid.length) * 100).toFixed(1) : '---'
                };
            };

            const getOfflineSince = (server) => {
                if (server.status !== 'offline') return '';
                const history = Array.isArray(server.history) ? server.history : [];
                for (let i = history.length - 1; i >= 0; i--) {
                    if (getHistoryStatus(history[i]) === 'online') {
                        const next = history[i + 1];
                        return next && next.time ? next.time : server.lastCheck;
                    }
                }
                return server.lastCheck;
            };

	            const formatDuration = (startTime) => {
                if (!startTime) return '刚刚';
                const minutes = Math.max(1, Math.floor((Date.now() - startTime) / 60000));
                if (minutes < 60) return minutes + ' 分钟';
                const hours = Math.floor(minutes / 60);
                const rest = minutes % 60;
	                return hours + ' 小时' + (rest ? ' ' + rest + ' 分钟' : '');
	            };

	            const stripProtocol = (value) => {
	                const text = String(value || '');
	                const lower = text.toLowerCase();
	                if (lower.startsWith('http://')) return text.slice(7);
	                if (lower.startsWith('https://')) return text.slice(8);
	                return text;
	            };

	            const cleanPortInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').slice(0, 5);

	            const sortedServers = [...servers].sort((a, b) => {
	                const rank = { offline: 0, updating: 1, unknown: 2, online: 3 };
	                const aRank = rank[a.status] !== undefined ? rank[a.status] : 2;
	                const bRank = rank[b.status] !== undefined ? rank[b.status] : 2;
	                const statusDiff = aRank - bRank;
	                if (statusDiff !== 0) return statusDiff;
	                return (b.latency || 0) - (a.latency || 0);
	            });

            const resetServerForm = () => {
                setAddForm({ name: '', protocol: 'https://', host: '', port: '443' });
                setMediaForm({ enabled: false, username: '', password: '' });
                setQuickImportText('');
                setEditingServerId(null);
            };

	            const splitServerUrl = (value) => {
	                let raw = String(value || '').trim();
	                const lowerRaw = raw.toLowerCase();
	                if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;
	                try {
	                    const parsed = new URL(raw);
	                    return {
	                        protocol: parsed.protocol === 'http:' ? 'http://' : 'https://',
	                        host: parsed.hostname,
	                        port: parsed.port || (parsed.protocol === 'http:' ? '80' : '443')
	                    };
	                } catch(e) {
	                    return { protocol: 'https://', host: value || '', port: '443' };
	                }
	            };

            const updateHostFromInput = (value) => {
                const parsed = splitServerUrl(value);
                setAddForm({...addForm, protocol: parsed.protocol, host: parsed.host, port: parsed.port});
            };

            const extractFieldFromText = (lines, labels, skipPattern) => {
                const labelPattern = labels.join('|');
                const directPattern = new RegExp('^(?:' + labelPattern + ')\\s*(?:[|:：=\\-]+)?\\s*(.+)$', 'i');
                for (const line of lines) {
                    const clean = line.replace(/^[\\s·•*\\-_|▎]+/, '').trim();
                    if (!clean || (skipPattern && skipPattern.test(clean))) continue;
                    const directMatch = clean.match(directPattern);
                    if (directMatch && directMatch[1]) return directMatch[1].trim();
                    for (const label of labels) {
                        const index = clean.toLowerCase().indexOf(label.toLowerCase());
                        if (index < 0) continue;
                        const rest = clean.slice(index + label.length).replace(/^[\\s|:：=\\-]+/, '').trim();
                        if (rest) return rest;
                    }
                }
                return '';
            };

            const parseQuickImportText = (value) => {
                const text = String(value || '');
                const lines = text.split(/\\r?\\n/);
                const urlMatch = text.match(/https?:\\/\\/[^\\s"'<>，。；、）)】]+/i);
                const rawUrl = urlMatch ? urlMatch[0].replace(/[.,;，。；]+$/, '') : '';
                return {
                    username: extractFieldFromText(lines, ['用户名称', '用户名', '账号', '账户', 'user name', 'username', 'user'], /安全密码|到期|线路|服务器/i),
                    password: extractFieldFromText(lines, ['用户密码', '登录密码', '密码', 'password', 'pass'], /安全密码|安全码|pin|到期|线路|服务器/i),
                    url: rawUrl
                };
            };

            const applyQuickImportText = (value) => {
                setQuickImportText(value);
                const parsed = parseQuickImportText(value);
                if (parsed.url) {
                    const parsedUrl = splitServerUrl(parsed.url);
                    setAddForm((current) => ({
                        ...current,
                        name: current.name || parsed.username || parsedUrl.host,
                        protocol: parsedUrl.protocol,
                        host: parsedUrl.host,
                        port: parsedUrl.port
                    }));
                } else if (parsed.username) {
                    setAddForm((current) => ({ ...current, name: current.name || parsed.username }));
                }
                if (parsed.username || parsed.password) {
                    setMediaForm((current) => ({
                        ...current,
                        enabled: true,
                        username: parsed.username || current.username,
                        password: parsed.password || current.password
                    }));
                }
            };

	            const toggleProtocol = () => {
	                const nextProtocol = addForm.protocol === 'https://' ? 'http://' : 'https://';
	                const defaultPort = nextProtocol === 'https://' ? '443' : '80';
	                setAddForm({...addForm, protocol: nextProtocol, port: (!addForm.port || addForm.port === '443' || addForm.port === '80') ? defaultPort : addForm.port});
	            };

	            const buildServerUrlFromForm = () => {
	                let host = addForm.host.trim();
	                const lowerHost = host.toLowerCase();
	                if (lowerHost.startsWith('http://')) host = host.slice(7);
	                if (lowerHost.startsWith('https://')) host = host.slice(8);
	                const slashIndex = host.indexOf('/');
	                if (slashIndex >= 0) host = host.slice(0, slashIndex);
	                const colonIndex = host.lastIndexOf(':');
	                const hasPort = colonIndex > 0 && !host.includes(']') && host.slice(colonIndex + 1).split('').every(ch => ch >= '0' && ch <= '9');
	                const hostParts = hasPort ? [host, host.slice(0, colonIndex), host.slice(colonIndex + 1)] : null;
	                const finalHost = hostParts ? hostParts[1] : host;
	                const port = (hostParts ? hostParts[2] : addForm.port).trim();
	                if (!finalHost) return '';
	                return addForm.protocol + finalHost + (port ? ':' + port : '');
	            };

	            const openAddServerModal = () => {
	                resetServerForm();
	                setIsAddModalOpen(true);
	            };

	            const openEditServerModal = (server) => {
	                const parsed = splitServerUrl(server.url || '');
	                setEditingServerId(server.id);
	                setAddForm({ name: server.name || '', protocol: parsed.protocol, host: parsed.host, port: parsed.port });
	                setMediaForm({
	                    enabled: Boolean(server.mediaStats && server.mediaStats.enabled),
	                    username: server.mediaStats ? server.mediaStats.username || '' : '',
	                    password: server.mediaStats ? server.mediaStats.password || '' : ''
	                });
	                setIsAddModalOpen(true);
	            };

	            const handleSaveServer = async () => {
	                if(!addForm.name || !addForm.host) return alert("请填写名称和地址");
	                let finalUrl = buildServerUrlFromForm();
	                if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);

	                const buildMediaStats = (existing) => {
	                    const previousMedia = existing && existing.mediaStats ? existing.mediaStats : {};
	                    const credentialsChanged = previousMedia.username !== mediaForm.username.trim() || previousMedia.password !== mediaForm.password;
	                    return {
	                        enabled: mediaForm.enabled,
	                        username: mediaForm.enabled ? mediaForm.username.trim() : '',
	                        password: mediaForm.enabled ? mediaForm.password : '',
	                        deviceId: previousMedia.deviceId || ('forward-' + Date.now().toString(36)),
	                        accessToken: mediaForm.enabled && !credentialsChanged ? (previousMedia.accessToken || '') : '',
	                        lastCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastCheck || 0) : 0,
	                        lastError: '',
	                        counts: mediaForm.enabled && !credentialsChanged ? (previousMedia.counts || null) : null,
                        previousCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.previousCounts || null) : null,
                        delta24h: mediaForm.enabled && !credentialsChanged ? (previousMedia.delta24h || null) : null,
                        todayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.todayCounts || null) : null,
                        yesterdayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.yesterdayCounts || null) : null,
                        dailyDelta: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyDelta || null) : null,
                        dailyKey: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyKey || '') : ''
	                    };
	                };

	                let updatedServers;
	                if (editingServerId) {
	                    updatedServers = servers.map((server) => {
	                        if (server.id !== editingServerId) return server;
	                        const urlChanged = server.url !== finalUrl;
	                        return {
	                            ...server,
	                            name: addForm.name,
	                            url: finalUrl,
	                            status: urlChanged ? 'updating' : server.status,
	                            latency: urlChanged ? 0 : server.latency,
	                            mediaStats: buildMediaStats(server)
	                        };
	                    });
	                } else {
	                    const newServer = {
	                        id: Date.now(), name: addForm.name, url: finalUrl,
	                        customIcon: null, status: 'updating', 
	                        totalChecks: 0, successfulChecks: 0, uptime: "0.0", latency: 0, lastCheck: 0, history: [],
	                        mediaStats: buildMediaStats(null)
	                    };
	                    updatedServers = [...servers, newServer];
	                }

	                const savedUpdatedAt = await syncToCloud(updatedServers, iconLib);
	                
	                setIsAddModalOpen(false); 
	                resetServerForm();
	                setActiveTab('cards');

	                await manualPing(updatedServers, savedUpdatedAt);
	            };

	            const handleSaveTelegram = async () => {
	                const nextTelegram = {
	                    enabled: Boolean(telegramForm.enabled),
	                    botToken: telegramForm.botToken.trim(),
	                    chatId: telegramForm.chatId.trim()
	                };
	                try {
	                    setTelegramForm(nextTelegram);
	                    await syncToCloud(servers, iconLib, nextTelegram);
	                    setNotifyEnabled(nextTelegram.enabled && nextTelegram.botToken && nextTelegram.chatId);
	                    alert("Telegram 配置已保存");
	                } catch(e) {
	                    alert("Telegram 配置保存失败");
	                }
	            };

            const handleSyncIcons = async () => {
                if(!iconInput.includes('http')) return alert("请输入 JSON 链接");
                try {
                    const r = await apiFetch("/api/fetch-icons?url=" + encodeURIComponent(iconInput));
                    if (!r.ok) throw new Error(await r.text() || '图标库拉取失败');
                    const icons = await r.json();
                    if (!icons || typeof icons !== 'object' || Array.isArray(icons) || Object.keys(icons).length === 0) {
                        throw new Error('没有从该 JSON 中识别到图片链接');
                    }
                    setIconLib(icons); 
                    localStorage.setItem('last_icon_input', iconInput);
                    await syncToCloud(servers, icons);
                    alert("图标库拉取并提取成功！");
                } catch(e) { 
                    alert("解析失败：" + (e.message || "请检查 JSON 链接格式。")); 
                }
            };

            const checkForUpdate = async (showAlert = true) => {
                setIsCheckingUpdate(true);
                try {
                    const r = await apiFetch('/api/update/check');
                    if (r.status === 401) {
                        if (showAlert) alert('请先输入正确的管理 Token');
                        return;
                    }
                    const data = await r.json();
                    setUpdateInfo(data);
                    if (showAlert) {
                        alert(data.hasUpdate ? ('发现新版本：' + data.latestVersion) : '当前已经是最新版本');
                    }
                } catch(e) {
                    if (showAlert) alert('检查更新失败：' + (e.message || '网络异常'));
                } finally {
                    setIsCheckingUpdate(false);
                }
            };

            const applyUpdate = async () => {
                if (!updateInfo || !updateInfo.hasUpdate) return alert('当前没有可更新版本');
                if (!updateInfo.canUpdate) return alert('当前 Worker 没有配置自更新环境变量，请按 README 配置 CF_ACCOUNT_ID、CF_WORKER_NAME、CF_API_TOKEN 和 UPDATE_ENABLED');
                if (!confirm('确认更新到 ' + updateInfo.latestVersion + '？更新会覆盖当前 Worker 代码，但不会清空 KV 配置。')) return;
                setIsApplyingUpdate(true);
                try {
                    const r = await apiFetch('/api/update/apply', { method: 'POST' });
                    const data = await r.json().catch(() => ({}));
                    if (!r.ok || !data.ok) throw new Error(data.error || '更新失败');
                    alert('更新完成，页面即将刷新');
                    setTimeout(() => location.reload(), 1200);
                } catch(e) {
                    alert('更新失败：' + (e.message || 'Cloudflare API 调用异常'));
                } finally {
                    setIsApplyingUpdate(false);
                }
            };

            if (isLoading) return <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold">读取云端配置中...</div>;
            const onlineCount = servers.filter(s => s.status === 'online').length;
            const offlineCount = servers.filter(s => s.status === 'offline').length;
            const availabilityLabel = availabilityRange === 'week' ? '近 7 天' : '近 24 小时';
            const availabilityTotals = servers.reduce((acc, s) => {
                const stats = getAvailabilityStats(s);
                acc.online += stats.online;
                acc.total += stats.total;
                return acc;
            }, { online: 0, total: 0 });
            const availabilityUptime = availabilityTotals.total ? ((availabilityTotals.online / availabilityTotals.total) * 100).toFixed(1) + "%" : "---%";
            const notifyLabel = notifyEnabled ? '已开启' : '未开启';
            const safeIconEntries = Object.entries(getSafeIconLib());
            const iconSearchTerm = iconSearch.trim().toLowerCase();
            const filteredIconEntries = iconSearchTerm
                ? safeIconEntries.filter(([key, url]) => (key + ' ' + url).toLowerCase().includes(iconSearchTerm))
                : safeIconEntries;

            return (
                <div className="max-w-7xl mx-auto p-4 md:p-10 relative">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                        <div>
                            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 tracking-tighter">CLUSTER DASHBOARD</h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">高可用探针监控网络</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setHideServerMeta(!hideServerMeta)} className={"px-5 py-2.5 rounded-xl font-bold text-sm border shadow-sm transition-all flex items-center gap-2 " + (hideServerMeta ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-600" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700")}>
                                <span>{hideServerMeta ? '👁️‍🗨️' : '👁️'}</span>
                                {hideServerMeta ? '显示信息' : '隐藏信息'}
                            </button>
                            <button onClick={() => setShowSettings(!showSettings)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm text-slate-300 border border-slate-700 shadow-sm transition-all">⚙️ 库设置</button>
	                            <button onClick={openAddServerModal} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-sm text-emerald-950 shadow-lg transition-all">⊕ 部署节点</button>
                            <button onClick={() => manualPing(servers)} disabled={isRefreshing} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2">
                                <span className={isRefreshing ? "animate-spin inline-block" : "inline-block"}>↻</span> {isRefreshing ? "测速中..." : "立刻测速"}
                            </button>
                        </div>
                    </header>

	                    {showSettings && (
	                        <div className="mb-8 p-6 glass-card rounded-[2rem] animate-in fade-in space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">程序更新</div>
                                        <div className="text-sm font-bold text-slate-200">
                                            当前版本：{updateInfo ? updateInfo.currentVersion : APP_VERSION}
                                            {updateInfo && updateInfo.hasUpdate && <span className="ml-3 text-amber-300">发现新版本 {updateInfo.latestVersion}</span>}
                                            {updateInfo && !updateInfo.hasUpdate && <span className="ml-3 text-emerald-400">已是最新</span>}
                                        </div>
                                        {updateInfo && !updateInfo.canUpdate && (
                                            <div className="text-[11px] text-slate-500 mt-1">未配置自更新环境变量时，只能提示新版本，不能一键更新。</div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => checkForUpdate(true)} disabled={isCheckingUpdate || isApplyingUpdate} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl font-bold text-sm text-slate-200 border border-slate-700">
                                            {isCheckingUpdate ? '检查中...' : '检查更新'}
                                        </button>
                                        <button onClick={applyUpdate} disabled={!updateInfo || !updateInfo.hasUpdate || isApplyingUpdate} className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 rounded-xl font-black text-sm text-slate-950">
                                            {isApplyingUpdate ? '更新中...' : '一键更新'}
                                        </button>
                                    </div>
                                </div>
	                            <div className="flex flex-col md:flex-row gap-4 items-end">
	                                <div className="flex-1 w-full">
	                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">第三方图标映射库 (JSON)</label>
	                                    <input type="text" className="w-full bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl outline-none focus:border-blue-500 text-sm text-slate-200" value={iconInput} onChange={e => setIconInput(e.target.value)} />
	                                </div>
	                                <button onClick={handleSyncIcons} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white">拉取图标</button>
	                            </div>
	                            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_120px] gap-4 items-end pt-5 border-t border-white/10">
	                                <label className="flex items-center gap-3 text-sm font-bold text-slate-300 pb-4">
	                                    <input type="checkbox" checked={telegramForm.enabled} onChange={e => setTelegramForm({...telegramForm, enabled: e.target.checked})} />
	                                    TG 通知
	                                </label>
	                                <div>
	                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Bot Token</label>
	                                    <input type="password" className="w-full bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl outline-none focus:border-blue-500 text-sm text-slate-200" value={telegramForm.botToken} onChange={e => setTelegramForm({...telegramForm, botToken: e.target.value})} />
	                                </div>
	                                <div>
	                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Chat ID</label>
	                                    <input type="text" className="w-full bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl outline-none focus:border-blue-500 text-sm text-slate-200" value={telegramForm.chatId} onChange={e => setTelegramForm({...telegramForm, chatId: e.target.value})} />
	                                </div>
	                                <button onClick={handleSaveTelegram} className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm text-white">保存</button>
	                            </div>
	                        </div>
	                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex bg-slate-800/40 border border-slate-700/50 p-1.5 rounded-2xl w-fit shadow-inner">
                            <button onClick={() => setActiveTab('cards')} className={"px-8 py-2.5 rounded-xl text-sm font-bold transition-all " + (activeTab === 'cards' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200")}>🖥️ 节点看板</button>
                            <button onClick={() => setActiveTab('dashboard')} className={"px-8 py-2.5 rounded-xl text-sm font-bold transition-all " + (activeTab === 'dashboard' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200")}>📊 历史大盘</button>
                        </div>
                        {activeTab === 'cards' && (
                            <div className="flex bg-slate-800/40 border border-slate-700/50 p-1.5 rounded-2xl w-fit shadow-inner">
                                <button onClick={() => setAvailabilityRange('day')} className={"px-5 py-2 rounded-xl text-xs font-black transition-all " + (availabilityRange === 'day' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200")}>近 24 小时</button>
                                <button onClick={() => setAvailabilityRange('week')} className={"px-5 py-2 rounded-xl text-xs font-black transition-all " + (availabilityRange === 'week' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200")}>近 7 天</button>
                            </div>
                        )}
                    </div>

                    {activeTab === 'cards' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
	                                {[
	                                    { label: '在线节点', value: onlineCount + "/" + servers.length, icon: "🟢", bg: 'bg-blue-500/10' },
	                                    { label: '当前离线', value: offlineCount, icon: "🔴", bg: 'bg-red-500/10' },
	                                    { label: availabilityLabel + '可用率', value: availabilityUptime, icon: "📈", bg: 'bg-emerald-500/10' },
	                                    { label: '通知状态', value: notifyLabel, icon: "✈️", bg: 'bg-purple-500/10' },
	                                ].map((item, idx) => (
                                    <div key={idx} className="glass-card p-6 rounded-[2rem] border border-white/5 shadow-xl">
                                        <div className={"w-10 h-10 flex items-center justify-center rounded-2xl text-xl mb-4 " + item.bg}>{item.icon}</div>
                                        <div className="text-3xl font-black text-white tracking-tighter leading-none">{item.value}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 opacity-60">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	                                {sortedServers.map((s, i) => {
	                                    const iconImg = getDisplayIcon(s);
	                                    const isOnline = s.status === 'online';
	                                    const availabilityStats = getAvailabilityStats(s);
	                                    const offlineSince = getOfflineSince(s);
	                                    const availabilityUptimeValue = parseFloat(availabilityStats.uptime);
	                                    const availabilityUptimeClass = availabilityStats.uptime === '---' ? "text-slate-400" : availabilityUptimeValue >= 95 ? "text-emerald-400/90" : availabilityUptimeValue >= 80 ? "text-amber-400/90" : "text-red-400/90";
	                                    const glowClass = isOnline ? 'bg-emerald-500' : s.status === 'updating' ? 'bg-blue-500' : s.status === 'unknown' ? 'bg-slate-500' : 'bg-red-500';
	                                    return (
	                                        <div key={s.id} className={"glass-card p-6 rounded-[2.5rem] hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden shadow-2xl flex flex-col " + (s.status === 'offline' ? "border-red-500/40" : "")}>
	                                            <div className={"absolute -right-12 -top-12 w-40 h-40 blur-[70px] opacity-20 rounded-full transition-colors " + glowClass}></div>
                                            <div className="flex justify-between items-start mb-6 relative z-10">
                                                <div onClick={() => setIconModalTarget(s.id)} className="w-16 h-16 bg-slate-900/80 rounded-[1.2rem] flex items-center justify-center overflow-hidden border border-white/5 shadow-inner cursor-pointer hover:border-blue-500/50" title="自定义图标">
                                                    {hideServerMeta ? <span className="text-lg font-black text-slate-600">•••</span> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className="w-full h-full object-contain p-2" onError={(e) => {e.target.style.display='none'}} /> : <span className="text-2xl font-black text-slate-700">{s.name ? s.name[0] : '?'}</span>)}
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5 mt-1">
                                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
                                                        <span className={"status-dot " + s.status}></span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '等待测速'}</span>
                                                    </div>
                                                    {isOnline && s.latency > 0 && <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">{s.latency}ms</span>}
                                                    {s.status === 'offline' && <span className="text-[10px] font-bold text-red-300 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">已离线 {formatDuration(offlineSince)}</span>}
                                                </div>
	                                            </div>
	                                            <h3 className="font-black text-xl text-white truncate mb-1">{hideServerMeta ? '已隐藏节点信息' : s.name}</h3>
	                                            <p className="text-[10px] text-slate-400 truncate mb-6 font-mono font-bold opacity-70">{hideServerMeta ? '🔒 ********' : '🔗 ' + stripProtocol(s.url)}</p>
	                                            
	                                            <div className="mt-auto grid grid-cols-2 gap-3 bg-slate-900/50 rounded-3xl p-4 border border-white/5 shadow-inner mb-5">
	                                                <div className="text-center">
	                                                    <div className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">{availabilityLabel}可用率</div>
	                                                    <div className={"text-xl font-black " + availabilityUptimeClass}>{availabilityStats.uptime}{availabilityStats.uptime === '---' ? '' : '%'}</div>
	                                                </div>
	                                                <div className="text-center relative">
	                                                    <div className="absolute left-0 top-1 bottom-1 w-px bg-slate-800"></div>
	                                                    <div className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">{availabilityLabel}离线</div>
	                                                    <div className="text-xl font-black text-red-400/90">{availabilityStats.offline}</div>
	                                                </div>
	                                            </div>
	                                            {s.mediaStats && s.mediaStats.enabled && (
	                                                <div className="mb-5 p-4 rounded-3xl bg-slate-950/40 border border-white/5">
	                                                        <div className="flex items-center justify-between mb-3">
	                                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">媒体库资源</span>
	                                                            <span className={"text-[10px] font-bold " + (s.mediaStats.lastError ? "text-red-400" : "text-slate-500")}>{s.mediaStats.lastError ? "统计失败" : "较昨日"}</span>
	                                                        </div>
	                                                        <div className="grid grid-cols-3 gap-2 text-center">
	                                                            {[
	                                                                ['电影', 'movie'],
	                                                                ['剧集', 'series'],
	                                                                ['集数', 'episode']
	                                                            ].map(([label, key]) => {
	                                                                const count = s.mediaStats.counts ? s.mediaStats.counts[key] : null;
	                                                                const delta = s.mediaStats.dailyDelta ? s.mediaStats.dailyDelta[key] : (s.mediaStats.delta24h ? s.mediaStats.delta24h[key] : 0);
	                                                                return (
	                                                                    <div key={key}>
	                                                                        <div className="text-[9px] text-slate-500 font-bold mb-1">{label}</div>
	                                                                        <div className="text-sm font-black text-slate-100">{count === null ? '--' : count}</div>
	                                                                        <div className={"text-[10px] font-bold " + (delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-slate-500")}>{delta > 0 ? '+' + delta : delta}</div>
	                                                                    </div>
	                                                                );
	                                                            })}
	                                                        </div>
	                                                        <div title={s.mediaStats.lastError || ''} className={"mt-3 text-[9px] font-mono " + (s.mediaStats.lastError ? "text-red-400 whitespace-normal" : "text-slate-600 truncate")}>统计: {formatCheckTime(s.mediaStats.lastCheck)}{s.mediaStats.lastError ? ' / ' + s.mediaStats.lastError : ''}</div>
	                                                    </div>
	                                            )}
	                                            <div className="flex justify-between items-center relative z-10 pt-2 opacity-70 hover:opacity-100 transition-opacity">
	                                                <span className="text-[9px] text-slate-500 font-mono font-bold">最近检测: {formatCheckTime(s.lastCheck)}</span>
	                                                <div className="flex items-center gap-3">
	                                                    <button onClick={() => openEditServerModal(s)} className="text-[10px] font-bold text-slate-500 hover:text-blue-400">编辑</button>
	                                                    <button onClick={async () => {
	                                                        if(confirm('彻底删除该节点?')) {
	                                                            const n=servers.filter(x=>x.id!==s.id); 
	                                                            await syncToCloud(n, iconLib);
	                                                        }
	                                                    }} className="text-[10px] font-bold text-slate-500 hover:text-red-500">删除</button>
	                                                </div>
	                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in duration-300 glass-card rounded-[2rem] p-3 flex flex-col gap-2 shadow-2xl">
	                            {sortedServers.map((s) => (
                                <div key={s.id} className="p-5 rounded-3xl bg-slate-900/30 hover:bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        {!hideServerMeta && (
                                            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/5 overflow-hidden flex items-center justify-center flex-none">
                                                {getDisplayIcon(s) ? <img src={getProxyImgSrc(getDisplayIcon(s))} className="w-full h-full object-contain p-1.5" onError={(e) => {e.target.style.display='none'}} /> : <span className="text-sm font-black text-slate-600">{s.name ? s.name[0] : '?'}</span>}
                                            </div>
                                        )}
                                        <div className={"px-3 py-1.5 rounded-xl text-xs font-black " + (parseFloat(s.uptime) > 95 ? "bg-emerald-500/20 text-emerald-400" : parseFloat(s.uptime) > 50 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400")}>
                                            {s.totalChecks > 0 ? s.uptime + "%" : "---%"}
                                        </div>
	                                        <div className="min-w-0">
	                                            <div className="font-bold text-white text-base tracking-tight truncate">{hideServerMeta ? '已隐藏节点信息' : s.name}</div>
	                                            <div className="text-[10px] text-slate-500 font-mono font-bold mt-1">最近检测: {formatCheckTime(s.lastCheck)}</div>
	                                        </div>
                                    </div>
                                    <StatusBars history={s.history || []} />
                                </div>
                            ))}
                            {servers.length === 0 && <div className="p-10 text-center text-slate-500 font-bold text-sm">暂无数据供大盘展示。</div>}
                        </div>
                    )}

                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		                            <div className="glass-modal p-8 rounded-[2.5rem] w-full max-w-md max-h-[92vh] overflow-y-auto relative">
	                                <button onClick={() => { setIsAddModalOpen(false); resetServerForm(); }} className="absolute top-6 right-6 text-slate-500 hover:text-white font-bold text-xl">✕</button>
		                                <h2 className="text-2xl font-black text-white mb-6">{editingServerId ? '编辑节点' : '🎯 部署新探针'}</h2>
	                                <div className="space-y-5">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">快速粘贴</label>
                                            <textarea
                                                className="w-full mt-1 h-28 bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm text-white resize-none"
                                                placeholder="粘贴包含用户名、密码、线路的文本"
                                                value={quickImportText}
                                                onChange={e=>applyQuickImportText(e.target.value)}
                                            />
                                        </div>
	                                    <div>
	                                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">节点标识 (别名)</label>
	                                        <input className="w-full mt-1 bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm text-white" value={addForm.name} onChange={e=>setAddForm({...addForm, name: e.target.value})} />
	                                    </div>
		                                    <div>
		                                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">节点地址</label>
		                                        <div className="mt-1 grid grid-cols-[92px_1fr_88px] gap-2">
		                                            <button onClick={toggleProtocol} className="bg-slate-800 border border-slate-700/70 rounded-2xl text-xs font-black text-emerald-300 hover:border-emerald-500 transition-colors">{addForm.protocol.replace('://', '')}</button>
		                                            <input className="w-full bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm text-white font-mono" placeholder="域名或 IP" value={addForm.host} onChange={e=>updateHostFromInput(e.target.value)} />
		                                            <input className="w-full bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm text-white font-mono" placeholder="端口" value={addForm.port} onChange={e=>setAddForm({...addForm, port: cleanPortInput(e.target.value)})} />
		                                        </div>
		                                    </div>
	                                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 space-y-4">
	                                        <label className="flex items-center gap-3 text-sm font-bold text-slate-300">
	                                            <input type="checkbox" checked={mediaForm.enabled} onChange={e=>setMediaForm({...mediaForm, enabled: e.target.checked})} />
	                                            启用媒体库资源统计
	                                        </label>
	                                        {mediaForm.enabled && (
	                                            <div className="grid grid-cols-1 gap-4">
	                                                <div>
	                                                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Emby 用户名</label>
	                                                    <input className="w-full mt-1 bg-slate-950/80 border border-slate-700/50 p-3 rounded-xl outline-none focus:border-emerald-500 text-sm text-white" value={mediaForm.username} onChange={e=>setMediaForm({...mediaForm, username: e.target.value})} />
	                                                </div>
	                                                <div>
	                                                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Emby 密码</label>
	                                                    <input type="password" className="w-full mt-1 bg-slate-950/80 border border-slate-700/50 p-3 rounded-xl outline-none focus:border-emerald-500 text-sm text-white" value={mediaForm.password} onChange={e=>setMediaForm({...mediaForm, password: e.target.value})} />
	                                                </div>
	                                            </div>
	                                        )}
	                                    </div>
		                                    <button onClick={handleSaveServer} className="w-full mt-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black tracking-widest text-sm shadow-xl transition-all">{editingServerId ? '保存修改' : '确认部署'}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {iconModalTarget && (
                        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                            <div className="glass-modal p-8 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col relative border border-slate-700">
                                <button onClick={() => setIconModalTarget(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white font-bold text-xl z-10">✕</button>
                                <h2 className="text-2xl font-black text-white mb-2">🖼️ 视觉资产库</h2>
                                <p className="text-xs text-slate-400 mb-6 font-bold">点击下方 Logo 为节点应用自定义图标。</p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-950/80 border border-slate-700/60 px-4 py-3 rounded-2xl outline-none focus:border-blue-500 text-sm text-slate-100"
                                        placeholder="搜索图标名称或链接"
                                        value={iconSearch}
                                        onChange={e => setIconSearch(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 whitespace-nowrap">
                                        {filteredIconEntries.length} / {safeIconEntries.length}
                                    </div>
                                </div>
                                <div className="overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pb-4 mt-2">
                                    <div onClick={async () => {
                                        const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: null} : s); 
                                        await syncToCloud(up, iconLib);
                                        setIconModalTarget(null);
                                    }} className="aspect-square bg-slate-900/50 rounded-[1.2rem] border border-slate-700/50 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 hover:bg-red-500/10">
                                        <span className="text-[10px] font-bold text-slate-500">自动匹配</span>
                                    </div>
                                    {filteredIconEntries.map(([key, url], idx) => (
                                        <div key={idx} onClick={async () => {
                                            const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: url} : s); 
                                            await syncToCloud(up, iconLib);
                                            setIconModalTarget(null);
                                        }} className="aspect-square bg-slate-900/80 rounded-[1.2rem] border border-slate-800 p-3 cursor-pointer hover:border-blue-500 hover:scale-110 flex items-center justify-center shadow-inner relative group transition-all">
                                            <img src={getProxyImgSrc(url)} className="w-full h-full object-contain drop-shadow-lg" loading="lazy" onError={(e) => {e.target.style.display='none'}} />
                                            <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 text-[9px] font-mono text-slate-300 bg-black/90 px-2 py-1 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-xl">{key}</div>
                                        </div>
                                    ))}
                                    {filteredIconEntries.length === 0 && (
                                        <div className="col-span-4 sm:col-span-6 md:col-span-8 py-12 text-center text-slate-500 text-sm font-bold">
                                            没有匹配的图标
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        };
        const rootEl = document.getElementById('root');
        try {
            if (!window.React || !window.ReactDOM) throw new Error('React 或 ReactDOM 未加载');
            if (rootEl) {
                ReactDOM.createRoot(rootEl).render(<App />);
                window.__EMBY_DASHBOARD_BOOTED__ = true;
            }
        } catch(e) {
            showBootError('React 渲染失败：' + (e.message || e.toString()));
        }
    </script>
    <script>
        setTimeout(function() {
            var root = document.getElementById('root');
            if (!window.__EMBY_DASHBOARD_BOOTED__ && root && root.textContent.indexOf('页面加载中') !== -1) {
                root.innerHTML = '<div style="max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;">前端启动失败：React/Babel 脚本没有完成渲染。请确认部署的是最新 emby.js，并打开浏览器控制台查看具体报错。</div>';
            }
        }, 4500);
    </script>
</body>
</html>
`;

export default {
  APP_VERSION: '2026.05.16.1',
  UPDATE_REPO_OWNER: 'pototazhang',
  UPDATE_REPO_NAME: 'emby-js',
  UPDATE_BRANCH: 'main',
  UPDATE_FILE: 'emby.js',
  HISTORY_LIMIT: 7 * 24 * 60,
  OFFLINE_NOTIFY_DELAY_MS: 5 * 60 * 1000,

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      if (request.method === 'GET') {
          const config = await this.loadConfig(env);
          return this.json({ ...config, notifyEnabled: this.isTelegramEnabled(env, config), telegram: this.getTelegramConfig(env, config) });
      }
      if (request.method === 'POST') { 
          const nextConfig = await request.json();
          const cleanConfig = this.sanitizeConfig(nextConfig);
          const latestConfig = await this.loadConfig(env);
          if (nextConfig.baseRevision && latestConfig.revision && nextConfig.baseRevision !== latestConfig.revision) {
              return this.json({ ok: false, error: 'Config changed, reload required', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
          }
          if (latestConfig.updatedAt && cleanConfig.updatedAt && cleanConfig.updatedAt < latestConfig.updatedAt) {
              return this.json({ ok: false, error: 'Stale config rejected', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
          }
          const savedConfig = await this.saveConfig(env, cleanConfig);
          return this.json({ ok: true, updatedAt: savedConfig.updatedAt, revision: savedConfig.revision }); 
      }
    }

    // 核心修复 3：暴力图标提取引擎，无论格式错多离谱，只要有链接就强行抽出来
    if (url.pathname === '/api/fetch-icons') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      try {
          const iconUrl = this.parsePublicHttpUrl(url.searchParams.get('url'));
          if (!iconUrl) return new Response('Invalid URL', { status: 400 });
          const r = await fetch(iconUrl.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' }
          });
          if (!r.ok) return new Response('{}', { status: 502, headers: { 'Content-Type': 'application/json' } });
          let txt = await r.text();
          
          try {
              // 先尝试正常修复和解析
              txt = txt.replace(/，/g, ',').replace(/“|”/g, '"').replace(/'/g, '"').replace(/,(\s*[}\\]])/g, '$1').trim();
              const parsedIcons = this.extractIcons(JSON.parse(txt));
              return this.json(parsedIcons);
          } catch(e) {
              // 暴力提取：直接抓出文本里所有的 http 图片链接生成图标库
              const urls = txt.match(/https?:\/\/[^"'\s]+/g) || [];
              return this.json(this.extractIcons(urls));
          }
      } catch(e) { return new Response('{}', { status: 500 }); }
    }

    if (url.pathname === '/proxy-img') {
        try {
            const target = this.parsePublicHttpUrl(url.searchParams.get('url'));
            if (!target) return new Response('Missing URL', { status: 400 });
            const imgRes = await fetch(target.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' } });
            const h = new Headers(imgRes.headers);
            const contentType = h.get('Content-Type') || '';
            if (!contentType.startsWith('image/')) return new Response('Not an image', { status: 415 });
            h.set('Access-Control-Allow-Origin', '*');
            h.set('Cache-Control', 'public, max-age=864000'); 
            return new Response(imgRes.body, { status: imgRes.status, headers: h });
        } catch(e) {
            return new Response('Error Proxying Image', { status: 500 });
        }
    }

    if (url.pathname === '/api/ping-all' && request.method === 'POST') {
      const auth = this.requireAdmin(request, env);
      if (auth) return auth;

      const currentConfig = await this.loadConfig(env);
      const updatedConfig = await this.runProbeLogic(env, currentConfig);
      return this.json({ ...updatedConfig, notifyEnabled: this.isTelegramEnabled(env, updatedConfig) });
    }

    if (url.pathname === '/api/update/check' && request.method === 'GET') {
      const auth = this.requireStrictAdmin(request, env);
      if (auth) return auth;

      try {
          const latestSource = await this.fetchLatestWorkerSource(env);
          const latestVersion = this.extractAppVersion(latestSource) || 'unknown';
          return this.json({
              currentVersion: this.APP_VERSION,
              latestVersion,
              hasUpdate: latestVersion !== 'unknown' && latestVersion !== this.APP_VERSION,
              canUpdate: this.canSelfUpdate(env),
              sourceUrl: this.getUpdateRawUrl(env),
              missing: this.getMissingUpdateEnv(env)
          });
      } catch(e) {
          return this.json({
              currentVersion: this.APP_VERSION,
              latestVersion: 'unknown',
              hasUpdate: false,
              canUpdate: this.canSelfUpdate(env),
              error: e.message || 'Check update failed',
              missing: this.getMissingUpdateEnv(env)
          }, 502);
      }
    }

    if (url.pathname === '/api/update/apply' && request.method === 'POST') {
      const auth = this.requireStrictAdmin(request, env);
      if (auth) return auth;

      if (!this.canSelfUpdate(env)) {
          return this.json({ ok: false, error: 'Self update is not configured', missing: this.getMissingUpdateEnv(env) }, 400);
      }
      try {
          const latestSource = await this.fetchLatestWorkerSource(env);
          const latestVersion = this.extractAppVersion(latestSource);
          if (!latestVersion) return this.json({ ok: false, error: 'Latest source has no APP_VERSION' }, 422);
          if (latestVersion === this.APP_VERSION) return this.json({ ok: true, updated: false, version: this.APP_VERSION });
          await this.deployWorkerSource(env, latestSource);
          return this.json({ ok: true, updated: true, previousVersion: this.APP_VERSION, version: latestVersion });
      } catch(e) {
          return this.json({ ok: false, error: e.message || 'Update failed' }, 502);
      }
    }

    return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  },

  async scheduled(event, env, ctx) {
      ctx.waitUntil(this.loadConfig(env).then((config) => this.runProbeLogic(env, config)));
  },

  isTelegramEnabled(env, config = {}) {
      const configured = this.currentTelegramConfig(env, config);
      return configured.enabled && Boolean(configured.botToken) && Boolean(configured.chatId);
  },

  getTelegramConfig(env, config) {
      const current = this.currentTelegramConfig(env, config);
      return {
          enabled: current.enabled,
          botToken: current.botToken,
          chatId: current.chatId
      };
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
      if (!tg.enabled || !tg.botToken || !tg.chatId) return;
      const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
      try {
          await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  chat_id: tg.chatId,
                  text,
                  disable_web_page_preview: true
              })
          });
      } catch(e) {}
  },

  formatNotifyTime(time) {
      return new Date(time).toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
      });
  },

  buildStatusMessage(server, previousStatus, nextStatus) {
      const title = nextStatus === 'online' ? 'Emby 节点恢复在线' : 'Emby 节点离线';
      const latency = nextStatus === 'online' && server.latency ? '\n延迟：' + server.latency + 'ms' : '';
      const offlineDuration = nextStatus === 'offline' && server.offlineSince
          ? '\n已连续离线：' + Math.max(1, Math.floor((server.lastCheck - server.offlineSince) / 60000)) + ' 分钟'
          : '';
      return [
          title,
          '名称：' + server.name,
          '地址：' + server.url,
          '状态：' + (previousStatus || 'unknown') + ' -> ' + nextStatus,
          '时间：' + this.formatNotifyTime(server.lastCheck) + latency + offlineDuration
      ].join('\n');
  },

  json(data, status = 200) {
      return new Response(JSON.stringify(data), {
          status,
          headers: { 'Content-Type': 'application/json' }
      });
  },

  requireAdmin(request, env) {
      if (!env.ADMIN_TOKEN) return null;
      const expected = 'Bearer ' + env.ADMIN_TOKEN;
      if (request.headers.get('Authorization') === expected) return null;
      return this.json({ error: 'Unauthorized' }, 401);
  },

  requireStrictAdmin(request, env) {
      if (!env.ADMIN_TOKEN) return this.json({ error: 'ADMIN_TOKEN is required for update APIs' }, 401);
      return this.requireAdmin(request, env);
  },

  getUpdateRepo(env) {
      return {
          owner: env.UPDATE_REPO_OWNER || this.UPDATE_REPO_OWNER,
          repo: env.UPDATE_REPO_NAME || this.UPDATE_REPO_NAME,
          branch: env.UPDATE_BRANCH || this.UPDATE_BRANCH,
          file: env.UPDATE_FILE || this.UPDATE_FILE
      };
  },

  getUpdateRawUrl(env) {
      const repo = this.getUpdateRepo(env);
      return 'https://raw.githubusercontent.com/' + encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.repo) + '/' + encodeURIComponent(repo.branch) + '/' + repo.file.split('/').map(encodeURIComponent).join('/');
  },

  getMissingUpdateEnv(env) {
      const missing = [];
      if (!['1', 'true', 'yes', 'on'].includes(String(env.UPDATE_ENABLED || '').toLowerCase())) missing.push('UPDATE_ENABLED');
      if (!env.CF_ACCOUNT_ID) missing.push('CF_ACCOUNT_ID');
      if (!env.CF_WORKER_NAME) missing.push('CF_WORKER_NAME');
      if (!env.CF_API_TOKEN) missing.push('CF_API_TOKEN');
      return missing;
  },

  canSelfUpdate(env) {
      return this.getMissingUpdateEnv(env).length === 0;
  },

  async fetchLatestWorkerSource(env) {
      const sourceUrl = this.getUpdateRawUrl(env);
      const response = await fetch(sourceUrl, {
          headers: {
              'Accept': 'text/plain',
              'User-Agent': 'Emby-Cluster-Monitor-Updater/' + this.APP_VERSION
          }
      });
      if (!response.ok) throw new Error('GitHub source fetch failed HTTP ' + response.status);
      const source = await response.text();
      if (!this.isSafeWorkerSource(source)) throw new Error('Latest source validation failed');
      return source;
  },

  extractAppVersion(source) {
      const match = String(source || '').match(/APP_VERSION:\s*['"]([^'"]+)['"]/);
      return match ? match[1] : '';
  },

  isSafeWorkerSource(source) {
      const text = String(source || '');
      return text.length > 10000 &&
          text.length < 5 * 1024 * 1024 &&
          text.includes('Emby 集群探针') &&
          text.includes('export default') &&
          text.includes('HTML_CONTENT') &&
          Boolean(this.extractAppVersion(text));
  },

  async deployWorkerSource(env, source) {
      const form = new FormData();
      form.append('metadata', JSON.stringify({
          main_module: 'emby.js'
      }));
      form.append('emby.js', new Blob([source], { type: 'application/javascript+module' }), 'emby.js');

      const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(env.CF_ACCOUNT_ID) + '/workers/scripts/' + encodeURIComponent(env.CF_WORKER_NAME) + '/content';
      const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
              'Authorization': 'Bearer ' + env.CF_API_TOKEN
          },
          body: form
      });
      const detail = await response.text();
      if (!response.ok) {
          throw new Error('Cloudflare deploy failed HTTP ' + response.status + (detail ? ': ' + detail.slice(0, 300) : ''));
      }
      try {
          const parsed = JSON.parse(detail);
          if (parsed && parsed.success === false) {
              throw new Error('Cloudflare deploy rejected: ' + JSON.stringify(parsed.errors || parsed.messages || parsed).slice(0, 300));
          }
      } catch(e) {
          if (e.message && e.message.startsWith('Cloudflare deploy rejected')) throw e;
      }
      return detail;
  },

  async loadConfig(env) {
      const raw = await env.EMBY_DB.get('config');
      if (!raw) return this.withRevision({ servers: [], icons: {}, updatedAt: 0 });
      try {
          return this.withRevision(JSON.parse(raw));
      } catch(e) {
          return this.withRevision({ servers: [], icons: {}, updatedAt: 0 });
      }
  },

  async saveConfig(env, config) {
      const cleanConfig = this.withRevision(config);
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
          icons: clean.icons,
          telegram: clean.telegram,
          servers: clean.servers.map((server) => ({
              id: server.id,
              name: server.name,
              url: server.url,
              customIcon: server.customIcon,
              mediaStats: {
                  enabled: Boolean(server.mediaStats && server.mediaStats.enabled),
                  username: server.mediaStats ? server.mediaStats.username : '',
                  password: server.mediaStats ? server.mediaStats.password : ''
              }
          }))
      };
      const text = JSON.stringify(settingsOnly);
      let hash = 2166136261;
      for (let i = 0; i < text.length; i += 1) {
          hash ^= text.charCodeAt(i);
          hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(36);
  },

  sanitizeConfig(config) {
      const clean = { servers: [], icons: {}, telegram: { enabled: false, botToken: '', chatId: '' }, updatedAt: 0 };
      if (config && Number.isFinite(Number(config.updatedAt))) {
          clean.updatedAt = Math.max(0, Number(config.updatedAt));
      }
      if (config && config.telegram && typeof config.telegram === 'object') {
          clean.telegram = {
              enabled: Boolean(config.telegram.enabled),
              botToken: String(config.telegram.botToken || '').trim(),
              chatId: String(config.telegram.chatId || '').trim()
          };
      }
      if (config && Array.isArray(config.servers)) {
          clean.servers = config.servers
              .map((s) => {
                  const parsed = this.normalizeServerUrl(s && s.url);
                  if (!parsed) return null;
                  return {
                      id: s.id || Date.now(),
                      name: String(s.name || parsed.hostname).slice(0, 80),
                      url: parsed.toString().replace(/\/$/, ''),
                      customIcon: typeof s.customIcon === 'string' ? s.customIcon : null,
                      status: ['online', 'offline', 'updating', 'unknown'].includes(s.status) ? s.status : 'unknown',
                      totalChecks: Number.isFinite(Number(s.totalChecks)) ? Math.max(0, Number(s.totalChecks)) : 0,
                      successfulChecks: Number.isFinite(Number(s.successfulChecks)) ? Math.max(0, Number(s.successfulChecks)) : 0,
	                      uptime: typeof s.uptime === 'string' ? s.uptime : '0.0',
	                      latency: Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0,
	                      lastCheck: Number.isFinite(Number(s.lastCheck)) ? Number(s.lastCheck) : 0,
	                      offlineSince: Number.isFinite(Number(s.offlineSince)) ? Math.max(0, Number(s.offlineSince)) : 0,
	                      offlineAlertSentAt: Number.isFinite(Number(s.offlineAlertSentAt)) ? Math.max(0, Number(s.offlineAlertSentAt)) : 0,
	                      history: this.normalizeHistory(s.history, s.lastCheck),
	                      mediaStats: this.normalizeMediaStats(s.mediaStats)
	                  };
	              })
	              .filter(Boolean);
      }

      if (config && config.icons && typeof config.icons === 'object' && !Array.isArray(config.icons)) {
          clean.icons = this.extractIcons(config.icons);
      }

      return clean;
  },

  normalizeHistory(history, fallbackTime = 0) {
      if (!Array.isArray(history)) return [];
      const now = Date.now();
      const baseTime = Number.isFinite(Number(fallbackTime)) && Number(fallbackTime) > 0 ? Number(fallbackTime) : now;
      return history.slice(-this.HISTORY_LIMIT).map((entry, index, arr) => {
          if (entry && typeof entry === 'object') {
              const status = entry.status === 'online' || entry.status === 1 || entry.value === 1 ? 'online' : 'offline';
              const time = Number.isFinite(Number(entry.time)) && Number(entry.time) > 0
                  ? Number(entry.time)
                  : baseTime - ((arr.length - index - 1) * 60000);
              return {
                  status,
                  time,
                  latency: Number.isFinite(Number(entry.latency)) ? Math.max(0, Number(entry.latency)) : 0
              };
          }
          return {
              status: entry ? 'online' : 'offline',
              time: baseTime - ((arr.length - index - 1) * 60000),
              latency: 0
          };
      });
  },

  normalizeMediaStats(mediaStats) {
      const emptyCounts = { movie: 0, series: 0, episode: 0 };
      if (!mediaStats || typeof mediaStats !== 'object') {
          return {
              enabled: false,
              username: '',
              password: '',
              accessToken: '',
              deviceId: '',
              lastCheck: 0,
              lastError: '',
              counts: null,
              previousCounts: null,
              delta24h: null,
              todayCounts: null,
              yesterdayCounts: null,
              dailyDelta: null,
              dailyKey: ''
          };
      }
      const cleanCounts = (counts) => {
          if (!counts || typeof counts !== 'object') return null;
          return {
              movie: Number.isFinite(Number(counts.movie)) ? Math.max(0, Number(counts.movie)) : emptyCounts.movie,
              series: Number.isFinite(Number(counts.series)) ? Math.max(0, Number(counts.series)) : emptyCounts.series,
              episode: Number.isFinite(Number(counts.episode)) ? Math.max(0, Number(counts.episode)) : emptyCounts.episode,
              time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0
          };
      };
      const cleanDeltaCounts = (counts) => {
          if (!counts || typeof counts !== 'object') return null;
          return {
              movie: Number.isFinite(Number(counts.movie)) ? Number(counts.movie) : 0,
              series: Number.isFinite(Number(counts.series)) ? Number(counts.series) : 0,
              episode: Number.isFinite(Number(counts.episode)) ? Number(counts.episode) : 0,
              time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0
          };
      };
      const clean = {
          enabled: Boolean(mediaStats.enabled),
          username: String(mediaStats.username || '').slice(0, 120),
          password: String(mediaStats.password || ''),
          accessToken: String(mediaStats.accessToken || ''),
          deviceId: String(mediaStats.deviceId || ('forward-' + Math.random().toString(36).slice(2))).slice(0, 120),
          lastCheck: Number.isFinite(Number(mediaStats.lastCheck)) ? Number(mediaStats.lastCheck) : 0,
          lastError: String(mediaStats.lastError || '').slice(0, 160),
          counts: cleanCounts(mediaStats.counts),
          previousCounts: cleanCounts(mediaStats.previousCounts),
          delta24h: cleanDeltaCounts(mediaStats.delta24h),
          todayCounts: cleanCounts(mediaStats.todayCounts),
          yesterdayCounts: cleanCounts(mediaStats.yesterdayCounts),
          dailyDelta: cleanDeltaCounts(mediaStats.dailyDelta),
          dailyKey: String(mediaStats.dailyKey || '')
      };
      if (!clean.dailyDelta && clean.counts && clean.previousCounts) {
          clean.dailyDelta = {
              movie: clean.counts.movie - clean.previousCounts.movie,
              series: clean.counts.series - clean.previousCounts.series,
              episode: clean.counts.episode - clean.previousCounts.episode,
              time: clean.counts.time
          };
      }
      if (!clean.todayCounts && clean.counts) clean.todayCounts = clean.counts;
      if (!clean.yesterdayCounts && clean.previousCounts) clean.yesterdayCounts = clean.previousCounts;
      if (!clean.dailyKey && clean.counts && clean.counts.time) clean.dailyKey = this.getShanghaiDayKey(clean.counts.time);
      return clean;
  },

  updateOfflineNotifyState(server, previousStatus, checkedAt) {
      if (server.status === 'offline') {
          const wasOffline = previousStatus === 'offline';
          const previousOfflineSince = Number.isFinite(Number(server.offlineSince)) ? Number(server.offlineSince) : 0;
          const previousAlertSentAt = Number.isFinite(Number(server.offlineAlertSentAt)) ? Number(server.offlineAlertSentAt) : 0;
          server.offlineSince = wasOffline && previousOfflineSince > 0 ? previousOfflineSince : checkedAt;
          server.offlineAlertSentAt = wasOffline ? Math.max(0, previousAlertSentAt) : 0;
          return server;
      }
      if (server.status === 'online') {
          server.offlineSince = 0;
          server.offlineAlertSentAt = 0;
      }
      return server;
  },

  shouldSendOfflineAlert(server) {
      if (server.status !== 'offline') return false;
      if (!server.offlineSince || server.offlineAlertSentAt) return false;
      return server.lastCheck - server.offlineSince >= this.OFFLINE_NOTIFY_DELAY_MS;
  },

  extractIcons(input) {
      const icons = {};
      const imagePattern = /\.(png|jpe?g|webp|gif|svg|ico)$/i;
      const imageLikeHostPattern = /(icon|logo|image|img|avatar|favicon|cdn|githubusercontent|jsdelivr|cloudinary|alicdn|qlogo|hdslb)/i;
      const usedUrls = new Set();
      const makeUniqueKey = (key) => {
          const base = String(key || '图标')
              .replace(/\.(png|jpe?g|webp|gif|svg|ico)$/i, '')
              .replace(/[?#].*$/, '')
              .trim()
              .slice(0, 80) || '图标';
          let finalKey = base;
          let count = 2;
          while (Object.prototype.hasOwnProperty.call(icons, finalKey)) {
              finalKey = base.slice(0, 72) + '_' + count;
              count += 1;
          }
          return finalKey;
      };
      const isImageLikeUrl = (iconUrl, key) => {
          const pathname = iconUrl.pathname.toLowerCase();
          const search = iconUrl.search.toLowerCase();
          const keyText = String(key || '').toLowerCase();
          if (imagePattern.test(pathname)) return true;
          if (/(format|type|ext|mime|content-type)=.*(png|jpg|jpeg|webp|gif|svg|ico)/i.test(search)) return true;
          if (/(icon|logo|image|img|avatar|favicon|src|url|href)/i.test(keyText)) return true;
          if (imageLikeHostPattern.test(iconUrl.hostname + pathname)) return true;
          return false;
      };
      const addIcon = (key, value) => {
          if (typeof value !== 'string') return;
          const iconUrl = this.parsePublicHttpUrl(value);
          if (!iconUrl) return;
          const urlText = iconUrl.toString();
          if (usedUrls.has(urlText)) return;
          if (!isImageLikeUrl(iconUrl, key)) return;
          usedUrls.add(urlText);
          const fallbackName = decodeURIComponent(iconUrl.pathname.split('/').filter(Boolean).pop() || '图标_' + (Object.keys(icons).length + 1));
          icons[makeUniqueKey(key || fallbackName)] = urlText;
      };

      const walk = (value, keyHint = '') => {
          if (typeof value === 'string') {
              addIcon(keyHint, value);
              return;
          }
          if (Array.isArray(value)) {
              value.forEach((item, index) => walk(item, keyHint || ('图标_' + (index + 1))));
              return;
          }
          if (value && typeof value === 'object') {
              const nameHint = value.name || value.title || value.label || value.key || value.id || keyHint;
              for (const [key, child] of Object.entries(value)) {
                  const lowerKey = key.toLowerCase();
                  const nextHint = ['url', 'src', 'href', 'icon', 'logo', 'image', 'img', 'avatar', 'favicon'].includes(lowerKey) ? nameHint : key;
                  walk(child, nextHint);
              }
          }
      };

      walk(input);
      return icons;
  },

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
          if (
              host === 'localhost' ||
              host.endsWith('.localhost') ||
              host === 'metadata.google.internal' ||
              host.startsWith('127.') ||
              host.startsWith('10.') ||
              host.startsWith('192.168.') ||
              /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
              host === '0.0.0.0' ||
              host === '::1' ||
              host.startsWith('169.254.')
          ) return null;
          parsed.hash = '';
          return parsed;
      } catch(e) {
          return null;
      }
  },

  buildEmbyAuthHeader(server) {
      const media = server.mediaStats || {};
      return 'MediaBrowser Client="Forward", Device="Forward", DeviceId="' + (media.deviceId || server.id || 'forward') + '", Version="1.0.0"';
  },

  buildEmbyClientHeaders(server, token = '') {
      const media = server.mediaStats || {};
      const deviceId = media.deviceId || server.id || 'forward';
      const authHeader = this.buildEmbyAuthHeader(server);
      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'X-Emby-Authorization': authHeader,
          'X-Emby-Client': 'Forward',
          'X-Emby-Device-Name': 'Forward',
          'X-Emby-Device-Id': String(deviceId),
          'X-Emby-Client-Version': '1.0.0',
          'User-Agent': 'Forward/1.0.0'
      };
      if (token) headers['X-Emby-Token'] = token;
      return headers;
  },

  async readShortResponse(response) {
      try {
          return (await response.text()).slice(0, 160);
      } catch(e) {
          return '';
      }
  },

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
              const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', {
                  method: 'POST',
                  headers: this.buildEmbyClientHeaders(server),
                  body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' })
              }, 8000);
              if (!response.ok) {
                  const detail = await this.readShortResponse(response);
                  lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                  continue;
              }
              const data = await response.json();
              if (data.AccessToken) return data.AccessToken;
              lastError = '未获取到媒体库 Token';
          } catch(e) {
              lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败');
          }
      }
      throw new Error(lastError);
  },

  async fetchEmbyMediaCounts(server, token) {
      const bases = this.getEmbyApiBases(server);
      let lastError = '资源统计失败';
      for (const base of bases) {
          try {
              const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), {
                  method: 'GET',
                  headers: this.buildEmbyClientHeaders(server, token)
              }, 8000);
              if (!response.ok) {
                  const detail = await this.readShortResponse(response);
                  lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                  continue;
              }
              const data = await response.json();
              return {
                  movie: Number(data.MovieCount || 0),
                  series: Number(data.SeriesCount || 0),
                  episode: Number(data.EpisodeCount || 0),
                  time: Date.now()
              };
          } catch(e) {
              lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败');
          }
      }
      throw new Error(lastError);
  },

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
          if (media.dailyKey === yesterdayKey && todayCounts) {
              yesterdayCounts = todayCounts;
          } else if (!yesterdayCounts && media.counts) {
              yesterdayCounts = media.counts;
          }
          todayCounts = countsWithTime;
      } else if (!todayCounts) {
          todayCounts = countsWithTime;
      }

      if (this.isShanghaiMidnightWindow(now)) {
          todayCounts = countsWithTime;
      }

      const baseline = yesterdayCounts || media.previousCounts || null;
      const dailyDelta = baseline ? {
          movie: countsWithTime.movie - baseline.movie,
          series: countsWithTime.series - baseline.series,
          episode: countsWithTime.episode - baseline.episode,
          time: countsWithTime.time
      } : { movie: 0, series: 0, episode: 0, time: countsWithTime.time };

      return {
          todayCounts,
          yesterdayCounts,
          dailyDelta,
          dailyKey: todayKey
      };
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
      try {
          return await fetch(url, { ...options, signal: c.signal });
      } finally {
          clearTimeout(t);
      }
  },

  async probeEmbyServer(server, targetUrl) {
      const loginProbe = await this.verifyWithLoginState(server);
      if (loginProbe && loginProbe.ok) return loginProbe;

      const headers = {
          'Accept': 'application/json,text/plain,*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
      };
      const paths = [
          '/emby/System/Info/Public',
          '/System/Info/Public',
          '/emby/Users/Public',
          '/emby/web/index.html',
          '/web/index.html'
      ];
      const start = Date.now();
      for (const path of paths) {
          try {
              const r = await this.fetchWithTimeout(targetUrl + path, { method: 'GET', headers }, 5000);
              if (r.status >= 200 && r.status < 400) return { ok: true, latency: Date.now() - start };
              if (r.status === 401 || r.status === 403) return { ok: true, latency: Date.now() - start };
          } catch(e) {}
      }
      if (loginProbe && loginProbe.ok === false) return loginProbe;
      return { ok: false, latency: 0 };
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
          let counts;
          try {
              if (!token) token = await this.loginEmbyForMedia(server);
              counts = await this.fetchEmbyMediaCounts(server, token);
          } catch(e) {
              token = await this.loginEmbyForMedia(server);
              counts = await this.fetchEmbyMediaCounts(server, token);
          }
          const dailyStats = this.buildDailyMediaStats(media, counts, now);
          const previous = dailyStats.yesterdayCounts || media.previousCounts || media.counts || null;
          server.mediaStats = {
              ...media,
              accessToken: token,
              previousCounts: previous,
              counts,
              todayCounts: dailyStats.todayCounts,
              yesterdayCounts: dailyStats.yesterdayCounts,
              dailyDelta: dailyStats.dailyDelta,
              dailyKey: dailyStats.dailyKey,
              delta24h: previous ? {
                  movie: counts.movie - previous.movie,
                  series: counts.series - previous.series,
                  episode: counts.episode - previous.episode,
                  time: counts.time
              } : { movie: 0, series: 0, episode: 0, time: counts.time },
              lastCheck: counts.time,
              lastError: ''
          };
      } catch(e) {
          server.mediaStats = {
              ...media,
              lastError: e.message || '媒体库统计失败'
          };
      }
      return server;
  },

  async runProbeLogic(env, config) {
      if (!config || !config.servers || config.servers.length === 0) return config;

      const probePromises = config.servers.map(async (s) => {
	          const previousStatus = s.status;
	          s.totalChecks = (s.totalChecks || 0) + 1;
	          s.history = this.normalizeHistory(s.history, s.lastCheck);
	          const checkedAt = Date.now();
	          
	          const target = this.normalizeServerUrl(s.url);
	          if (!target) {
	              s.status = 'offline';
	              s.latency = 0;
	              s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
		              if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
		              s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
		              s.lastCheck = checkedAt;
		              this.updateOfflineNotifyState(s, previousStatus, checkedAt);
		              await this.refreshMediaStatsIfNeeded(s, !s.mediaStats || !s.mediaStats.lastCheck);
		              s.previousStatus = previousStatus;
		              return s;
		          }
          const targetUrl = target.toString().replace(/\/$/, '');
          
	          let isAlive = false;
	          let finalLatency = 0;

	          try {
	              const result = await this.probeEmbyServer(s, targetUrl);
	              isAlive = result.ok;
	              finalLatency = result.latency;
	          } catch(e) { isAlive = false; }

	          if (isAlive) {
	              s.successfulChecks = (s.successfulChecks || 0) + 1;
	              s.status = 'online';
	              s.latency = finalLatency;
	              s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
	          } else {
	              s.status = 'offline';
	              s.latency = 0;
	              s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
	          }
	          
		          if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
		          s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
		          s.lastCheck = checkedAt;
		          this.updateOfflineNotifyState(s, previousStatus, checkedAt);
		          await this.refreshMediaStatsIfNeeded(s, !s.mediaStats || !s.mediaStats.lastCheck);
		          s.previousStatus = previousStatus;
		          return s;
	      });

      const probedServers = await Promise.all(probePromises);
      const probedById = new Map(probedServers.map((s) => [s.id, s]));
      const latestConfig = await this.loadConfig(env);
      const latestById = new Map(latestConfig.servers.map((s) => [s.id, s]));
      const notifyMessages = [];
      const sourceConfig = latestConfig;
	      const baseConfig = this.sanitizeConfig({
	          icons: sourceConfig.icons !== undefined ? sourceConfig.icons : latestConfig.icons,
	          telegram: sourceConfig.telegram !== undefined ? sourceConfig.telegram : latestConfig.telegram,
	          servers: sourceConfig.servers,
	          updatedAt: sourceConfig.updatedAt || latestConfig.updatedAt || 0
	      });
	      const mergedConfig = {
	          icons: baseConfig.icons,
	          telegram: baseConfig.telegram,
	          updatedAt: Math.max(baseConfig.updatedAt || 0, latestConfig.updatedAt || 0),
	          servers: baseConfig.servers.map((latest) => {
              const probed = probedById.get(latest.id);
              if (!probed || probed.url !== latest.url) return latest;
              const previouslySaved = latestById.get(latest.id) || latest;
	              const mergedServer = {
                  ...latest,
                  status: probed.status,
                  totalChecks: probed.totalChecks,
                  successfulChecks: probed.successfulChecks,
                  uptime: probed.uptime,
	                  latency: probed.latency,
	                  lastCheck: probed.lastCheck,
	                  offlineSince: probed.offlineSince,
	                  offlineAlertSentAt: probed.offlineAlertSentAt,
	                  history: probed.history,
	                  mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats
		              };
	              const oldStatus = previouslySaved.url === latest.url ? previouslySaved.status : probed.previousStatus;
	              if (
	                  this.isTelegramEnabled(env, baseConfig) &&
	                  oldStatus === 'offline' &&
	                  mergedServer.status === 'offline' &&
	                  this.shouldSendOfflineAlert(mergedServer)
              ) {
                  notifyMessages.push(this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status));
                  mergedServer.offlineAlertSentAt = mergedServer.lastCheck;
              } else if (
	                  this.isTelegramEnabled(env, baseConfig) &&
	                  oldStatus === 'offline' &&
	                  mergedServer.status === 'online' &&
	                  previouslySaved.offlineAlertSentAt
              ) {
                  notifyMessages.push(this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status));
              }
              return mergedServer;
          })
      };
      await this.saveConfig(env, mergedConfig);
      await Promise.all(notifyMessages.map((message) => this.sendTelegram(env, message, baseConfig)));
      return mergedConfig;
  }
};
