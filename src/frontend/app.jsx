/*
 * 前端主应用。
 *
 * 负责管理后台页面状态、服务器配置表单、媒体库配置、公开分享、图标库、更新检查和 React 挂载。
 * 第一轮拆分保持原 App 逻辑不变；后续新增前端功能通常先从这里定位入口。
 */
const App = () => {
    const [servers, setServers] = useState([]);
    const [iconLib, setIconLib] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSavingServer, setIsSavingServer] = useState(false);
    const [editingServerId, setEditingServerId] = useState(null);
    const [iconModalTarget, setIconModalTarget] = useState(null);
    const [shareModalTarget, setShareModalTarget] = useState(null);
    const [iconInput, setIconInput] = useState('');
    const [iconSearch, setIconSearch] = useState('');
    const [privacyMode, setPrivacyMode] = useState(() => {
        const savedMode = localStorage.getItem('privacy_mode');
        if (['none', 'url', 'all'].includes(savedMode)) return savedMode;
        return localStorage.getItem('hide_server_meta') === '1' ? 'all' : 'none';
    });
    const [showLastPlayed, setShowLastPlayed] = useState(() => localStorage.getItem('show_last_played') !== '0');
    const [isPrivacyMenuOpen, setIsPrivacyMenuOpen] = useState(false);
    const [availabilityRange, setAvailabilityRange] = useState(() => localStorage.getItem('availability_range') === 'week' ? 'week' : 'day');

    // 搜索与过滤
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [availabilitySort, setAvailabilitySort] = useState(() => localStorage.getItem('availability_sort') || 'none');

    const [addForm, setAddForm] = useState({ name: '', protocol: 'https://', host: '', port: '443' });
    const [fallbackUrls, setFallbackUrls] = useState([]);
    const [mediaForm, setMediaForm] = useState({ enabled: false, username: '', password: '' });
    const [keepAliveForm, setKeepAliveForm] = useState({ enabled: false, periodDays: '', alertDays: '' });
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
    const [accessDenied, setAccessDenied] = useState('');
    const [publicShareLink, setPublicShareLink] = useState('');
    const [publicShareExpiresAt, setPublicShareExpiresAt] = useState(0);
    const [isGeneratingPublicShare, setIsGeneratingPublicShare] = useState(false);
    const [publicShareIncludeProfile, setPublicShareIncludeProfile] = useState(false);
    const [publicShareLifetime, setPublicShareLifetime] = useState('hour');
    const [publicShareHideCounts, setPublicShareHideCounts] = useState(false);
    const [deletingPublicShareToken, setDeletingPublicShareToken] = useState('');
    const [publicShareStats, setPublicShareStats] = useState([]);
    const [isLoadingPublicShareStats, setIsLoadingPublicShareStats] = useState(false);
    const [cardShareLinks, setCardShareLinks] = useState({});
    const [generatingCardShareId, setGeneratingCardShareId] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const privacyMenuRef = useRef(null);
    const keepAliveSectionRef = useRef(null);
    const configRevisionRef = useRef('');
    const configUpdatedAtRef = useRef(0);

    // API 调用封装
    const apiFetch = async (path, options = {}) => {
        const headers = { ...(options.headers || {}) };
        const adminToken = localStorage.getItem('emby_admin_token') || '';
        if (adminToken) headers.Authorization = 'Bearer ' + adminToken;
        return fetch(path, { ...options, headers });
    };

    const fetchConfigData = async (options = {}) => {
        try {
            const res = await apiFetch('/api/config', { cache: 'no-store' });
            if (res.status === 401 || res.status === 403) {
                if (options.silentAuth) return;
                const errorData = await res.json().catch(() => ({}));
                if (errorData.error === 'ADMIN_TOKEN_REQUIRED') {
                    setAccessDenied('未配置 ADMIN_TOKEN，后台已被锁定。请先在 Cloudflare Worker 环境变量中设置 ADMIN_TOKEN。');
                    setIsLoading(false);
                    return;
                }
                const token = prompt('请输入管理 Token');
                if (token) {
                    localStorage.setItem('emby_admin_token', token);
                    return fetchConfigData(options);
                }
                setAccessDenied('未提供管理 Token，已阻止进入后台。');
                setIsLoading(false);
                return;
            }
            const data = await res.json();
            setServers(Array.isArray(data.servers) ? data.servers : []);
            const nextUpdatedAt = Number(data.updatedAt) || 0;
            const nextRevision = data.revision || '';
            setConfigUpdatedAt(nextUpdatedAt);
            setConfigRevision(nextRevision);
            configUpdatedAtRef.current = nextUpdatedAt;
            configRevisionRef.current = nextRevision;
            setNotifyEnabled(Boolean(data.notifyEnabled));
            setTelegramForm(data.telegram || { enabled: false, botToken: '', chatId: '' });
            if (data.icons) {
                setIconLib(data.icons);
                setIconInput(localStorage.getItem('last_icon_input') || "");
            }
            if (!options.skipUpdateCheck) checkForUpdate(false);
        } catch(e) { console.error("读取配置失败", e); }
    };

    useEffect(() => { fetchConfigData().finally(() => setIsLoading(false)); }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchConfigData({ skipUpdateCheck: true, silentAuth: true });
            }
        }, 60 * 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => { configRevisionRef.current = configRevision; }, [configRevision]);
    useEffect(() => { configUpdatedAtRef.current = configUpdatedAt; }, [configUpdatedAt]);
    useEffect(() => { if (iconModalTarget) setIconSearch(''); }, [iconModalTarget]);
    useEffect(() => {
        localStorage.setItem('privacy_mode', privacyMode);
        localStorage.setItem('hide_server_meta', privacyMode === 'all' ? '1' : '0');
    }, [privacyMode]);
    useEffect(() => { localStorage.setItem('show_last_played', showLastPlayed ? '1' : '0'); }, [showLastPlayed]);
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(''), 1800);
        return () => clearTimeout(timer);
    }, [toastMessage]);
    useEffect(() => {
        if (shareModalTarget === 'public') fetchPublicShareStats();
    }, [shareModalTarget]);
    useEffect(() => {
        const onPointerDown = (event) => {
            if (!isPrivacyMenuOpen) return;
            if (event.target && event.target.closest && event.target.closest('[data-privacy-dialog="true"]')) return;
            if (privacyMenuRef.current && !privacyMenuRef.current.contains(event.target)) setIsPrivacyMenuOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setIsPrivacyMenuOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isPrivacyMenuOpen]);
    useEffect(() => { localStorage.setItem('availability_range', availabilityRange); }, [availabilityRange]);
    useEffect(() => { localStorage.setItem('availability_sort', availabilitySort); }, [availabilitySort]);

    const syncToCloud = async (newServers, newIcons, nextTelegram = telegramForm, options = {}) => {
        const serverById = new Map(servers.map(s => [s.id, s]));
        const mergedServers = newServers.map((server) => {
            const existing = serverById.get(server.id);
            if (existing && existing.mediaStats && !server.mediaStats) return { ...server, mediaStats: existing.mediaStats };
            return server;
        });
        const saveConfig = async (serversToSave, iconsToSave, telegramToSave, baseRevision) => {
            const nextUpdatedAt = Date.now();
            setConfigUpdatedAt(nextUpdatedAt);
            configUpdatedAtRef.current = nextUpdatedAt;
            const res = await apiFetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ servers: serversToSave, icons: iconsToSave, telegram: telegramToSave, updatedAt: nextUpdatedAt, baseRevision }) });
            const saveResult = await res.json().catch(() => ({}));
            return { res, saveResult, nextUpdatedAt };
        };
        setServers(mergedServers);
        setIconLib(newIcons || {});
        setTelegramForm(nextTelegram);
        let { res, saveResult, nextUpdatedAt } = await saveConfig(mergedServers, newIcons, nextTelegram, configRevisionRef.current);
        if (!res.ok && res.status === 409 && options.addServerOnConflict) {
            const latestRes = await apiFetch('/api/config');
            if (!latestRes.ok) throw new Error('配置已被其它页面修改，请刷新后再保存');
            const latestConfig = await latestRes.json();
            const latestServers = Array.isArray(latestConfig.servers) ? latestConfig.servers : [];
            const retryServers = latestServers.some(server => server.id === options.addServerOnConflict.id) ? latestServers : [...latestServers, options.addServerOnConflict];
            const retryIcons = latestConfig.icons || {};
            const retryTelegram = latestConfig.telegram || nextTelegram;
            const latestUpdatedAt = Number(latestConfig.updatedAt) || configUpdatedAtRef.current;
            const latestRevision = latestConfig.revision || '';
            setConfigUpdatedAt(latestUpdatedAt);
            setConfigRevision(latestRevision);
            configUpdatedAtRef.current = latestUpdatedAt;
            configRevisionRef.current = latestRevision;
            setServers(retryServers);
            setIconLib(retryIcons);
            setTelegramForm(retryTelegram);
            ({ res, saveResult, nextUpdatedAt } = await saveConfig(retryServers, retryIcons, retryTelegram, latestRevision));
        }
        if (!res.ok) {
            if (res.status === 409) {
                await fetchConfigData();
                throw new Error('配置已被其它页面修改，请检查最新配置后重新保存');
            }
            throw new Error('配置保存失败');
        }
        const nextRevision = saveResult.revision || '';
        setConfigRevision(nextRevision);
        configRevisionRef.current = nextRevision;
        return nextUpdatedAt;
    };

    const manualPing = async (currentServers = servers, requestUpdatedAt = configUpdatedAt, options = {}) => {
        if (isRefreshing || !currentServers.length) return;
        setIsRefreshing(true);
        try {
            let cursor = 0;
            let updatedData = null;
            const batchSize = 4;
            do {
                const pendingIds = new Set(
                    currentServers.slice(cursor, options.forceMedia ? cursor + batchSize : currentServers.length).map((server) => server.id)
                );
                if (pendingIds.size) {
                    setServers((current) => current.map((server) => pendingIds.has(server.id) ? { ...server, status: 'updating', latency: 0 } : server));
                }
                const res = await apiFetch('/api/ping-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ forceMedia: Boolean(options.forceMedia), cursor }) });
                if (!res.ok) throw new Error('测速接口异常');
                updatedData = await res.json();
                const futureIds = new Set(
                    options.forceMedia && updatedData.hasMore
                        ? currentServers.slice(Number(updatedData.nextCursor) || 0).map((server) => server.id)
                        : []
                );
                setServers(Array.isArray(updatedData.servers)
                    ? updatedData.servers.map((server) => futureIds.has(server.id) ? { ...server, status: 'updating', latency: 0 } : server)
                    : []
                );
                setIconLib(updatedData.icons);
                setTelegramForm(updatedData.telegram || telegramForm);
                const nextUpdatedAt = Number(updatedData.updatedAt) || configUpdatedAtRef.current;
                const nextRevision = updatedData.revision || configRevisionRef.current;
                setConfigUpdatedAt(nextUpdatedAt);
                setConfigRevision(nextRevision);
                configUpdatedAtRef.current = nextUpdatedAt;
                configRevisionRef.current = nextRevision;
                setNotifyEnabled(Boolean(updatedData.notifyEnabled));
                cursor = updatedData.nextCursor || 0;
            } while (updatedData && updatedData.hasMore);
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

    const getSafeIconLib = () => (typeof iconLib === 'object' && iconLib !== null && !Array.isArray(iconLib)) ? iconLib : {};
    const getShareBaseUrl = () => window.location.origin;
    const getPublicUrl = () => publicShareLink || (getShareBaseUrl() + '/public');
    const formatStatTime = (value) => {
        const time = Number(value) || 0;
        return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '--';
    };
    const formatShareExpires = (value) => {
        const time = Number(value) || 0;
        return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '永久有效';
    };
    const formatLastPlayedText = (server) => {
        const lastPlayed = server && server.mediaStats ? server.mediaStats.lastPlayed : null;
        const lastPlayedAt = Number(lastPlayed && lastPlayed.lastPlayedAt) || 0;
        if (!lastPlayedAt) return '';
        const playedText = new Date(lastPlayedAt).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return '上次观看 ' + playedText;
    };
    const copyText = async (text, label = '内容') => {
        try {
            await navigator.clipboard.writeText(text);
            setToastMessage(label + '已复制');
        } catch(e) {
            window.prompt('复制 ' + label, text);
        }
    };
    const normalizeTextForMatch = (value) => String(value || '').normalize('NFKC').toLowerCase();
    const getDisplayIcon = (server) => {
        if (server.customIcon) return server.customIcon;
        if (!server.name) return null;
        const n = normalizeTextForMatch(server.name);
        const safeIcons = getSafeIconLib();
        for (let k in safeIcons) { if (n.includes(normalizeTextForMatch(k))) return safeIcons[k]; }
        return null;
    };

    const generatePublicShareLink = async () => {
        setIsGeneratingPublicShare(true);
        try {
            const res = await apiFetch('/api/public/share-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ includeTelegramProfile: publicShareIncludeProfile, lifetime: publicShareLifetime, hideCounts: publicShareHideCounts })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成公开链接失败');
            setPublicShareLink(data.url);
            setPublicShareExpiresAt(Number(data.expiresAt) || 0);
            await fetchPublicShareStats();
        } catch(e) {
            alert(e.message || '生成公开链接失败');
        } finally {
            setIsGeneratingPublicShare(false);
        }
    };

    const deletePublicShareLink = async (token) => {
        if (!token) return;
        if (!window.confirm('删除这个公开页链接？删除后访问会立即失效。')) return;
        setDeletingPublicShareToken(token);
        try {
            const res = await apiFetch('/api/public/share-token/' + encodeURIComponent(token), { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || '删除公开链接失败');
            setPublicShareStats((items) => items.filter((item) => item.token !== token));
            if (publicShareLink && publicShareLink.endsWith('/public/' + token)) {
                setPublicShareLink('');
                setPublicShareExpiresAt(0);
            }
        } catch(e) {
            alert(e.message || '删除公开链接失败');
        } finally {
            setDeletingPublicShareToken('');
        }
    };

    const fetchPublicShareStats = async () => {
        setIsLoadingPublicShareStats(true);
        try {
            const res = await apiFetch('/api/public/share-stats');
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || '读取公开页统计失败');
            setPublicShareStats(data.items);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoadingPublicShareStats(false);
        }
    };

    const generateCardShareLink = async (serverId) => {
        setGeneratingCardShareId(serverId);
        try {
            const res = await apiFetch('/api/card/share-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serverId }) });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成卡片图片失败');
            setCardShareLinks((current) => ({ ...current, [serverId]: { url: data.url, expiresAt: Number(data.expiresAt) || 0 } }));
        } catch(e) {
            alert(e.message || '生成卡片图片失败');
        } finally {
            setGeneratingCardShareId(null);
        }
    };

    const getHistoryStatus = (item) => {
        if (typeof item === 'number') return item ? 'online' : 'offline';
        if (item && typeof item === 'object') return item.status === 'online' ? 'online' : 'offline';
        return 'unknown';
    };

    const getAvailabilityStats = (server, range = availabilityRange) => {
        const now = Date.now();
        const rangeMs = range === 'week' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const history = Array.isArray(server.history) ? server.history.filter(item => item && typeof item === 'object' && item.time && item.time >= now - rangeMs) : [];
        const valid = history.filter(item => getHistoryStatus(item) !== 'unknown');
        const online = valid.filter(item => getHistoryStatus(item) === 'online').length;
        const offline = valid.reduce((count, item, index) => {
            if (getHistoryStatus(item) !== 'offline') return count;
            const previous = valid[index - 1];
            return !previous || getHistoryStatus(previous) !== 'offline' ? count + 1 : count;
        }, 0);
        return {
            total: valid.length,
            online,
            offline,
            uptime: valid.length ? ((online / valid.length) * 100).toFixed(1) : '---'
        };
    };
    const getKeepAliveButtonState = (server) => {
        const keepAlive = server && server.mediaStats ? server.mediaStats.keepAlive : null;
        if (!keepAlive || !keepAlive.enabled) {
            return { text: '保号', className: 'bg-slate-100 text-slate-500 hover:bg-slate-200' };
        }
        const periodDays = Math.max(1, Number(keepAlive.periodDays) || 30);
        const lastPlayedAt = Number(keepAlive.lastPlayedAt) || 0;
        if (!lastPlayedAt) {
            return { text: '保号', className: 'bg-amber-50 text-amber-600 hover:bg-amber-100' };
        }
        const inactiveDays = Math.max(0, Math.floor((Date.now() - lastPlayedAt) / (24 * 60 * 60 * 1000)));
        const remainingDays = periodDays - inactiveDays;
        if (remainingDays < 0) return { text: '!逾期', className: 'bg-rose-50 text-rose-600 hover:bg-rose-100' };
        if (remainingDays <= 3) return { text: '!' + remainingDays + '天', className: 'bg-orange-50 text-orange-600 hover:bg-orange-100' };
        return { text: remainingDays + '天', className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' };
    };
    const stripProtocol = (value) => {
        const text = String(value || '');
        const lower = text.toLowerCase();
        if (lower.startsWith('http://')) return text.slice(7);
        if (lower.startsWith('https://')) return text.slice(8);
        return text;
    };
    const cleanPortInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').slice(0, 5);
    const cleanPositiveIntInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').replace(/^0+/, '').slice(0, 4);

    const resetServerForm = () => {
        setAddForm({ name: '', protocol: 'https://', host: '', port: '443' });
        setFallbackUrls([]);
        setMediaForm({ enabled: false, username: '', password: '' });
        setKeepAliveForm({ enabled: false, periodDays: '', alertDays: '' });
        setQuickImportText('');
        setEditingServerId(null);
    };

    const splitServerUrl = (value) => {
        let raw = String(value || '').trim();
        const lowerRaw = raw.toLowerCase();
        if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;
        try {
            const parsed = new URL(raw);
            return { protocol: parsed.protocol === 'http:' ? 'http://' : 'https://', host: parsed.hostname, port: parsed.port || (parsed.protocol === 'http:' ? '80' : '443') };
        } catch(e) {
            return { protocol: 'https://', host: value || '', port: '443' };
        }
    };

    const updateHostFromInput = (value) => {
        const parsed = splitServerUrl(value);
        setAddForm({...addForm, protocol: parsed.protocol, host: parsed.host, port: parsed.port});
    };

    const normalizeFallbackUrlInput = (value) => {
        let raw = String(value || '').trim();
        if (!raw) return '';
        const lowerRaw = raw.toLowerCase();
        if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;
        try {
            const parsed = new URL(raw);
            parsed.hash = '';
            const normalized = parsed.toString();
            return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
        } catch(e) {
            return raw.endsWith('/') ? raw.slice(0, -1) : raw;
        }
    };

    const normalizeFallbackUrlsForSave = (mainUrl) => {
        const seen = new Set([String(mainUrl || '').toLowerCase()]);
        const clean = [];
        for (const value of fallbackUrls) {
            const normalized = normalizeFallbackUrlInput(value);
            const key = normalized.toLowerCase();
            if (!normalized || seen.has(key)) continue;
            seen.add(key);
            clean.push(normalized);
            if (clean.length >= 4) break;
        }
        return clean;
    };

    const updateFallbackUrl = (index, value) => {
        setFallbackUrls((current) => current.map((item, i) => i === index ? value : item));
    };

    const addFallbackUrl = () => {
        setFallbackUrls((current) => current.length >= 4 ? current : current.concat(''));
    };

    const removeFallbackUrl = (index) => {
        setFallbackUrls((current) => current.filter((_, i) => i !== index));
    };

    const extractFieldFromText = (lines, labels, skipPattern) => {
        const labelPattern = labels.join('|');
        const directPattern = new RegExp('^(?:' + labelPattern + ')\\\\s*(?:[|:：=\\\\-]+)?\\\\s*(.+)$', 'i');
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
        const lines = text.split(/\r?\n/);
        const urlMatch = text.match(/https?:\/\/[^\s"'<>，。；、）)】]+/i);
        const rawUrl = urlMatch ? urlMatch[0].replace(/[.,;，。；]+$/, '') : '';
        return {
            username: extractFieldFromText(lines, ['用户名称', '用户名', '账号', '账户', 'user name', 'username', 'user'], /安全密码|到期|线路|服务器/i),
            password: extractFieldFromText(lines, ['用户密码', '登录密码', '密码', 'password', 'pass'], /安全密码|安全码|pin|到期|线路|服务器/i),
            url: rawUrl
        };
    };

    const applyQuickImportText = () => {
        const value = quickImportText.trim();
        if (!value) return alert('请先粘贴包含服务器、用户名或密码的信息');
        const parsed = parseQuickImportText(value);
        const hasRecognizedField = Boolean(parsed.url || parsed.username || parsed.password);
        if (!hasRecognizedField) return alert('没有识别到服务器地址、用户名或密码');
        if (parsed.url) {
            const parsedUrl = splitServerUrl(parsed.url);
            setAddForm((current) => ({ ...current, name: current.name || parsed.username || parsedUrl.host, protocol: parsedUrl.protocol, host: parsedUrl.host, port: parsedUrl.port }));
        } else if (parsed.username) {
            setAddForm((current) => ({ ...current, name: current.name || parsed.username }));
        }
        if (parsed.username || parsed.password) {
            setMediaForm((current) => ({ ...current, enabled: true, username: parsed.username || current.username, password: parsed.password || current.password }));
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

    const openAddServerModal = () => { resetServerForm(); setIsAddModalOpen(true); };
    const openEditServerModal = (server, focusKeepAlive = false) => {
        const parsed = splitServerUrl(server.url || '');
        const keepAlive = server.mediaStats && server.mediaStats.keepAlive ? server.mediaStats.keepAlive : {};
        setEditingServerId(server.id);
        setAddForm({ name: server.name || '', protocol: parsed.protocol, host: parsed.host, port: parsed.port });
        setFallbackUrls(Array.isArray(server.fallbackUrls) ? server.fallbackUrls.slice(0, 4) : []);
        setMediaForm({
            enabled: Boolean(server.mediaStats && server.mediaStats.enabled),
            username: server.mediaStats ? server.mediaStats.username || '' : '',
            password: server.mediaStats ? server.mediaStats.password || '' : ''
        });
        setKeepAliveForm({
            enabled: Boolean(keepAlive.enabled),
            periodDays: keepAlive.enabled && keepAlive.periodDays ? String(keepAlive.periodDays) : '',
            alertDays: keepAlive.enabled && keepAlive.alertDays ? String(keepAlive.alertDays) : ''
        });
        setIsAddModalOpen(true);
        if (focusKeepAlive) {
            setTimeout(() => {
                if (keepAliveSectionRef.current) keepAliveSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 80);
        }
    };

    const handleSaveServer = async () => {
        if(!addForm.name || !addForm.host) return alert("请填写名称和地址");
        if (isSavingServer || isRefreshing) return;
        setIsSavingServer(true);
        try {
        let finalUrl = buildServerUrlFromForm();
        if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);
        const cleanFallbackUrls = normalizeFallbackUrlsForSave(finalUrl);
        const keepAlivePeriodDays = Number(keepAliveForm.periodDays);
        const keepAliveAlertDays = keepAliveForm.alertDays ? Number(keepAliveForm.alertDays) : Math.max(1, keepAlivePeriodDays - 3);
        if (keepAliveForm.enabled) {
            if (!mediaForm.enabled) throw new Error('开启保号前请先启用媒体库资源统计并填写账号');
            if (!Number.isInteger(keepAlivePeriodDays) || keepAlivePeriodDays <= 1) throw new Error('活跃周期必须是大于 1 的正整数');
            if (!Number.isInteger(keepAliveAlertDays) || keepAliveAlertDays <= 0) throw new Error('提前提醒天数必须是正整数');
            if (keepAliveAlertDays >= keepAlivePeriodDays) throw new Error('提前提醒天数必须小于活跃周期');
        }

        const buildMediaStats = (existing) => {
            const previousMedia = existing && existing.mediaStats ? existing.mediaStats : {};
            const credentialsChanged = previousMedia.username !== mediaForm.username.trim() || previousMedia.password !== mediaForm.password;
            const previousKeepAlive = previousMedia.keepAlive || {};
            return {
                enabled: mediaForm.enabled, username: mediaForm.enabled ? mediaForm.username.trim() : '', password: mediaForm.enabled ? mediaForm.password : '',
                deviceId: previousMedia.deviceId || ('forward-' + Date.now().toString(36)),
                accessToken: mediaForm.enabled && !credentialsChanged ? (previousMedia.accessToken || '') : '',
                userId: mediaForm.enabled && !credentialsChanged ? (previousMedia.userId || '') : '',
                lastCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastCheck || 0) : 0,
                lastError: '', counts: mediaForm.enabled && !credentialsChanged ? (previousMedia.counts || null) : null,
                previousCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.previousCounts || null) : null,
                delta24h: mediaForm.enabled && !credentialsChanged ? (previousMedia.delta24h || null) : null,
                todayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.todayCounts || null) : null,
                yesterdayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.yesterdayCounts || null) : null,
                dailyDelta: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyDelta || null) : null,
                dailyKey: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyKey || '') : '',
                keepAlive: {
                    enabled: Boolean(keepAliveForm.enabled),
                    periodDays: keepAliveForm.enabled ? keepAlivePeriodDays : 30,
                    alertDays: keepAliveForm.enabled ? keepAliveAlertDays : 27,
                    lastPlayedAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.lastPlayedAt || 0) : 0,
                    lastCheckedAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.lastCheckedAt || 0) : 0,
                    alertSentAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.alertSentAt || 0) : 0
                }
            };
        };

        let updatedServers;
        let newServer = null;
        if (editingServerId) {
            updatedServers = servers.map((server) => {
                if (server.id !== editingServerId) return server;
                const previousFallbackUrls = Array.isArray(server.fallbackUrls) ? server.fallbackUrls : [];
                const fallbackChanged = JSON.stringify(previousFallbackUrls) !== JSON.stringify(cleanFallbackUrls);
                const urlChanged = server.url !== finalUrl || fallbackChanged;
                return { ...server, name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, status: urlChanged ? 'updating' : server.status, latency: urlChanged ? 0 : server.latency, mediaStats: buildMediaStats(server) };
            });
        } else {
            newServer = {
                id: Date.now(), name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, customIcon: null, status: 'updating',
                totalChecks: 0, successfulChecks: 0, uptime: "0.0", latency: 0, lastCheck: 0, history: [], mediaStats: buildMediaStats(null)
            };
            updatedServers = [...servers, newServer];
        }

        const savedUpdatedAt = await syncToCloud(updatedServers, iconLib, telegramForm, newServer ? { addServerOnConflict: newServer } : {});
        const serversToPing = newServer ? [...servers.filter(server => server.id !== newServer.id), newServer] : updatedServers;
        setIsAddModalOpen(false); resetServerForm(); setActiveTab('cards');
        await manualPing(serversToPing, savedUpdatedAt, { forceMedia: true });
        } catch(e) {
            console.error('保存服务器失败', e);
            alert(e.message || '服务器保存失败，请稍后重试');
        } finally {
            setIsSavingServer(false);
        }
    };

    const handleSaveTelegram = async () => {
        const nextTelegram = { enabled: Boolean(telegramForm.enabled), botToken: telegramForm.botToken.trim(), chatId: telegramForm.chatId.trim() };
        try {
            setTelegramForm(nextTelegram);
            await syncToCloud(servers, iconLib, nextTelegram);
            setNotifyEnabled(nextTelegram.enabled && nextTelegram.botToken && nextTelegram.chatId);
            alert("Telegram 配置已保存");
        } catch(e) { alert("Telegram 配置保存失败"); }
    };

    const handleSyncIcons = async () => {
        if(!iconInput.includes('http')) return alert("请输入 JSON 链接");
        try {
            const r = await apiFetch("/api/fetch-icons?url=" + encodeURIComponent(iconInput));
            if (!r.ok) throw new Error(await r.text() || '图标库拉取失败');
            const icons = await r.json();
            if (!icons || typeof icons !== 'object' || Array.isArray(icons) || Object.keys(icons).length === 0) throw new Error('没有从该 JSON 中识别到图片链接');
            setIconLib(icons); localStorage.setItem('last_icon_input', iconInput);
            await syncToCloud(servers, icons);
            alert("图标库拉取并提取成功！");
        } catch(e) { alert("解析失败：" + (e.message || "请检查 JSON 链接格式。")); }
    };

    const checkForUpdate = async (showAlert = true) => {
        setIsCheckingUpdate(true);
        try {
            const r = await apiFetch('/api/update/check');
            if (r.status === 401) { if (showAlert) alert('请先输入正确的管理 Token'); return; }
            const data = await r.json();
            setUpdateInfo(data);
            if (showAlert) {
                const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\n\n更新内容：\n' + data.releaseNotes.map(note => '- ' + note).join('\n') : '';
                alert(data.hasUpdate ? ('发现新版本：' + data.latestVersion + notes) : '当前已经是最新版本');
            }
        } catch(e) {
            if (showAlert) alert('检查更新失败：' + (e.message || '网络异常'));
        } finally { setIsCheckingUpdate(false); }
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
            const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\n\n更新内容：\n' + data.releaseNotes.map(note => '- ' + note).join('\n') : '';
            alert('更新完成，页面即将刷新' + notes);
            setTimeout(() => location.reload(), 1200);
        } catch(e) { alert('更新失败：' + (e.message || 'Cloudflare API 调用异常')); } finally { setIsApplyingUpdate(false); }
    };

    if (accessDenied) return <div className="flex items-center justify-center min-h-screen p-6 text-center"><div className="max-w-lg w-full glass-panel bg-white/80 rounded-[2rem] p-8 shadow-2xl border border-white"><div className="text-rose-600 font-black text-lg mb-2">访问被拒绝</div><div className="text-slate-600 text-sm font-semibold whitespace-pre-wrap">{accessDenied}</div></div></div>;
    if (isLoading) return <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold">读取云端配置中...</div>;

    // 动态数据计算
    const onlineCount = servers.filter(s => s.status === 'online').length;
    const offlineCount = servers.filter(s => s.status === 'offline').length;
    const validUptimeServers = servers.filter(s => getAvailabilityStats(s).uptime !== '---');
    const avgUptime = validUptimeServers.length > 0
        ? (validUptimeServers.reduce((acc, s) => acc + parseFloat(getAvailabilityStats(s).uptime), 0) / validUptimeServers.length).toFixed(1)
        : '0.0';
    const notifyLabel = notifyEnabled ? '已开启' : '未开启';
    const hideServerName = privacyMode === 'all';
    const hideServerUrl = privacyMode === 'url' || privacyMode === 'all';
    const privacyLabel = privacyMode === 'all' ? '全部隐藏' : privacyMode === 'url' ? '隐藏地址' : '正常显示';
    const privacyOptions = [
        { mode: 'none', label: '正常显示', desc: '显示名称和地址' },
        { mode: 'url', label: '只隐藏地址', desc: '保留名称和图标' },
        { mode: 'all', label: '全部隐藏', desc: '隐藏名称、地址和图标' }
    ];

    const safeIconEntries = Object.entries(getSafeIconLib());
    const iconSearchTerm = normalizeTextForMatch(iconSearch.trim());
    const filteredIconEntries = iconSearchTerm
        ? safeIconEntries.filter(([key, url]) => normalizeTextForMatch(key + ' ' + url).includes(iconSearchTerm))
        : safeIconEntries;

    const normalizedSearchQuery = normalizeTextForMatch(searchQuery);
    const baseFilteredServers = servers.filter(s => {
        const matchSearch = normalizeTextForMatch(s.name).includes(normalizedSearchQuery) || normalizeTextForMatch(s.url).includes(normalizedSearchQuery);
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchSearch && matchStatus;
    });
    const getAvailabilityScore = (server) => {
        const uptime = getAvailabilityStats(server).uptime;
        return uptime === '---' ? null : parseFloat(uptime);
    };
    const sortServers = (list) => {
        const rank = { offline: 0, updating: 1, unknown: 2, online: 3 };
        return [...list].sort((a, b) => {
            if (availabilitySort === 'asc' || availabilitySort === 'desc') {
                const aScore = getAvailabilityScore(a);
                const bScore = getAvailabilityScore(b);
                const aVal = aScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : aScore;
                const bVal = bScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : bScore;
                if (aVal !== bVal) return availabilitySort === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const aRank = rank[a.status] !== undefined ? rank[a.status] : 2;
            const bRank = rank[b.status] !== undefined ? rank[b.status] : 2;
            const statusDiff = aRank - bRank;
            if (statusDiff !== 0) return statusDiff;
            return (b.latency || 0) - (a.latency || 0);
        });
    };
    const filteredServers = sortServers(baseFilteredServers);
    const sortedServers = filteredServers;
    const availabilitySortArrow = availabilitySort === 'asc' ? '↑' : availabilitySort === 'desc' ? '↓' : '';
    const nextAvailabilitySort = () => setAvailabilitySort(availabilitySort === 'none' ? 'asc' : availabilitySort === 'asc' ? 'desc' : 'none');

    return (
        <div className="app-shell min-h-screen relative overflow-x-hidden">
            {toastMessage && (
                <div className="fixed right-4 bottom-4 z-[70] px-4 py-3 rounded-2xl bg-slate-900/90 text-white text-sm font-bold shadow-2xl border border-white/10 backdrop-blur-md">
                    {toastMessage}
                </div>
            )}
            <div className="bg-canvas" aria-hidden="true">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
                <div className="orb orb-4"></div>
            </div>

            <div className="mobile-page w-full max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12 relative z-10">
                {/* Header */}
                <header className="mobile-header flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="mobile-title-row">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                            <div className="brand-icon-shell w-14 h-14 rounded-[1.1rem] backdrop-blur-sm flex items-center justify-center">
                                <Icons.Cloud className="w-8 h-8 text-sky-500 drop-shadow-sm" />
                            </div>
                            <span className="brand-title">
                                Emby 服务器探针
                            </span>
                        </h1>
                        <p className="mobile-subtitle text-[11px] text-slate-500 font-bold tracking-widest mt-3 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full dot-online"></span>
                            Emby server probe
                        </p>
                    </div>

                    <div className="mobile-actions flex flex-wrap items-center gap-3">
                        {/* 辅助功能组 (Icon-only) */}
                        <div className="mobile-icon-group flex items-center gap-2 mr-2">
                            <div className="relative" ref={privacyMenuRef}>
                                <button
                                    onClick={() => setIsPrivacyMenuOpen(!isPrivacyMenuOpen)}
                                    title={"隐私显示：" + privacyLabel}
                                    className={"w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 " + (privacyMode !== 'none' ? "bg-slate-200 text-slate-700 shadow-inner" : "bg-white/70 text-slate-500 hover:text-slate-800 hover:bg-white")}
                                >
                                    {privacyMode !== 'none' ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                                </button>
                                {isPrivacyMenuOpen && (
                                    <div className="hidden md:block absolute right-0 top-12 z-40 w-44 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-xl p-1.5">
                                        {privacyOptions.map((option) => (
                                            <button
                                                key={option.mode}
                                                onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}
                                                className={"w-full text-left rounded-xl px-3 py-2 transition-all " + (privacyMode === option.mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/60 hover:text-slate-800")}
                                            >
                                                <div className="text-xs font-black">{option.label}</div>
                                                <div className="text-[10px] font-bold opacity-60 mt-0.5">{option.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowLastPlayed(!showLastPlayed)}
                                title={showLastPlayed ? '关闭上次观看' : '显示上次观看'}
                                className={"w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 " + (showLastPlayed ? "bg-white/70 text-blue-600 hover:bg-white" : "bg-slate-200 text-slate-500 shadow-inner")}
                            >
                                {showLastPlayed ? <Icons.Clock className="w-5 h-5" /> : <Icons.ClockOff className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                title="系统设置"
                                className="relative w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm"
                            >
                                <Icons.Settings className="w-5 h-5" />
                                {updateInfo && updateInfo.hasUpdate && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(255,255,255,0.92)]"></span>}
                            </button>
                            <button
                                onClick={() => setShareModalTarget('public')}
                                title="公开页"
                                className="md:hidden w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm"
                            >
                                <Icons.Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 核心操作组 */}
                        <button onClick={() => setShareModalTarget('public')} className="hidden md:flex px-4 py-2.5 h-11 bg-white/70 hover:bg-white text-slate-600 rounded-[14px] text-sm font-bold border border-white shadow-sm transition-all items-center gap-2">
                            <Icons.Share2 className="w-4 h-4" /> 公开页
                        </button>
                        <button onClick={openAddServerModal} disabled={isRefreshing || isSavingServer} className="mobile-primary-btn px-5 py-2.5 h-11 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-[14px] text-sm font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.28)] transition-all flex items-center gap-2">
                            <Icons.Plus className="w-4 h-4" /> 添加服务器
                        </button>
                        <button
                            onClick={() => manualPing(servers, configUpdatedAt, { forceMedia: true })}
                            disabled={isRefreshing}
                            className="mobile-refresh-btn px-4 py-2.5 h-11 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 rounded-[14px] text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            <Icons.RefreshCw className={"w-4 h-4 " + (isRefreshing ? 'animate-spin' : '')} />
                            <span className="inline-flex items-center justify-center tabular-nums">
                                {isRefreshing ? '正在刷新...' : '刷新状态/资源'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Overview Stats */}
                <div className="mobile-stats-strip grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: '在线服务器', value: onlineCount + "/" + servers.length, icon: Icons.CheckCircle2, color: 'text-emerald-500', glow: 'glow-online', cardClass: 'overview-stat-online' },
                        { label: '当前离线', value: offlineCount, icon: Icons.XCircle, color: 'text-rose-500', glow: 'glow-offline', cardClass: 'overview-stat-offline' },
                        { label: (availabilityRange === 'week' ? '7天' : '24H') + ' 可用率', value: avgUptime + "%", icon: Icons.BarChart3, color: 'text-blue-500', glow: 'bg-blue-500/20', cardClass: 'overview-stat-uptime' },
                        { label: '报警通知', value: notifyLabel, icon: Icons.AlertCircle, color: 'text-purple-500', glow: 'bg-purple-500/20', cardClass: 'overview-stat-alert' },
                    ].map((item, idx) => (
                        <div key={idx} className={"mobile-stat-card overview-stat " + item.cardClass + " p-6 rounded-[2rem] flex items-center gap-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform"}>
                            <div className={"absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl " + item.glow}></div>
                            <div className={"stat-icon-shell w-12 h-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center shadow-sm relative z-10 " + item.color}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="relative z-10">
                                <div className="stat-value text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
                                <div className="stat-label text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Bar: View Toggles & Search */}
                <div className="mobile-action-bar flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="mobile-tab-nav tab-nav w-fit">
                        <button onClick={() => setActiveTab('cards')} className={"tab-btn " + (activeTab === 'cards' ? 'active' : '')}>
                            <Icons.LayoutGrid className="w-4 h-4" /> 看板
                        </button>
                        <button onClick={() => setActiveTab('dashboard')} className={"tab-btn " + (activeTab === 'dashboard' ? 'active' : '')}>
                            <Icons.Activity className="w-4 h-4" /> 历史大盘
                        </button>
                    </div>

                    <div className="mobile-controls flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* 时间范围胶囊 (仅看板模式) */}
                        <div className={"mobile-control-row " + (activeTab === 'cards' ? 'has-range' : 'no-range')}>
                            {activeTab === 'cards' && (
                            <div className="mobile-range-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]">
                                <button onClick={() => setAvailabilityRange('day')} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (availabilityRange === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>24H</button>
                                <button onClick={() => setAvailabilityRange('week')} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (availabilityRange === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>7天</button>
                            </div>
                            )}
                        {/* 状态筛选胶囊 */}
                        <div className="mobile-status-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]">
                            {['all', 'online', 'offline'].map((status) => (
                                <button key={status} onClick={() => setStatusFilter(status)} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                                    {status === 'all' ? '全部' : status === 'online' ? '在线' : '离线'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={nextAvailabilitySort}
                            className={"mobile-sort-button hidden sm:flex glass-panel px-3.5 py-2 rounded-[14px] text-[11px] font-bold uppercase tracking-wider transition-all items-center gap-1.5 " + (availabilitySort === 'none' ? 'text-slate-500 hover:text-slate-700' : 'bg-white/80 text-slate-800 shadow-sm')}
                            title="点击切换：默认排序 / 可用率升序 / 可用率降序"
                        >
                            <Icons.BarChart3 className="w-3.5 h-3.5" />
                            <span>排序</span>
                            {availabilitySortArrow && <span className="text-sm leading-none">{availabilitySortArrow}</span>}
                        </button>
                        </div>
                        {/* 搜索框 */}
                        <div className="mobile-search relative w-full sm:w-64">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="搜索服务器名称或地址..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-[14px] text-sm glass-input text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* 空状态 */}
                {filteredServers.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4"><Icons.Search className="w-8 h-8 text-slate-400" /></div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">未找到匹配的服务器</h3>
                        <p className="text-sm text-slate-500">尝试更换搜索词或清除筛选条件，或点击右上角添加新服务器。</p>
                    </div>
                )}

                {/* Cards View */}
                {activeTab === 'cards' && filteredServers.length > 0 && (
                    <div className="mobile-server-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredServers.map((s) => {
                            const iconImg = getDisplayIcon(s);
                            const isOnline = s.status === 'online';
                            const stats = getAvailabilityStats(s);
                            const keepAliveButton = getKeepAliveButtonState(s);
                            const lastPlayedText = formatLastPlayedText(s);
                            const lastPlayedError = (s.mediaStats && s.mediaStats.lastPlayed && s.mediaStats.lastPlayed.lastError) || (s.mediaStats && s.mediaStats.lastError) || '';
                            const lastPlayedTitle = lastPlayedText || lastPlayedError || '暂无上次观看记录';
                            const statusColors = {
                                online: { text: 'text-emerald-700', bg: 'bg-emerald-500/10', border: 'border-emerald-200', dotClass: 'dot-online', glowClass: 'glow-online' },
                                offline: { text: 'text-rose-700', bg: 'bg-rose-500/10', border: 'border-rose-200', dotClass: 'dot-offline', glowClass: 'glow-offline' },
                                updating: { text: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-200', dotClass: 'dot-updating', glowClass: 'bg-blue-400/20' },
                            }[s.status] || { text: 'text-slate-600', bg: 'bg-slate-200/50', border: 'border-slate-200', dotClass: 'bg-slate-400', glowClass: 'bg-slate-300/20' };

                            return (
                                <div key={s.id} className="mobile-card group server-card p-6 rounded-[2rem] transition-all duration-300 flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative">

                                    {/* 高级卡片呼吸背光 */}
                                    <div className={"absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[50px] pointer-events-none " + statusColors.glowClass}></div>

                                    {/* Header Row */}
                                    <div className={"server-card-head flex justify-between items-start server-card-head-" + (['online', 'offline', 'updating'].includes(s.status) ? s.status : 'unknown')}>
                                        <div className="flex gap-4 items-center">
                                            <div onClick={() => setIconModalTarget(s.id)} className="w-14 h-14 rounded-[1.2rem] bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:shadow-md transition-shadow cursor-pointer overflow-hidden" title="点击更换图标">
                                                {hideServerName ? <Icons.Server className="w-6 h-6" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className="w-full h-full object-contain p-2" onError={(e) => {e.target.style.display='none'}} /> : <span className="text-2xl font-black text-slate-700">{s.name ? s.name[0] : '?'}</span>)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-xl text-slate-800 truncate tracking-tight">{hideServerName ? 'Node Hidden' : s.name}</h3>
                                                <p className="text-[11px] text-slate-400 font-mono mt-1.5 font-semibold truncate bg-white/50 inline-block px-2 py-0.5 rounded-md border border-slate-100">{hideServerUrl ? 'https://****.****' : stripProtocol(s.url)}</p>
                                            </div>
                                        </div>

                                        <div className={"flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 backdrop-blur-sm shadow-sm " + statusColors.border + " " + statusColors.bg}>
                                            <span className={"w-2.5 h-2.5 rounded-full " + statusColors.dotClass} />
                                            <span className={"text-[10px] font-black uppercase tracking-wider " + statusColors.text}>
                                                {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 双栏指标区: 可用率与离线数 */}
                                    <div className="server-card-section server-card-metrics grid grid-cols-2 gap-3 mb-6 relative z-10 rounded-2xl p-4">
                                        <div className="text-center relative">
                                            <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1">
                                                {(availabilityRange === 'week' ? '7天' : '24H')}可用率
                                            </div>
                                            <div className="flex justify-center items-baseline gap-1">
                                                <span className={"text-3xl font-black tracking-tighter " + (stats.uptime === '---' ? 'text-slate-400' : parseFloat(stats.uptime) > 95 ? 'text-emerald-500' : 'text-amber-500')}>
                                                    {stats.uptime}
                                                </span>
                                                <span className="text-sm text-slate-400 font-bold">{stats.uptime === '---' ? '' : '%'}</span>
                                            </div>
                                        </div>
                                        <div className="text-center relative">
                                            <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200/60"></div>
                                            <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1">
                                                {(availabilityRange === 'week' ? '7天' : '24H')}离线
                                            </div>
                                            <div className="flex justify-center items-baseline gap-1">
                                                <span className={"text-3xl font-black tracking-tighter " + (stats.offline === 0 ? 'text-slate-400' : 'text-rose-500')}>
                                                    {stats.offline}
                                                </span>
                                                <span className="text-sm text-slate-400 font-bold">次</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 媒体库统计 */}
                                    {s.mediaStats && s.mediaStats.enabled && (
                                        <div className="server-card-section server-card-media rounded-2xl p-4 relative z-10">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">资源库较昨日变化</span>
                                                {s.mediaStats.lastError && <button onClick={() => alert(s.mediaStats.lastError)} className="text-[10px] text-rose-500 font-bold" title={s.mediaStats.lastError}>更新失败</button>}
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 divide-x divide-slate-200/60 text-center">
                                                {[
                                                    { label: '电影', icon: Icons.Film, key: 'movie' },
                                                    { label: '剧集', icon: Icons.Tv, key: 'series' },
                                                    { label: '单集', icon: Icons.PlaySquare, key: 'episode' }
                                                ].map((stat, i) => {
                                                    const count = s.mediaStats.counts ? s.mediaStats.counts[stat.key] : null;
                                                    const delta = s.mediaStats.dailyDelta ? s.mediaStats.dailyDelta[stat.key] : (s.mediaStats.delta24h ? s.mediaStats.delta24h[stat.key] : 0);
                                                    return (
                                                        <div key={i} className="flex flex-col items-center justify-center px-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                                                                <stat.icon className="w-3.5 h-3.5" /> <span>{stat.label}</span>
                                                            </div>
                                                            <div className="w-full min-w-0 text-center">
                                                                <div className="text-base font-black text-slate-700 tracking-tight truncate tabular-nums" title={count === null ? '--' : String(count)}>
                                                                    {count === null ? '--' : count}
                                                                </div>
                                                                <div className="mt-0.5 h-4 flex items-center justify-center">
                                                                    <span
                                                                        className={"max-w-full px-1.5 rounded-full text-[10px] leading-4 font-black tabular-nums truncate " + (delta > 0 ? "bg-emerald-50 text-emerald-600" : delta < 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400")}
                                                                        title={(delta > 0 ? '+' : '') + String(delta)}
                                                                    >
                                                                        {(delta > 0 ? '+' : '') + String(delta)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {showLastPlayed && s.mediaStats && s.mediaStats.enabled && (
                                        <div
                                            className={"server-card-last-played mt-3 flex max-w-full items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left relative z-10 text-[11px] leading-4 font-black shadow-sm " + (lastPlayedText ? "bg-sky-50/80 border-sky-100 text-sky-700" : "bg-amber-50/80 border-amber-100 text-amber-700")}
                                            title={lastPlayedTitle}
                                        >
                                            <Icons.PlaySquare className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="truncate">{lastPlayedText || '上次观看 暂无记录'}</span>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="server-card-footer mt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold relative z-10">
                                        <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-full border border-white">
                                            <Icons.Clock className="w-3 h-3" />
                                            检测: {new Date(s.lastCheck).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                        <div className="mobile-card-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setShareModalTarget(s.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">分享</button>
                                            <button onClick={() => openEditServerModal(s, true)} className={"px-3 py-1.5 rounded-lg transition-colors " + keepAliveButton.className}>{keepAliveButton.text}</button>
                                            <button onClick={() => openEditServerModal(s)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">编辑</button>
                                            <button onClick={async () => {
                                                if(confirm('彻底删除该服务器?')) {
                                                    const n = servers.filter(x => x.id !== s.id);
                                                    await syncToCloud(n, iconLib);
                                                }
                                            }} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">删除</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Dashboard View */}
                {activeTab === 'dashboard' && sortedServers.length > 0 && (
                    <div className="mobile-dashboard dashboard-shell rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none"></div>
                        {sortedServers.map((s) => {
                            const iconImg = getDisplayIcon(s);
                            const stats = getAvailabilityStats(s);
                            const rowClass = ['online', 'offline', 'updating'].includes(s.status) ? s.status : 'unknown';
                            return (
                                <div key={s.id} className={"dashboard-row dashboard-row-" + rowClass + " p-4 sm:p-5 rounded-2xl transition-all grid grid-cols-1 xl:grid-cols-[minmax(240px,0.36fr)_minmax(0,1fr)] xl:items-center gap-4 sm:gap-5"}>
                                    <div className="dashboard-node-panel flex items-center gap-4 sm:gap-5 min-w-0 relative rounded-2xl px-4 py-4">
                                        <div className={"absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-[15px] " + (s.status === 'online' ? 'glow-online' : s.status === 'offline' ? 'glow-offline' : 'bg-blue-400/20')}></div>
                                        <div className="w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center font-black text-xl text-slate-600 z-10 overflow-hidden flex-shrink-0">
                                            {hideServerName ? <Icons.Server className="w-5 h-5" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className="w-full h-full object-contain p-1.5" onError={(e) => {e.target.style.display='none'}} /> : s.name[0])}
                                        </div>
                                        <div className="z-10 min-w-0 flex-1">
                                            <div className="font-black text-slate-800 text-lg truncate tracking-tight">{hideServerName ? 'Node Hidden' : s.name}</div>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                                                <span className={"inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white/65 backdrop-blur-sm " + (s.status === 'online' ? 'border-emerald-200 text-emerald-700' : s.status === 'offline' ? 'border-rose-200 text-rose-700' : 'border-blue-200 text-blue-700')}>
                                                    <span className={"w-2 h-2 rounded-full flex-shrink-0 " + (s.status === 'online' ? 'dot-online' : s.status === 'offline' ? 'dot-offline' : 'dot-updating')}></span>
                                                    {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-white/55 border border-white text-slate-500">
                                                    {stats.uptime}% 可用率
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-white/55 border border-white text-slate-500">
                                                    {stats.offline} 次离线
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="status-chart-shell w-full min-w-0 min-h-[5.25rem] rounded-[1.2rem] px-3 py-2 overflow-visible">
                                        <StatusBars history={s.history || []} currentStatus={s.status} currentLatency={s.latency} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isPrivacyMenuOpen && (
                <div data-privacy-dialog="true" className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="mobile-privacy-backdrop absolute inset-0" onClick={() => setIsPrivacyMenuOpen(false)}></div>
                    <div className="mobile-privacy-menu relative z-10 border border-white/80 bg-white/80 backdrop-blur-xl shadow-2xl">
                        <div className="mb-3 px-1">
                            <div className="text-lg font-black text-slate-800">隐藏显示</div>
                            <div className="text-xs font-bold text-slate-500 mt-1">选择需要隐藏的服务器信息</div>
                        </div>
                        <div className="space-y-2">
                            {privacyOptions.map((option) => (
                                <button
                                    key={option.mode}
                                    onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}
                                    className={"w-full text-left transition-all " + (privacyMode === option.mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/60 hover:text-slate-800")}
                                >
                                    <div className="text-sm font-black">{option.label}</div>
                                    <div className="text-[11px] font-bold opacity-60 mt-0.5">{option.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 专属设置弹窗 (Settings Modal) */}
            {isSettingsOpen && (
                <div className="mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)}></div>
                    <div className="mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <Icons.X className="w-4 h-4" />
                        </button>
                        <div className="flex-none">
                            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Icons.Settings className="w-6 h-6 text-blue-500" />系统设置
                            </h2>
                        </div>

                        <div className="mobile-form-body">
                            <div className="space-y-4">
                                {/* 程序更新 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold"><Icons.DownloadCloud className="w-4 h-4 text-blue-500" />程序更新</div>
                                        <div className="text-xs font-bold text-slate-500">
                                            当前版本: {updateInfo ? updateInfo.currentVersion : APP_VERSION}
                                            {updateInfo && updateInfo.hasUpdate && <span className="ml-3 inline-block text-amber-500">发现新版本: {updateInfo.latestVersion}</span>}
                                            {updateInfo && !updateInfo.hasUpdate && updateInfo.latestVersion && updateInfo.latestVersion !== 'unknown' && <span className="ml-3 inline-block text-emerald-600">远端版本: {updateInfo.latestVersion}</span>}
                                        </div>
                                        {updateInfo && (updateInfo.error || (Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0) || updateInfo.sourceUrl) && (
                                            <div className="mt-3 space-y-1 text-[11px] font-bold text-slate-500">
                                                {updateInfo.error && <div className="text-rose-500">检查失败：{updateInfo.error}</div>}
                                                {Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0 && <div>缺少自更新配置：{updateInfo.missing.join(', ')}</div>}
                                                {updateInfo.sourceUrl && <div className="truncate">更新源：{updateInfo.sourceUrl}</div>}
                                            </div>
                                        )}
                                        {updateInfo && updateInfo.hasUpdate && Array.isArray(updateInfo.releaseNotes) && updateInfo.releaseNotes.length > 0 && (
                                            <div className="mt-3 space-y-1 text-[11px] font-bold text-slate-500">
                                                {updateInfo.releaseNotes.map((note, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <span className="text-amber-500">•</span>
                                                        <span>{note}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:flex gap-2 md:flex-shrink-0">
                                        <button onClick={() => checkForUpdate(true)} disabled={isCheckingUpdate || isApplyingUpdate} className="px-3 sm:px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap">
                                            {isCheckingUpdate ? '检查中...' : '检查更新'}
                                        </button>
                                        <button onClick={applyUpdate} disabled={!updateInfo || !updateInfo.hasUpdate || isApplyingUpdate || !updateInfo.canUpdate} className="px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap">
                                            {isApplyingUpdate ? '更新中...' : '一键更新'}
                                        </button>
                                    </div>
                                </div>
                                </div>

                                {/* Telegram 配置 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Icons.MessageSquare className="w-4 h-4 text-emerald-500" />通知配置 (Telegram)
                                    </div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                                        <input type="checkbox" checked={telegramForm.enabled} onChange={e => setTelegramForm({...telegramForm, enabled: e.target.checked})} className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                                        启用
                                    </label>
                                </div>
                                {telegramForm.enabled && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Bot Token</label>
                                            <input type="password" value={telegramForm.botToken} onChange={e => setTelegramForm({...telegramForm, botToken: e.target.value})} placeholder="123456:ABC-DEF1234..." className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Chat ID</label>
                                            <input type="text" value={telegramForm.chatId} onChange={e => setTelegramForm({...telegramForm, chatId: e.target.value})} placeholder="填写接收通知的 Chat ID" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                        <button onClick={handleSaveTelegram} className="w-full mt-2 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-sm rounded-xl transition-colors border border-emerald-200">应用 TG 配置</button>
                                    </div>
                                )}
                                </div>

                                {/* 图标库 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
                                    <Icons.ImageIcon className="w-4 h-4 text-purple-500" />图标库 (JSON)
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" value={iconInput} onChange={e => setIconInput(e.target.value)} placeholder="https://example.com/icons.json" className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                    <button onClick={handleSyncIcons} className="px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-200">拉取</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 添加/编辑服务器弹窗 (Add Server Modal) */}
            {isAddModalOpen && (
                <div className="mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <Icons.X className="w-4 h-4" />
                        </button>
                        <div className="flex-none">
                            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Icons.Server className="w-6 h-6 text-emerald-500" />
                                {editingServerId ? '编辑服务器' : '部署新服务器'}
                            </h2>
                        </div>

                        <div className="mobile-form-body">
                            <div className="space-y-4">
                                {/* 快捷导入 */}
                                <div className="bg-white/60 p-4 rounded-3xl border border-white shadow-sm">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block">快速粘贴解析</label>
                                    <button
                                        type="button"
                                        onClick={applyQuickImportText}
                                        disabled={!quickImportText.trim()}
                                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-100 hover:bg-blue-100 text-[11px] font-black transition-colors"
                                    >
                                        立即识别
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-28 glass-input p-3 rounded-2xl outline-none text-sm resize-none"
                                    placeholder={"示例：\\n服务器：https://emby.example.com:443\\n用户名：demo_user\\n密码：demo_password"}
                                    value={quickImportText}
                                    onChange={e=>setQuickImportText(e.target.value)}
                                />
                                </div>

                                {/* 基础配置 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold">
                                    <Icons.Link className="w-4 h-4 text-blue-500" />基础路由信息
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">服务器标识 (别名)</label>
                                    <input type="text" value={addForm.name} onChange={e=>setAddForm({...addForm, name: e.target.value})} placeholder="例如：US West Main" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">服务器地址</label>
                                    <div className="grid grid-cols-[80px_1fr_80px] gap-2">
                                        <button onClick={toggleProtocol} className="glass-input rounded-xl text-xs font-black text-blue-600 transition-colors uppercase">{addForm.protocol.replace('://', '')}</button>
                                        <input type="text" value={addForm.host} onChange={e=>updateHostFromInput(e.target.value)} placeholder="emby.example.com" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none" />
                                        <input type="text" value={addForm.port} onChange={e=>setAddForm({...addForm, port: cleanPortInput(e.target.value)})} placeholder="443" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-center outline-none" />
                                    </div>
                                </div>
                                </div>

                                {/* 备用地址 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Icons.Link className="w-4 h-4 text-emerald-500" />备用地址
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addFallbackUrl}
                                        disabled={fallbackUrls.length >= 4}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-100 hover:bg-emerald-100 text-[11px] font-black transition-colors"
                                    >
                                        添加
                                    </button>
                                </div>
                                {fallbackUrls.length === 0 ? (
                                    <div className="text-xs text-slate-400 font-semibold bg-white/45 border border-white/70 rounded-2xl px-4 py-3">主地址不可用时，将按顺序探测备用地址。</div>
                                ) : (
                                    <div className="space-y-2">
                                        {fallbackUrls.map((fallbackUrl, index) => (
                                            <div key={index} className="grid grid-cols-[1fr_40px] gap-2">
                                                <input type="text" value={fallbackUrl} onChange={e=>updateFallbackUrl(index, e.target.value)} placeholder={"https://backup" + (index + 1) + ".example.com"} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none" />
                                                <button type="button" onClick={() => removeFallbackUrl(index)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors">
                                                    <Icons.X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                </div>

                                {/* 媒体库配置 */}
                                <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Icons.ShieldCheck className="w-4 h-4 text-purple-500" />启用媒体库资源统计
                                    </div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer self-start sm:self-auto">
                                        <input type="checkbox" checked={mediaForm.enabled} onChange={e=>setMediaForm({...mediaForm, enabled: e.target.checked})} className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                                    </label>
                                </div>
                                {mediaForm.enabled && (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Emby 用户名</label>
                                            <input type="text" value={mediaForm.username} onChange={e=>setMediaForm({...mediaForm, username: e.target.value})} placeholder="Admin" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Emby 密码</label>
                                            <input type="password" value={mediaForm.password} onChange={e=>setMediaForm({...mediaForm, password: e.target.value})} placeholder="••••••••" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                    </div>
                                )}
                                </div>

                                {/* 保号设置 */}
                                <div ref={keepAliveSectionRef} className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Icons.Clock className="w-4 h-4 text-orange-500" />保号设置
                                    </div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer self-start sm:self-auto">
                                        <input type="checkbox" checked={keepAliveForm.enabled} onChange={e=>setKeepAliveForm({...keepAliveForm, enabled: e.target.checked})} className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                                    </label>
                                </div>
                                {keepAliveForm.enabled && (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">活跃周期（天）</label>
                                            <input type="text" inputMode="numeric" value={keepAliveForm.periodDays} onChange={e=>setKeepAliveForm({...keepAliveForm, periodDays: cleanPositiveIntInput(e.target.value)})} placeholder="例如：30" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">提前提醒（天）</label>
                                            <input type="text" inputMode="numeric" value={keepAliveForm.alertDays} onChange={e=>setKeepAliveForm({...keepAliveForm, alertDays: cleanPositiveIntInput(e.target.value)})} placeholder="例如：27" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>

                        <div className="mobile-form-footer mt-8">
                            <button onClick={handleSaveServer} disabled={isSavingServer || isRefreshing} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2">
                                {isSavingServer ? '保存中...' : (editingServerId ? '保存修改' : '确认部署')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 分享弹窗 */}
            {shareModalTarget && (() => {
                const targetServer = shareModalTarget === 'public' ? null : servers.find(server => String(server.id) === String(shareModalTarget));
                const publicUrl = getPublicUrl();
                const shareExpired = publicShareExpiresAt ? Date.now() >= publicShareExpiresAt : false;
                const shareExpiresText = publicShareExpiresAt ? new Date(publicShareExpiresAt).toLocaleString('zh-CN', { hour12: false }) : '';
                const cardShare = targetServer ? cardShareLinks[targetServer.id] : null;
                const cardShareExpired = cardShare && cardShare.expiresAt ? Date.now() >= cardShare.expiresAt : false;
                const cardShareExpiresText = cardShare && cardShare.expiresAt ? new Date(cardShare.expiresAt).toLocaleString('zh-CN', { hour12: false }) : '';
                return (
                    <div className="mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setShareModalTarget(null)}></div>
                        <div className="mobile-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
                            <button onClick={() => setShareModalTarget(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                                <Icons.X className="w-4 h-4" />
                            </button>

                            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Icons.Share2 className="w-6 h-6 text-emerald-500" />
                                {targetServer ? '服务器卡片分享' : '公开链接'}
                            </h2>

                            <div className="space-y-4">
                                {!targetServer && (
                                <React.Fragment>
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-slate-700 font-bold">公开大盘链接</div>
                                            <button onClick={generatePublicShareLink} disabled={isGeneratingPublicShare} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50">
                                                <Icons.Share2 className="w-3.5 h-3.5" /> {isGeneratingPublicShare ? '生成中...' : (publicShareLink ? '重新生成' : '生成')}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button type="button" onClick={() => setPublicShareLifetime('hour')} className={"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors " + (publicShareLifetime === 'hour' ? "bg-slate-800 text-white border-slate-800" : "bg-white/70 text-slate-600 border-white hover:bg-white")}>1 小时有效</button>
                                            <button type="button" onClick={() => setPublicShareLifetime('forever')} className={"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors " + (publicShareLifetime === 'forever' ? "bg-slate-800 text-white border-slate-800" : "bg-white/70 text-slate-600 border-white hover:bg-white")}>永久有效</button>
                                        </div>
                                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                            <input type="checkbox" checked={publicShareIncludeProfile} onChange={e => setPublicShareIncludeProfile(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                            <span>公开页显示 Telegram 名称和头像</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button type="button" onClick={() => setPublicShareHideCounts(false)} className={"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors " + (!publicShareHideCounts ? "bg-slate-800 text-white border-slate-800" : "bg-white/70 text-slate-600 border-white hover:bg-white")}>展示数量</button>
                                            <button type="button" onClick={() => setPublicShareHideCounts(true)} className={"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors " + (publicShareHideCounts ? "bg-slate-800 text-white border-slate-800" : "bg-white/70 text-slate-600 border-white hover:bg-white")}>隐藏数量</button>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 leading-relaxed">
                                            隐藏后只保留前缀位数，例如 58690 变成 58***，500 变成 5**。
                                        </div>
                                        <div className="grid grid-cols-[1fr_44px] gap-2">
                                            <input readOnly value={publicUrl} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none" />
                                            <button onClick={() => copyText(publicUrl, '公开大盘链接')} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors">
                                                <Icons.Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3">
                                            <span>有效期：{publicShareLifetime === 'forever' ? '永久' : '1 小时'}</span>
                                            {publicShareExpiresAt ? <span>{shareExpired ? '已过期' : '过期时间：' + shareExpiresText}</span> : (publicShareLink ? <span>永久有效</span> : null)}
                                        </div>
                                    </div>

                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-slate-700 font-bold">公开页独立访问统计</div>
                                            <button onClick={fetchPublicShareStats} disabled={isLoadingPublicShareStats} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 text-[11px] font-black transition-colors disabled:opacity-50">
                                                {isLoadingPublicShareStats ? '刷新中...' : '刷新'}
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                            {publicShareStats.length === 0 && (
                                                <div className="py-8 text-center text-xs font-bold text-slate-400">
                                                    {isLoadingPublicShareStats ? '正在读取统计...' : '暂无公开页记录'}
                                                </div>
                                            )}
                                            {publicShareStats.map((item) => {
                                                const itemExpired = Number(item.expiresAt) > 0 && Date.now() >= Number(item.expiresAt);
                                                const itemUrl = item.url || (getShareBaseUrl() + '/public/' + item.token);
                                                const maskCount = (value, hide = false) => {
                                                    const text = String(Math.max(0, Number(value) || 0));
                                                    if (!hide) return text;
                                                    if (text.length <= 1) return text + '**';
                                                    const keep = text.length >= 5 ? 2 : 1;
                                                    return text.slice(0, keep) + '*'.repeat(Math.max(2, text.length - keep));
                                                };
                                                return (
                                                    <div key={item.token} className="rounded-2xl bg-white/70 border border-white p-3 space-y-2">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="text-sm font-black text-slate-700 tabular-nums">{Number(item.views) || 0} 个独立 IP</div>
                                                            <span className={"px-2 py-1 rounded-full text-[10px] font-black " + (itemExpired ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600")}>{itemExpired ? '已过期' : (Number(item.expiresAt) ? '有效中' : '永久')}</span>
                                                        </div>
                                                        <div className="text-[11px] font-bold text-slate-500 space-y-1">
                                                            <div>生成：{formatStatTime(item.createdAt)}</div>
                                                            <div>过期：{formatShareExpires(item.expiresAt)}</div>
                                                            <div>最后访问：{formatStatTime(item.lastViewedAt)}</div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 text-center">
                                                            <div className="rounded-xl bg-white/60 border border-white px-2 py-2">
                                                                <div className="text-[9px] font-black text-slate-400">电影</div>
                                                                <div className="mt-1 text-sm font-black text-slate-700 tabular-nums">{maskCount(item.movieCount, item.hideCounts)}</div>
                                                            </div>
                                                            <div className="rounded-xl bg-white/60 border border-white px-2 py-2">
                                                                <div className="text-[9px] font-black text-slate-400">剧集</div>
                                                                <div className="mt-1 text-sm font-black text-slate-700 tabular-nums">{maskCount(item.seriesCount, item.hideCounts)}</div>
                                                            </div>
                                                            <div className="rounded-xl bg-white/60 border border-white px-2 py-2">
                                                                <div className="text-[9px] font-black text-slate-400">总集数</div>
                                                                <div className="mt-1 text-sm font-black text-slate-700 tabular-nums">{maskCount(item.episodeCount, item.hideCounts)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-[1fr_38px_38px] gap-2">
                                                            <input readOnly value={itemUrl} className="w-full glass-input px-3 py-2 rounded-xl text-[11px] font-mono outline-none" />
                                                            <button onClick={() => copyText(itemUrl, '公开页链接')} className="w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors">
                                                                <Icons.Copy className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => deletePublicShareLink(item.token)} disabled={deletingPublicShareToken === item.token} className="w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors disabled:opacity-50">
                                                                <Icons.Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </React.Fragment>
                                )}

                                {targetServer && (
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-slate-700 font-bold truncate">卡片图片快照</div>
                                            <button onClick={() => generateCardShareLink(targetServer.id)} disabled={generatingCardShareId === targetServer.id} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50">
                                                <Icons.Share2 className="w-3.5 h-3.5" /> {generatingCardShareId === targetServer.id ? '生成中...' : '生成'}
                                            </button>
                                        </div>
                                        {cardShare && (
                                            <div className="space-y-2">
                                                <div className="rounded-2xl bg-white/70 border border-white p-3 flex justify-center overflow-hidden">
                                                    <img src={cardShare.url} alt="server card snapshot" className="w-full max-w-md rounded-xl" />
                                                </div>
                                                <div className="grid grid-cols-[1fr_44px] gap-2">
                                                    <input readOnly value={cardShare.url} className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none" />
                                                    <button onClick={() => copyText(cardShare.url, '卡片图片地址')} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors">
                                                        <Icons.Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3">
                                                    <span>有效期：1 小时</span>
                                                    {cardShare.expiresAt && <span>{cardShareExpired ? '已过期' : '过期时间：' + cardShareExpiresText}</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* 图标选择弹窗 */}
            {iconModalTarget && (
                <div className="mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIconModalTarget(null)}></div>
                    <div className="mobile-sheet mobile-icon-sheet relative w-full max-w-4xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 flex flex-col border border-white animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIconModalTarget(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10">
                            <Icons.X className="w-4 h-4" />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2"><Icons.ImageIcon className="w-6 h-6 text-purple-500" />图标选择</h2>
                        <p className="text-xs text-slate-500 mb-6 font-bold">点击下方图标为服务器应用自定义图标。</p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
                            <div className="relative flex-1">
                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" className="w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-sm outline-none" placeholder="搜索图标名称..." value={iconSearch} onChange={e => setIconSearch(e.target.value)} autoFocus />
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 whitespace-nowrap">
                                {filteredIconEntries.length} / {safeIconEntries.length}
                            </div>
                        </div>

                        <div className="overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pb-4 mt-2 max-h-[60vh]">
                            <div onClick={async () => {
                                const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: null} : s);
                                await syncToCloud(up, iconLib);
                                setIconModalTarget(null);
                            }} className="aspect-square bg-slate-100 rounded-[1.2rem] border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                <span className="text-[10px] font-bold text-slate-500">自动匹配</span>
                            </div>
                            {filteredIconEntries.map(([key, url], idx) => (
                                <div key={idx} onClick={async () => {
                                    const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: url} : s);
                                    await syncToCloud(up, iconLib);
                                    setIconModalTarget(null);
                                }} className="aspect-square bg-white rounded-[1.2rem] border border-slate-100 p-3 cursor-pointer hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center shadow-sm relative group transition-all">
                                    <img src={getProxyImgSrc(url)} className="w-full h-full object-contain drop-shadow-sm" loading="lazy" onError={(e) => {e.target.style.display='none'}} />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-xl">{key}</div>
                                </div>
                            ))}
                            {filteredIconEntries.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500 text-sm font-bold">没有匹配的图标</div>
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
    if (rootEl) { ReactDOM.createRoot(rootEl).render(<App />); window.__EMBY_DASHBOARD_BOOTED__ = true; }
} catch(e) { showBootError('React 渲染失败：' + (e.message || e.toString())); }
