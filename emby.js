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
        html { background: #e8edf4; }
        body { background: linear-gradient(180deg, #edf2f7 0%, #e6ebf2 100%); color: #334155; font-family: system-ui; margin: 0; }

        /* 自定义高级动画与玻璃拟物样式 */
        @keyframes breath-dot-online {
            0%, 100% { box-shadow: 0 0 6px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.2); }
            50% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.8), 0 0 0 6px rgba(16, 185, 129, 0); }
        }
        @keyframes breath-dot-offline {
            0%, 100% { box-shadow: 0 0 6px rgba(244, 63, 94, 0.5), 0 0 0 0 rgba(244, 63, 94, 0.2); }
            50% { box-shadow: 0 0 14px rgba(244, 63, 94, 0.9), 0 0 0 6px rgba(244, 63, 94, 0); }
        }
        @keyframes breath-glow-online {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes breath-glow-offline {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(1.15); }
        }
        @keyframes pulse-updating {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .dot-online { background-color: #10b981; animation: breath-dot-online 2.5s ease-in-out infinite; }
        .dot-offline { background-color: #f43f5e; animation: breath-dot-offline 2s ease-in-out infinite; }
        .dot-updating { background-color: #3b82f6; animation: pulse-updating 1.5s infinite; }
        .glow-online { background-color: #10b981; animation: breath-glow-online 2.5s ease-in-out infinite; }
        .glow-offline { background-color: #f43f5e; animation: breath-glow-offline 2s ease-in-out infinite; }

        .glass-panel {
            background: rgba(255, 255, 255, 0.78);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(148, 163, 184, 0.22);
            box-shadow: 0 16px 40px -18px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92);
        }
        .brand-title {
            background: linear-gradient(100deg, #0f172a 0%, #0369a1 48%, #059669 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 18px 34px rgba(14, 116, 144, 0.12);
        }
        .brand-icon-shell {
            background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,249,255,0.74));
            border: 1px solid rgba(255,255,255,0.96);
            box-shadow: 0 18px 36px -24px rgba(15, 23, 42, 0.56), inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .view-switcher {
            background: linear-gradient(180deg, rgba(255,255,255,0.86), rgba(241,245,249,0.68));
            border: 1px solid rgba(148, 163, 184, 0.24);
            box-shadow: 0 18px 44px -30px rgba(15, 23, 42, 0.5), inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .view-switch-active {
            background: linear-gradient(180deg, #ffffff, #f8fafc);
            color: #2563eb;
            box-shadow: 0 10px 24px -16px rgba(15, 23, 42, 0.45), inset 0 0 0 1px rgba(255,255,255,0.9);
        }
        .dashboard-shell {
            background: linear-gradient(180deg, rgba(248,250,252,0.86), rgba(226,232,240,0.58));
            border: 1px solid rgba(148, 163, 184, 0.28);
            box-shadow: 0 26px 70px -42px rgba(15, 23, 42, 0.42), inset 0 1px 0 rgba(255,255,255,0.86);
        }
        .dashboard-row {
            box-shadow: 0 12px 34px -28px rgba(15, 23, 42, 0.36), inset 0 1px 0 rgba(255,255,255,0.75);
        }
        .status-chart-shell {
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.86), inset 0 -1px 0 rgba(148,163,184,0.16);
        }
        .glass-input {
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(203, 213, 225, 0.92);
            transition: all 0.2s ease;
            color: #334155;
        }
        .glass-input:focus {
            background: #fff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
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
        const { useState, useEffect, useRef, useMemo } = React;
        const APP_VERSION = '2026.05.17.1';

        // --- 内置 SVG 图标 ---
        const Icon = ({ path, className = "w-4 h-4", viewBox = "0 0 24 24" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{ __html: path }} />
        );
        const Icons = {
            Activity: (p) => <Icon {...p} path='<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>' />,
            Server: (p) => <Icon {...p} path='<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>' />,
            Settings: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' />,
            Plus: (p) => <Icon {...p} path='<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>' />,
            Eye: (p) => <Icon {...p} path='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>' />,
            EyeOff: (p) => <Icon {...p} path='<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>' />,
            RefreshCw: (p) => <Icon {...p} path='<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>' />,
            Film: (p) => <Icon {...p} path='<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>' />,
            Tv: (p) => <Icon {...p} path='<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>' />,
            PlaySquare: (p) => <Icon {...p} path='<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><polygon points="10 8 16 12 10 16 10 8"></polygon>' />,
            AlertCircle: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' />,
            LayoutGrid: (p) => <Icon {...p} path='<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' />,
            BarChart3: (p) => <Icon {...p} path='<path d="M3 3v18h18"></path><rect x="18" y="13" width="4" height="8"></rect><rect x="12" y="5" width="4" height="16"></rect><rect x="6" y="9" width="4" height="12"></rect>' />,
            CheckCircle2: (p) => <Icon {...p} path='<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' />,
            XCircle: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' />,
            Clock: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>' />,
            Cloud: (p) => <Icon {...p} path='<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>' />,
            X: (p) => <Icon {...p} path='<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' />,
            MessageSquare: (p) => <Icon {...p} path='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' />,
            ImageIcon: (p) => <Icon {...p} path='<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>' />,
            Search: (p) => <Icon {...p} path='<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' />,
            Link: (p) => <Icon {...p} path='<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' />,
            ShieldCheck: (p) => <Icon {...p} path='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>' />,
            DownloadCloud: (p) => <Icon {...p} path='<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>' />
        };

        // --- 历史状态条组件 (拟物风格) ---
        const StatusBars = ({ history = [], currentStatus = 'unknown', currentLatency = 0 }) => {
            const maxBars = 60;
            const bucketMs = 60 * 1000;
            const [hoveredIndex, setHoveredIndex] = useState(null);
            const buckets = useMemo(() => {
                const now = Date.now();
                const end = Math.floor(now / bucketMs) * bucketMs;
                const start = end - ((maxBars - 1) * bucketMs);
                const normalized = Array.from({ length: maxBars }, (_, index) => ({
                    status: null,
                    time: start + (index * bucketMs),
                    latency: 0,
                    count: 0,
                    filled: false
                }));

                if (!Array.isArray(history)) return normalized;

                const sortedHistory = history
                    .filter((item) => item && typeof item === 'object' && item.time && Number.isFinite(Number(item.time)))
                    .sort((a, b) => Number(a.time) - Number(b.time));

                let carryStatus = null;
                let carryLatency = 0;
                sortedHistory.forEach((item) => {
                    const time = Number(item.time);
                    if (time < start) {
                        carryStatus = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';
                        carryLatency = Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : 0;
                    }
                });

                if (carryStatus) {
                    normalized[0] = { ...normalized[0], status: carryStatus, latency: carryLatency, filled: true };
                }

                sortedHistory.forEach((item) => {
                    if (!item || typeof item !== 'object' || !item.time) return;
                    const time = Number(item.time);
                    if (!Number.isFinite(time) || time < start || time > end + bucketMs - 1) return;
                    const index = Math.min(maxBars - 1, Math.max(0, Math.floor((time - start) / bucketMs)));
                    const status = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';
                    const previous = normalized[index];
                    normalized[index] = {
                        status: previous.status === 'offline' || status === 'offline' ? 'offline' : status,
                        time,
                        latency: Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : previous.latency,
                        count: (previous.count || 0) + 1,
                        filled: false
                    };
                });

                for (let index = 1; index < normalized.length; index += 1) {
                    if (normalized[index].status !== null) continue;
                    if (normalized[index - 1].status === null) continue;
                    normalized[index] = {
                        ...normalized[index],
                        status: normalized[index - 1].status,
                        latency: normalized[index - 1].latency,
                        filled: true
                    };
                }

                if (currentStatus === 'online' || currentStatus === 'offline') {
                    normalized[maxBars - 1] = {
                        ...normalized[maxBars - 1],
                        status: currentStatus,
                        time: now,
                        latency: Number.isFinite(Number(currentLatency)) ? Math.max(0, Number(currentLatency)) : 0,
                        filled: normalized[maxBars - 1].count === 0
                    };
                }

                return normalized;
            }, [history, currentStatus, currentLatency]);
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
                if (!item || item.status === null) return null;
                return item.status === 'online' ? 1 : 0;
            };
            const getHistoryTitle = (item) => {
                if (!item || item.status === null) return '';
                const status = getHistoryStatus(item) === 1 ? '在线' : '离线';
                const time = formatHistoryTime(item.time);
                const latency = item && item.latency ? '，延迟 ' + item.latency + 'ms' : '';
                const count = item && item.count > 1 ? '，本分钟 ' + item.count + ' 次探测' : '';
                return status + ' - ' + time + latency + count;
            };
            const getDockStyle = (status, index) => {
                const baseHeight = status === null ? 8 : 24;
                if (hoveredIndex === null || status === null) {
                    return { height: baseHeight + 'px', transform: 'scaleX(1)' };
                }
                const isHovered = hoveredIndex === index;
                return {
                    height: (baseHeight + (isHovered ? 10 : 0)) + 'px',
                    transform: isHovered ? 'scaleX(1.12)' : 'scaleX(1)',
                    zIndex: isHovered ? 20 : 1
                };
            };
            const getHitboxStyle = (status, index) => {
                return {
                    height: '48px'
                };
            };
            return (
                <div data-status-bars className="flex flex-col w-full min-w-0 py-1">
                    <div className="grid grid-cols-[repeat(60,minmax(2px,1fr))] gap-[2px] items-end h-[4.25rem] pt-6 pb-1 overflow-visible">
                        {buckets.map((item, i) => {
                            const status = getHistoryStatus(item);
                            let color = 'bg-transparent';
                            if (status === 1) color = 'bg-emerald-400';
                            if (status === 0) color = 'bg-red-500';
                            return (
                                <div
                                    key={i}
                                    data-status-hitbox
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="relative flex items-end justify-center overflow-visible"
                                    style={getHitboxStyle(status, i)}
                                >
                                    {status !== null && (
                                        <div className={"absolute bottom-full mb-2 px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-[10px] text-slate-200 font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all duration-150 " + (i > maxBars - 8 ? "right-0" : i < 8 ? "left-0" : "left-1/2 -translate-x-1/2") + " " + (hoveredIndex === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")} style={{ zIndex: 50 }}>
                                            {getHistoryTitle(item)}
                                        </div>
                                    )}
                                    <div
                                        className={"w-full max-w-[5px] origin-bottom rounded-full transition-transform duration-150 ease-out hover:opacity-100 will-change-transform " + (status === null ? "opacity-0 " : "opacity-90 ") + color}
                                        style={{ ...getDockStyle(status, i), transformOrigin: 'bottom center' }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2 flex justify-between w-full border-t border-slate-200/70 pt-1 text-[9px] leading-none text-slate-500 font-bold px-0.5">
                        <span>60分钟前</span><span>现在</span>
                    </div>
                </div>
            );
        };

        const App = () => {
            const [servers, setServers] = useState([]);
            const [iconLib, setIconLib] = useState({});
            const [isRefreshing, setIsRefreshing] = useState(false);
            const [isSettingsOpen, setIsSettingsOpen] = useState(false);
            const [isAddModalOpen, setIsAddModalOpen] = useState(false);
            const [editingServerId, setEditingServerId] = useState(null);
            const [iconModalTarget, setIconModalTarget] = useState(null);
            const [iconInput, setIconInput] = useState('');
            const [iconSearch, setIconSearch] = useState('');
            const [hideServerMeta, setHideServerMeta] = useState(() => localStorage.getItem('hide_server_meta') === '1');
            const [availabilityRange, setAvailabilityRange] = useState(() => localStorage.getItem('availability_range') === 'week' ? 'week' : 'day');

            // 搜索与过滤
            const [searchQuery, setSearchQuery] = useState('');
            const [statusFilter, setStatusFilter] = useState('all');
            const [availabilitySort, setAvailabilitySort] = useState(() => localStorage.getItem('availability_sort') || 'none');

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
            const [autoRefreshSeconds, setAutoRefreshSeconds] = useState(60);
            const autoRefreshTimerRef = useRef(null);

            // API 调用封装
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
                    setServers(Array.isArray(data.servers) ? data.servers : []);
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
            useEffect(() => { if (iconModalTarget) setIconSearch(''); }, [iconModalTarget]);
            useEffect(() => { localStorage.setItem('hide_server_meta', hideServerMeta ? '1' : '0'); }, [hideServerMeta]);
            useEffect(() => { localStorage.setItem('availability_range', availabilityRange); }, [availabilityRange]);
            useEffect(() => { localStorage.setItem('availability_sort', availabilitySort); }, [availabilitySort]);

            useEffect(() => {
                const stopAutoRefreshTimer = () => {
                    if (autoRefreshTimerRef.current) { clearInterval(autoRefreshTimerRef.current); autoRefreshTimerRef.current = null; }
                };
                const startAutoRefreshTimer = () => {
                    if (document.hidden || autoRefreshTimerRef.current) return;
                    autoRefreshTimerRef.current = setInterval(() => {
                        let shouldReload = false;
                        setAutoRefreshSeconds((prev) => {
                            const next = prev - 1;
                            if (next <= 0) { shouldReload = true; stopAutoRefreshTimer(); return 60; }
                            return next;
                        });
                        if (shouldReload) setTimeout(() => location.reload(), 0);
                    }, 1000);
                };
                if (!isLoading) startAutoRefreshTimer();
                const handleVisibility = () => {
                    stopAutoRefreshTimer();
                    if (!document.hidden && !isLoading) startAutoRefreshTimer();
                };
                document.addEventListener('visibilitychange', handleVisibility);
                return () => { stopAutoRefreshTimer(); document.removeEventListener('visibilitychange', handleVisibility); };
            }, [isLoading]);

            const syncToCloud = async (newServers, newIcons, nextTelegram = telegramForm) => {
                const serverById = new Map(servers.map(s => [s.id, s]));
                const mergedServers = newServers.map((server) => {
                    const existing = serverById.get(server.id);
                    if (existing && existing.mediaStats && !server.mediaStats) return { ...server, mediaStats: existing.mediaStats };
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
                    const res = await apiFetch('/api/ping-all', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
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
                    setAutoRefreshSeconds(60);
                }
            };

            const getProxyImgSrc = (u) => {
                if (!u) return "";
                if (u.startsWith('data:')) return u;
                return "/proxy-img?url=" + encodeURIComponent(u);
            };

            const getSafeIconLib = () => (typeof iconLib === 'object' && iconLib !== null && !Array.isArray(iconLib)) ? iconLib : {};
            const normalizeTextForMatch = (value) => String(value || '').normalize('NFKC').toLowerCase();
            const getDisplayIcon = (server) => {
                if (server.customIcon) return server.customIcon;
                if (!server.name) return null;
                const n = normalizeTextForMatch(server.name);
                const safeIcons = getSafeIconLib();
                for (let k in safeIcons) { if (n.includes(normalizeTextForMatch(k))) return safeIcons[k]; }
                return null;
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

            const stripProtocol = (value) => {
                const text = String(value || '');
                const lower = text.toLowerCase();
                if (lower.startsWith('http://')) return text.slice(7);
                if (lower.startsWith('https://')) return text.slice(8);
                return text;
            };
            const cleanPortInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').slice(0, 5);

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
                    return { protocol: parsed.protocol === 'http:' ? 'http://' : 'https://', host: parsed.hostname, port: parsed.port || (parsed.protocol === 'http:' ? '80' : '443') };
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
                        enabled: mediaForm.enabled, username: mediaForm.enabled ? mediaForm.username.trim() : '', password: mediaForm.enabled ? mediaForm.password : '',
                        deviceId: previousMedia.deviceId || ('forward-' + Date.now().toString(36)),
                        accessToken: mediaForm.enabled && !credentialsChanged ? (previousMedia.accessToken || '') : '',
                        lastCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastCheck || 0) : 0,
                        lastError: '', counts: mediaForm.enabled && !credentialsChanged ? (previousMedia.counts || null) : null,
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
                        return { ...server, name: addForm.name, url: finalUrl, status: urlChanged ? 'updating' : server.status, latency: urlChanged ? 0 : server.latency, mediaStats: buildMediaStats(server) };
                    });
                } else {
                    const newServer = {
                        id: Date.now(), name: addForm.name, url: finalUrl, customIcon: null, status: 'updating',
                        totalChecks: 0, successfulChecks: 0, uptime: "0.0", latency: 0, lastCheck: 0, history: [], mediaStats: buildMediaStats(null)
                    };
                    updatedServers = [...servers, newServer];
                }

                const savedUpdatedAt = await syncToCloud(updatedServers, iconLib);
                setIsAddModalOpen(false); resetServerForm(); setActiveTab('cards');
                await manualPing(updatedServers, savedUpdatedAt);
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
                    if (showAlert) alert(data.hasUpdate ? ('发现新版本：' + data.latestVersion) : '当前已经是最新版本');
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
                    alert('更新完成，页面即将刷新');
                    setTimeout(() => location.reload(), 1200);
                } catch(e) { alert('更新失败：' + (e.message || 'Cloudflare API 调用异常')); } finally { setIsApplyingUpdate(false); }
            };

            if (isLoading) return <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold">读取云端配置中...</div>;

            // 动态数据计算
            const onlineCount = servers.filter(s => s.status === 'online').length;
            const offlineCount = servers.filter(s => s.status === 'offline').length;
            const validUptimeServers = servers.filter(s => getAvailabilityStats(s).uptime !== '---');
            const avgUptime = validUptimeServers.length > 0
                ? (validUptimeServers.reduce((acc, s) => acc + parseFloat(getAvailabilityStats(s).uptime), 0) / validUptimeServers.length).toFixed(1)
                : '0.0';
            const notifyLabel = notifyEnabled ? '已开启' : '未开启';

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
                <div className="min-h-screen relative overflow-x-hidden">
                    {/* 极光背景装饰 */}
                    <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-300/16 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply" />
                    <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-300/14 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-multiply" />

                    <div className="w-full max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12 relative z-10">
                        {/* Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                                    <div className="brand-icon-shell w-14 h-14 rounded-[1.1rem] backdrop-blur-sm flex items-center justify-center">
                                        <Icons.Cloud className="w-8 h-8 text-sky-500 drop-shadow-sm" />
                                    </div>
                                    <span className="brand-title">
                                        Emby 服务器探针
                                    </span>
                                </h1>
                                <p className="text-[11px] text-slate-500 font-bold tracking-widest mt-3 uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full dot-online"></span>
                                    Emby server probe
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* 辅助功能组 (Icon-only) */}
                                <div className="flex items-center gap-2 mr-2">
                                    <button
                                        onClick={() => setHideServerMeta(!hideServerMeta)}
                                        title={hideServerMeta ? "显示节点信息" : "隐藏敏感信息"}
                                        className={"w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 " + (hideServerMeta ? "bg-slate-200 text-slate-700 shadow-inner" : "bg-white/70 text-slate-500 hover:text-slate-800 hover:bg-white")}
                                    >
                                        {hideServerMeta ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setIsSettingsOpen(true)}
                                        title="系统设置"
                                        className="w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm"
                                    >
                                        <Icons.Settings className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* 核心操作组 */}
                                <button onClick={openAddServerModal} className="px-5 py-2.5 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[14px] text-sm font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.28)] transition-all flex items-center gap-2">
                                    <Icons.Plus className="w-4 h-4" /> 添加节点
                                </button>
                                <button
                                    onClick={() => manualPing(servers)}
                                    disabled={isRefreshing}
                                    className="px-4 py-2.5 h-11 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 rounded-[14px] text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Icons.RefreshCw className={"w-4 h-4 " + (isRefreshing ? 'animate-spin' : '')} />
                                    <span className="inline-flex items-center justify-center w-[7.5rem] tabular-nums">
                                        {isRefreshing ? '正在刷新...' : '刷新状态 (' + String(autoRefreshSeconds).padStart(2, '0') + 's)'}
                                    </span>
                                </button>
                            </div>
                        </header>

                        {/* Overview Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {[
                                { label: '在线节点', value: onlineCount + "/" + servers.length, icon: Icons.CheckCircle2, color: 'text-emerald-500', glow: 'glow-online' },
                                { label: '当前离线', value: offlineCount, icon: Icons.XCircle, color: 'text-rose-500', glow: 'glow-offline' },
                                { label: (availabilityRange === 'week' ? '7天' : '24H') + ' 可用率', value: avgUptime + "%", icon: Icons.BarChart3, color: 'text-blue-500', glow: 'bg-blue-500/20' },
                                { label: '报警通知', value: notifyLabel, icon: Icons.AlertCircle, color: 'text-purple-500', glow: 'bg-purple-500/20' },
                            ].map((item, idx) => (
                                <div key={idx} className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
                                    <div className={"absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl " + item.glow}></div>
                                    <div className={"w-12 h-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center shadow-sm relative z-10 " + item.color}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Bar: View Toggles & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="view-switcher flex p-1.5 rounded-2xl w-fit">
                                <button onClick={() => setActiveTab('cards')} className={"px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 " + (activeTab === 'cards' ? 'view-switch-active' : 'text-slate-500 hover:text-slate-700')}>
                                    <Icons.LayoutGrid className="w-4 h-4" /> 看板
                                </button>
                                <button onClick={() => setActiveTab('dashboard')} className={"px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 " + (activeTab === 'dashboard' ? 'view-switch-active' : 'text-slate-500 hover:text-slate-700')}>
                                    <Icons.Activity className="w-4 h-4" /> 历史大盘
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                {/* 时间范围胶囊 (仅看板模式) */}
                                {activeTab === 'cards' && (
                                    <div className="hidden sm:flex glass-panel p-1.5 rounded-[14px]">
                                        <button onClick={() => setAvailabilityRange('day')} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (availabilityRange === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>24H</button>
                                        <button onClick={() => setAvailabilityRange('week')} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (availabilityRange === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>7天</button>
                                    </div>
                                )}
                                {/* 状态筛选胶囊 */}
                                <div className="hidden sm:flex glass-panel p-1.5 rounded-[14px]">
                                    {['all', 'online', 'offline'].map((status) => (
                                        <button key={status} onClick={() => setStatusFilter(status)} className={"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " + (statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                                            {status === 'all' ? '全部' : status === 'online' ? '在线' : '离线'}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={nextAvailabilitySort}
                                    className={"hidden sm:flex glass-panel px-3.5 py-2 rounded-[14px] text-[11px] font-bold uppercase tracking-wider transition-all items-center gap-1.5 " + (availabilitySort === 'none' ? 'text-slate-500 hover:text-slate-700' : 'bg-white/80 text-slate-800 shadow-sm')}
                                    title="点击切换：默认排序 / 可用率升序 / 可用率降序"
                                >
                                    <Icons.BarChart3 className="w-3.5 h-3.5" />
                                    <span>排序</span>
                                    {availabilitySortArrow && <span className="text-sm leading-none">{availabilitySortArrow}</span>}
                                </button>
                                {/* 搜索框 */}
                                <div className="relative w-full sm:w-64">
                                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="搜索节点名称或地址..."
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
                                <h3 className="text-lg font-bold text-slate-700 mb-1">未找到匹配的节点</h3>
                                <p className="text-sm text-slate-500">尝试更换搜索词或清除筛选条件，或点击右上角添加新节点。</p>
                            </div>
                        )}

                        {/* Cards View */}
                        {activeTab === 'cards' && filteredServers.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredServers.map((s) => {
                                    const iconImg = getDisplayIcon(s);
                                    const isOnline = s.status === 'online';
                                    const stats = getAvailabilityStats(s);

                                    const statusColors = {
                                        online: { text: 'text-emerald-700', bg: 'bg-emerald-500/10', border: 'border-emerald-200', dotClass: 'dot-online', glowClass: 'glow-online' },
                                        offline: { text: 'text-rose-700', bg: 'bg-rose-500/10', border: 'border-rose-200', dotClass: 'dot-offline', glowClass: 'glow-offline' },
                                        updating: { text: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-200', dotClass: 'dot-updating', glowClass: 'bg-blue-400/20' },
                                    }[s.status] || { text: 'text-slate-600', bg: 'bg-slate-200/50', border: 'border-slate-200', dotClass: 'bg-slate-400', glowClass: 'bg-slate-300/20' };

                                    return (
                                        <div key={s.id} className="group glass-panel p-6 rounded-[2rem] transition-all duration-300 flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative overflow-hidden">

                                            {/* 高级卡片呼吸背光 */}
                                            <div className={"absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[50px] pointer-events-none " + statusColors.glowClass}></div>

                                            {/* Header Row */}
                                            <div className="flex justify-between items-start mb-6 relative z-10">
                                                <div className="flex gap-4 items-center">
                                                    <div onClick={() => setIconModalTarget(s.id)} className="w-14 h-14 rounded-[1.2rem] bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:shadow-md transition-shadow cursor-pointer overflow-hidden" title="点击更换图标">
                                                        {hideServerMeta ? <Icons.Server className="w-6 h-6" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className="w-full h-full object-contain p-2" onError={(e) => {e.target.style.display='none'}} /> : <span className="text-2xl font-black text-slate-700">{s.name ? s.name[0] : '?'}</span>)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-black text-xl text-slate-800 truncate tracking-tight">{hideServerMeta ? 'Node Hidden' : s.name}</h3>
                                                        <p className="text-[11px] text-slate-400 font-mono mt-1.5 font-semibold truncate bg-white/50 inline-block px-2 py-0.5 rounded-md border border-slate-100">{hideServerMeta ? 'https://****.****' : stripProtocol(s.url)}</p>
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
                                            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 bg-white/40 rounded-2xl p-4 border border-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
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
                                                <div className="mt-auto bg-white/50 rounded-2xl p-4 border border-white relative z-10 shadow-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">资源库较昨日变化</span>
                                                        {s.mediaStats.lastError && <span className="text-[10px] text-rose-500 font-bold" title={s.mediaStats.lastError}>更新失败</span>}
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

                                            {/* Footer */}
                                            <div className="mt-5 flex justify-between items-center text-[10px] text-slate-400 font-bold relative z-10">
                                                <div className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-white">
                                                    <Icons.Clock className="w-3 h-3" />
                                                    检测: {new Date(s.lastCheck).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditServerModal(s)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">编辑</button>
                                                    <button onClick={async () => {
                                                        if(confirm('彻底删除该节点?')) {
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
                            <div className="dashboard-shell rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none"></div>
                                {sortedServers.map((s) => {
                                    const iconImg = getDisplayIcon(s);
                                    const stats = getAvailabilityStats(s);
                                    return (
                                        <div key={s.id} className="dashboard-row bg-slate-50/82 hover:bg-white/90 p-4 sm:p-5 rounded-2xl border border-slate-200/70 transition-all grid grid-cols-1 lg:grid-cols-[minmax(220px,0.38fr)_minmax(0,1fr)] lg:items-center gap-5">
                                            <div className="flex items-center gap-4 sm:gap-5 min-w-0 relative">
                                                <div className={"absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-[15px] " + (s.status === 'online' ? 'glow-online' : s.status === 'offline' ? 'glow-offline' : 'bg-blue-400/20')}></div>
                                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-xl text-slate-600 z-10 overflow-hidden flex-shrink-0">
                                                    {hideServerMeta ? <Icons.Server className="w-5 h-5" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className="w-full h-full object-contain p-1.5" onError={(e) => {e.target.style.display='none'}} /> : s.name[0])}
                                                </div>
                                                <div className="z-10 min-w-0">
                                                    <div className="font-black text-slate-800 text-lg truncate tracking-tight">{hideServerMeta ? 'Node Hidden' : s.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-2">
                                                        <span className={"w-2 h-2 rounded-full flex-shrink-0 " + (s.status === 'online' ? 'dot-online' : s.status === 'offline' ? 'dot-offline' : 'dot-updating')}></span>
                                                        {stats.uptime}% 可用率 · {stats.offline} 次离线
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="status-chart-shell w-full min-w-0 min-h-[5.25rem] rounded-xl bg-slate-100/55 border border-slate-200/60 px-3 py-2 overflow-visible">
                                                <StatusBars history={s.history || []} currentStatus={s.status} currentLatency={s.latency} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* 专属设置弹窗 (Settings Modal) */}
                    {isSettingsOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)}></div>
                            <div className="relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
                                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                                    <Icons.X className="w-4 h-4" />
                                </button>
                                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <Icons.Settings className="w-6 h-6 text-blue-500" />系统设置
                                </h2>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {/* 程序更新 */}
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold"><Icons.DownloadCloud className="w-4 h-4 text-blue-500" />程序更新</div>
                                                <div className="text-xs font-bold text-slate-500">
                                                    当前版本: {updateInfo ? updateInfo.currentVersion : APP_VERSION}
                                                    {updateInfo && updateInfo.hasUpdate && <span className="ml-3 text-amber-500">发现新版本: {updateInfo.latestVersion}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => checkForUpdate(true)} disabled={isCheckingUpdate || isApplyingUpdate} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm">
                                                    {isCheckingUpdate ? '检查中...' : '检查更新'}
                                                </button>
                                                <button onClick={applyUpdate} disabled={!updateInfo || !updateInfo.hasUpdate || isApplyingUpdate} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all shadow-sm">
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

                                    {/* 视觉资产库 */}
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
                                            <Icons.ImageIcon className="w-4 h-4 text-purple-500" />视觉资产库 (JSON)
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" value={iconInput} onChange={e => setIconInput(e.target.value)} placeholder="https://example.com/icons.json" className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                                            <button onClick={handleSyncIcons} className="px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-200">拉取</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 添加/编辑节点弹窗 (Add Node Modal) */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                            <div className="relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
                                <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                                    <Icons.X className="w-4 h-4" />
                                </button>

                                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <Icons.Server className="w-6 h-6 text-emerald-500" />
                                    {editingServerId ? '编辑探针节点' : '部署新探针'}
                                </h2>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {/* 快捷导入 */}
                                    <div className="bg-white/60 p-4 rounded-3xl border border-white shadow-sm">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">快速粘贴解析</label>
                                        <textarea
                                            className="w-full h-20 glass-input p-3 rounded-2xl outline-none text-sm resize-none"
                                            placeholder="粘贴包含用户名、密码、线路的文本..."
                                            value={quickImportText}
                                            onChange={e=>applyQuickImportText(e.target.value)}
                                        />
                                    </div>

                                    {/* 基础配置 */}
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                                        <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold">
                                            <Icons.Link className="w-4 h-4 text-blue-500" />基础路由信息
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">节点标识 (别名)</label>
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

                                    {/* 媒体库配置 */}
                                    <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                <Icons.ShieldCheck className="w-4 h-4 text-purple-500" />启用媒体库资源统计
                                            </div>
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
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
                                </div>

                                <div className="mt-8">
                                    <button onClick={handleSaveServer} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2">
                                        {editingServerId ? '保存修改' : '确认部署'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 图标选择弹窗 */}
                    {iconModalTarget && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIconModalTarget(null)}></div>
                            <div className="relative w-full max-w-4xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 flex flex-col border border-white animate-in zoom-in-95 duration-200">
                                <button onClick={() => setIconModalTarget(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10">
                                    <Icons.X className="w-4 h-4" />
                                </button>
                                <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2"><Icons.ImageIcon className="w-6 h-6 text-purple-500" />视觉资产选择</h2>
                                <p className="text-xs text-slate-500 mb-6 font-bold">点击下方 Logo 为节点应用自定义图标。</p>

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
                                            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl">{key}</div>
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
  APP_VERSION: '2026.05.17.1',
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
              txt = txt.replace(/，/g, ',').replace(/“|”/g, '"').replace(/'/g, '"').replace(/,(\s*[}\\]])/g, '$1').trim();
              const parsedIcons = this.extractIcons(JSON.parse(txt));
              return this.json(parsedIcons);
          } catch(e) {
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
      if (!tg.enabled || !tg.botToken || !tg.chatId) return false;
      const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: tg.chatId, text, disable_web_page_preview: true })
          });
          return response.ok;
      } catch(e) {}
      return false;
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

  buildStatusMessage(server, previousStatus, nextStatus) {
      const historyStats = this.getRecentHistoryStats(server);
      const offlineDuration = this.formatNotifyDuration(server.offlineSince, server.lastCheck || Date.now());
      const checkedAt = this.formatNotifyTime(server.lastCheck);
      const maskedUrl = this.maskNotifyUrl(server.url);

      if (nextStatus === 'online') {
          return ['🟢 Emby 节点已恢复', '', '节点：' + server.name, '地址：' + maskedUrl, '状态：离线 -> 在线', '离线时长：' + offlineDuration, '恢复时间：' + checkedAt].join('\n');
      }
      return [
          '🔴 Emby 节点持续离线', '', '节点：' + server.name, '地址：' + maskedUrl, '状态：离线', '离线时长：已持续 ' + offlineDuration, '离线时间：' + this.formatNotifyTime(server.offlineSince), '',
          '近24小时：离线 ' + historyStats.offlineEvents + ' 次', '近期可用率：' + this.formatNotifyUptime(historyStats.uptime)
      ].join('\n');
  },

  json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); },

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

  canSelfUpdate(env) { return this.getMissingUpdateEnv(env).length === 0; },

  async fetchLatestWorkerSource(env) {
      const sourceUrl = this.getUpdateRawUrl(env);
      const response = await fetch(sourceUrl, { headers: { 'Accept': 'text/plain', 'User-Agent': 'Emby-Cluster-Monitor-Updater/' + this.APP_VERSION } });
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
      return text.length > 10000 && text.length < 5 * 1024 * 1024 && text.includes('Emby 集群探针') && text.includes('export default') && text.includes('HTML_CONTENT') && Boolean(this.extractAppVersion(text));
  },

  async deployWorkerSource(env, source) {
      const form = new FormData();
      form.append('metadata', JSON.stringify({ main_module: 'emby.js' }));
      form.append('emby.js', new Blob([source], { type: 'application/javascript+module' }), 'emby.js');

      const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(env.CF_ACCOUNT_ID) + '/workers/scripts/' + encodeURIComponent(env.CF_WORKER_NAME) + '/content';
      const response = await fetch(endpoint, { method: 'PUT', headers: { 'Authorization': 'Bearer ' + env.CF_API_TOKEN }, body: form });
      const detail = await response.text();
      if (!response.ok) throw new Error('Cloudflare deploy failed HTTP ' + response.status + (detail ? ': ' + detail.slice(0, 300) : ''));
      try {
          const parsed = JSON.parse(detail);
          if (parsed && parsed.success === false) throw new Error('Cloudflare deploy rejected: ' + JSON.stringify(parsed.errors || parsed.messages || parsed).slice(0, 300));
      } catch(e) { if (e.message && e.message.startsWith('Cloudflare deploy rejected')) throw e; }
      return detail;
  },

  async loadConfig(env) {
      const raw = await env.EMBY_DB.get('config');
      if (!raw) return this.withRevision({ servers: [], icons: {}, updatedAt: 0 });
      try { return this.withRevision(JSON.parse(raw)); } catch(e) { return this.withRevision({ servers: [], icons: {}, updatedAt: 0 }); }
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
          icons: clean.icons, telegram: clean.telegram,
          servers: clean.servers.map((server) => ({ id: server.id, name: server.name, url: server.url, customIcon: server.customIcon, mediaStats: { enabled: Boolean(server.mediaStats && server.mediaStats.enabled), username: server.mediaStats ? server.mediaStats.username : '', password: server.mediaStats ? server.mediaStats.password : '' } }))
      };
      const text = JSON.stringify(settingsOnly);
      let hash = 2166136261;
      for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
      return (hash >>> 0).toString(36);
  },

  sanitizeConfig(config) {
      const clean = { servers: [], icons: {}, telegram: { enabled: false, botToken: '', chatId: '' }, updatedAt: 0 };
      if (config && Number.isFinite(Number(config.updatedAt))) clean.updatedAt = Math.max(0, Number(config.updatedAt));
      if (config && config.telegram && typeof config.telegram === 'object') {
          clean.telegram = { enabled: Boolean(config.telegram.enabled), botToken: String(config.telegram.botToken || '').trim(), chatId: String(config.telegram.chatId || '').trim() };
      }
      if (config && Array.isArray(config.servers)) {
          clean.servers = config.servers
              .map((s) => {
                  const parsed = this.normalizeServerUrl(s && s.url);
                  if (!parsed) return null;
                  return {
                      id: s.id || Date.now(), name: String(s.name || parsed.hostname).slice(0, 80), url: parsed.toString().replace(/\/$/, ''), customIcon: typeof s.customIcon === 'string' ? s.customIcon : null,
                      status: ['online', 'offline', 'updating', 'unknown'].includes(s.status) ? s.status : 'unknown',
                      totalChecks: Number.isFinite(Number(s.totalChecks)) ? Math.max(0, Number(s.totalChecks)) : 0, successfulChecks: Number.isFinite(Number(s.successfulChecks)) ? Math.max(0, Number(s.successfulChecks)) : 0,
                      uptime: typeof s.uptime === 'string' ? s.uptime : '0.0', latency: Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0,
                      lastCheck: Number.isFinite(Number(s.lastCheck)) ? Number(s.lastCheck) : 0, offlineSince: Number.isFinite(Number(s.offlineSince)) ? Math.max(0, Number(s.offlineSince)) : 0,
                      offlineAlertSentAt: Number.isFinite(Number(s.offlineAlertSentAt)) ? Math.max(0, Number(s.offlineAlertSentAt)) : 0,
                      history: this.normalizeHistory(s.history, s.lastCheck), mediaStats: this.normalizeMediaStats(s.mediaStats)
                  };
              })
              .filter(Boolean);
      }
      if (config && config.icons && typeof config.icons === 'object' && !Array.isArray(config.icons)) clean.icons = this.extractIcons(config.icons);
      return clean;
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
      if (!mediaStats || typeof mediaStats !== 'object') {
          return { enabled: false, username: '', password: '', accessToken: '', deviceId: '', lastCheck: 0, lastError: '', counts: null, previousCounts: null, delta24h: null, todayCounts: null, yesterdayCounts: null, dailyDelta: null, dailyKey: '' };
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
          enabled: Boolean(mediaStats.enabled), username: String(mediaStats.username || '').slice(0, 120), password: String(mediaStats.password || ''), accessToken: String(mediaStats.accessToken || ''),
          deviceId: String(mediaStats.deviceId || ('forward-' + Math.random().toString(36).slice(2))).slice(0, 120), lastCheck: Number.isFinite(Number(mediaStats.lastCheck)) ? Number(mediaStats.lastCheck) : 0,
          lastError: String(mediaStats.lastError || '').slice(0, 160), counts: cleanCounts(mediaStats.counts), previousCounts: cleanCounts(mediaStats.previousCounts), delta24h: cleanDeltaCounts(mediaStats.delta24h),
          todayCounts: cleanCounts(mediaStats.todayCounts), yesterdayCounts: cleanCounts(mediaStats.yesterdayCounts), dailyDelta: cleanDeltaCounts(mediaStats.dailyDelta), dailyKey: String(mediaStats.dailyKey || '')
      };
      if (!clean.dailyDelta && clean.counts && clean.previousCounts) {
          clean.dailyDelta = { movie: clean.counts.movie - clean.previousCounts.movie, series: clean.counts.series - clean.previousCounts.series, episode: clean.counts.episode - clean.previousCounts.episode, time: clean.counts.time };
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
      if (server.status === 'online') { server.offlineSince = 0; server.offlineAlertSentAt = 0; }
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
          const base = String(key || '图标').replace(/\.(png|jpe?g|webp|gif|svg|ico)$/i, '').replace(/[?#].*$/, '').trim().slice(0, 80) || '图标';
          let finalKey = base;
          let count = 2;
          while (Object.prototype.hasOwnProperty.call(icons, finalKey)) { finalKey = base.slice(0, 72) + '_' + count; count += 1; }
          return finalKey;
      };
      const isImageLikeUrl = (iconUrl, key) => {
          const pathname = iconUrl.pathname.toLowerCase(); const search = iconUrl.search.toLowerCase(); const keyText = String(key || '').toLowerCase();
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
          if (typeof value === 'string') { addIcon(keyHint, value); return; }
          if (Array.isArray(value)) { value.forEach((item, index) => walk(item, keyHint || ('图标_' + (index + 1)))); return; }
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
          if (host === 'localhost' || host.endsWith('.localhost') || host === 'metadata.google.internal' || host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === '0.0.0.0' || host === '::1' || host.startsWith('169.254.')) return null;
          parsed.hash = ''; return parsed;
      } catch(e) { return null; }
  },

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
              if (data.AccessToken) return data.AccessToken;
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
      const loginProbe = await this.verifyWithLoginState(server);
      if (loginProbe && loginProbe.ok) return loginProbe;

      const headers = { 'Accept': 'application/json,text/plain,*/*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' };
      const paths = ['/emby/System/Info/Public', '/System/Info/Public', '/emby/Users/Public', '/emby/web/index.html', '/web/index.html'];
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
              ...media, accessToken: token, previousCounts: previous, counts, todayCounts: dailyStats.todayCounts, yesterdayCounts: dailyStats.yesterdayCounts, dailyDelta: dailyStats.dailyDelta, dailyKey: dailyStats.dailyKey,
              delta24h: previous ? { movie: counts.movie - previous.movie, series: counts.series - previous.series, episode: counts.episode - previous.episode, time: counts.time } : { movie: 0, series: 0, episode: 0, time: counts.time },
              lastCheck: counts.time, lastError: ''
          };
      } catch(e) { server.mediaStats = { ...media, lastError: e.message || '媒体库统计失败' }; }
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
              s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
              if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
              s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
              s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
              await this.refreshMediaStatsIfNeeded(s, !s.mediaStats || !s.mediaStats.lastCheck);
              s.previousStatus = previousStatus; return s;
          }
          const targetUrl = target.toString().replace(/\/$/, '');

          let isAlive = false;
          let finalLatency = 0;

          try {
              const result = await this.probeEmbyServer(s, targetUrl);
              isAlive = result.ok; finalLatency = result.latency;
          } catch(e) { isAlive = false; }

          if (isAlive) {
              s.successfulChecks = (s.successfulChecks || 0) + 1; s.status = 'online'; s.latency = finalLatency; s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
          } else {
              s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
          }

          if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
          s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
          s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
          await this.refreshMediaStatsIfNeeded(s, !s.mediaStats || !s.mediaStats.lastCheck);
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
              const mergedServer = { ...latest, status: probed.status, totalChecks: probed.totalChecks, successfulChecks: probed.successfulChecks, uptime: probed.uptime, latency: probed.latency, lastCheck: probed.lastCheck, offlineSince: probed.offlineSince, offlineAlertSentAt: probed.offlineAlertSentAt, history: probed.history, mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats };
              const oldStatus = previouslySaved.url === latest.url ? previouslySaved.status : probed.previousStatus;
              if (this.isTelegramEnabled(env, baseConfig) && oldStatus === 'offline' && mergedServer.status === 'offline' && this.shouldSendOfflineAlert(mergedServer)) {
                  notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
              } else if (this.isTelegramEnabled(env, baseConfig) && oldStatus === 'offline' && mergedServer.status === 'online' && previouslySaved.offlineAlertSentAt) {
                  notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: previouslySaved.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
              }
              return mergedServer;
          })
      };
      const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(env, item.message, baseConfig)));
      if (notifyQueue.length) {
          let updated = false;
          for (const [index, ok] of sendResults.entries()) {
              const item = notifyQueue[index];
              if (!ok || !item || item.kind !== 'offline') continue;
              const targetId = item.serverId;
              const targetServer = mergedConfig.servers.find((server) => server.id === targetId);
              if (targetServer) {
                  targetServer.offlineAlertSentAt = item.lastCheck;
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
};
