import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Cloud,
  Eye,
  EyeOff,
  Filter,
  Film,
  LayoutGrid,
  Link,
  MessageSquare,
  Plus,
  PlaySquare,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Tv,
  X,
  XCircle
} from 'lucide-react';

const styles = `
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
  .dot-online { background-color: #10b981; animation: breath-dot-online 2.5s ease-in-out infinite; }
  .dot-offline { background-color: #f43f5e; animation: breath-dot-offline 2s ease-in-out infinite; }
  .dot-updating { background-color: #3b82f6; animation: pulse 1.5s infinite; }
  .glow-online { background-color: #10b981; animation: breath-glow-online 2.5s ease-in-out infinite; }
  .glow-offline { background-color: #f43f5e; animation: breath-glow-offline 2s ease-in-out infinite; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1);
  }
  .glass-input {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.2s ease;
  }
  .glass-input:focus {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const MOCK_SERVERS = [
  {
    id: 1,
    name: 'Singapore Main',
    url: 'https://sg.emby.example.com',
    status: 'online',
    availability: { uptime: '99.9', offline: 0 },
    lastCheck: Date.now() - 60000,
    mediaStats: { enabled: true, counts: { movie: 1250, series: 230, episode: 8500 }, dailyDelta: { movie: 12, series: 2, episode: 24 }, lastError: '' },
    history: Array(60).fill(1).map(() => (Math.random() > 0.05 ? 1 : 0))
  },
  {
    id: 2,
    name: 'US West Backup',
    url: 'https://usw.emby.example.com',
    status: 'online',
    availability: { uptime: '98.5', offline: 2 },
    lastCheck: Date.now() - 120000,
    mediaStats: { enabled: true, counts: { movie: 1100, series: 200, episode: 7800 }, dailyDelta: { movie: 0, series: 0, episode: 0 }, lastError: '' },
    history: Array(60).fill(1).map(() => (Math.random() > 0.1 ? 1 : 0))
  },
  {
    id: 3,
    name: 'Home NAS (Offline)',
    url: 'https://home.dyn.example.com',
    status: 'offline',
    availability: { uptime: '85.0', offline: 14 },
    lastCheck: Date.now() - 300000,
    mediaStats: { enabled: false },
    history: Array(60).fill(0).map((_, i) => (i < 25 ? 1 : 0))
  },
  {
    id: 4,
    name: 'JP Node (Updating)',
    url: 'https://jp.emby.example.com',
    status: 'updating',
    availability: { uptime: '99.1', offline: 1 },
    lastCheck: Date.now() - 10000,
    mediaStats: { enabled: true, counts: { movie: 520, series: 85, episode: 3100 }, dailyDelta: { movie: 5, series: 1, episode: 10 }, lastError: '' },
    history: Array(60).fill(1)
  }
];

const StatusBars = ({ history = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxBars = 60;
  const padded = [...Array(Math.max(0, maxBars - history.length)).fill(null), ...history].slice(-maxBars);

  return (
    <div className="flex flex-col items-end w-full">
      <div className="flex items-end h-10 gap-[3px] w-full pt-2 overflow-visible">
        {padded.map((val, i) => {
          const isOnline = val === 1;
          const isOffline = val === 0;
          const isNull = val === null;
          let bgColor = 'bg-slate-200';
          let heightClass = 'h-[30%]';
          if (isOnline) {
            bgColor = 'bg-emerald-400 hover:bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
            heightClass = 'h-full';
          } else if (isOffline) {
            bgColor = 'bg-rose-400 hover:bg-rose-500 shadow-[0_0_8px_rgba(251,113,133,0.3)]';
            heightClass = 'h-[50%]';
          }
          const isHovered = hoveredIndex === i;
          const hoverStyle = isHovered ? { transform: 'scaleY(1.2)', zIndex: 10 } : { transform: 'scaleY(1)', zIndex: 1 };

          return (
            <div
              key={i}
              className="relative flex-1 flex flex-col justify-end group cursor-crosshair overflow-visible"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && !isNull && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap text-slate-700 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'dot-online' : 'dot-offline'}`} />
                    {isOnline ? '在线' : '离线'} · {60 - i} 分钟前
                  </div>
                </div>
              )}
              <div
                className={`w-full rounded-full transition-all duration-200 origin-bottom ${bgColor} ${heightClass} ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                style={hoverStyle}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between w-full text-[10px] text-slate-400 mt-2 font-semibold px-0.5 tracking-wider uppercase">
        <span>一小时前</span>
        <span>现在</span>
      </div>
    </div>
  );
};

export default function EmbyDashboardPreview() {
  const [servers, setServers] = useState(MOCK_SERVERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const [hideServerMeta, setHideServerMeta] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const handlePing = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const onlineCount = servers.filter((s) => s.status === 'online').length;
  const offlineCount = servers.filter((s) => s.status === 'offline').length;
  const avgUptime = servers.length > 0 ? (servers.reduce((acc, s) => acc + parseFloat(s.availability.uptime), 0) / servers.length).toFixed(1) : '0.0';

  const filteredServers = useMemo(() => {
    return servers.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [servers, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-600 font-sans selection:bg-blue-500/20 relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply" />
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-300/20 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-multiply" />

      <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
              <div className="glass-panel p-2.5 rounded-2xl shadow-sm">
                <Cloud className="w-8 h-8 text-blue-500 drop-shadow-sm" />
              </div>
              CLUSTER DASHBOARD
            </h1>
            <p className="text-[11px] text-slate-500 font-bold tracking-widest mt-3 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full dot-online" />
              高可用探针监控网络
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => setHideServerMeta(!hideServerMeta)}
                title={hideServerMeta ? '显示节点信息' : '隐藏敏感信息'}
                className={`w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm ${
                  hideServerMeta ? 'bg-slate-200 text-slate-700 shadow-inner' : 'glass-panel text-slate-500 hover:text-slate-800 hover:bg-white/80'
                }`}
              >
                {hideServerMeta ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="系统设置"
                className="w-11 h-11 rounded-[14px] glass-panel text-slate-500 hover:text-blue-600 hover:bg-white/80 transition-all flex items-center justify-center shadow-sm"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsAddNodeOpen(true)}
              className="px-5 py-2.5 h-11 bg-slate-800 hover:bg-slate-900 text-white rounded-[14px] text-sm font-bold shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 添加节点
            </button>
            <button
              onClick={handlePing}
              disabled={isRefreshing}
              className="px-6 py-2.5 h-11 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 rounded-[14px] text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '正在刷新...' : '刷新状态'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: '在线节点', value: `${onlineCount}/${servers.length}`, icon: CheckCircle2, color: 'text-emerald-500', glow: 'glow-online' },
            { label: '当前离线', value: offlineCount, icon: XCircle, color: 'text-rose-500', glow: 'glow-offline' },
            { label: '整体可用率', value: `${avgUptime}%`, icon: BarChart3, color: 'text-blue-500', glow: 'bg-blue-500/20' },
            { label: '报警通知', value: '已开启', icon: AlertCircle, color: 'text-purple-500', glow: 'bg-purple-500/20' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl ${item.glow}`} />
              <div className={`w-12 h-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center ${item.color} shadow-sm relative z-10`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex glass-panel p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid className="w-4 h-4" /> 看板
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity className="w-4 h-4" /> 历史大盘
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex glass-panel p-1.5 rounded-[14px]">
              {['all', 'online', 'offline'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status === 'all' ? '全部' : status === 'online' ? '在线' : '离线'}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

        {filteredServers.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">未找到匹配的节点</h3>
            <p className="text-sm text-slate-500">尝试更换搜索词或清除筛选条件</p>
          </div>
        )}

        {activeTab === 'cards' && filteredServers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServers.map((s) => {
              const isOnline = s.status === 'online';
              const statusColors = {
                online: { text: 'text-emerald-700', bg: 'bg-emerald-500/10', border: 'border-emerald-200', dotClass: 'dot-online', glowClass: 'glow-online' },
                offline: { text: 'text-rose-700', bg: 'bg-rose-500/10', border: 'border-rose-200', dotClass: 'dot-offline', glowClass: 'glow-offline' },
                updating: { text: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-200', dotClass: 'dot-updating', glowClass: 'bg-blue-400/20' }
              }[s.status] || { text: 'text-slate-600', bg: 'bg-slate-200/50', border: 'border-slate-200', dotClass: 'bg-slate-400', glowClass: 'bg-slate-300/20' };

              return (
                <div key={s.id} className="group glass-panel p-6 rounded-[2rem] transition-all duration-300 flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative overflow-hidden">
                  <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[50px] ${statusColors.glowClass} pointer-events-none`} />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-[1.2rem] bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:shadow-md transition-shadow">
                        {hideServerMeta ? <Server className="w-6 h-6" /> : <span className="text-2xl font-black text-slate-700">{s.name[0]}</span>}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-xl text-slate-800 truncate tracking-tight">{hideServerMeta ? 'Node Hidden' : s.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-1.5 font-semibold truncate bg-white/50 inline-block px-2 py-0.5 rounded-md border border-slate-100">{hideServerMeta ? 'https://****.****' : s.url}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusColors.border} ${statusColors.bg} bg-white/50 backdrop-blur-sm shadow-sm`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${statusColors.dotClass}`} />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${statusColors.text}`}>
                        {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 bg-white/40 rounded-2xl p-4 border border-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                    <div className="text-center relative">
                      <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1">7天可用率</div>
                      <div className="flex justify-center items-baseline gap-1">
                        <span className={`text-3xl font-black tracking-tighter ${parseFloat(s.availability.uptime) > 95 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.availability.uptime}</span>
                        <span className="text-sm text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    <div className="text-center relative">
                      <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200/60" />
                      <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1">7天离线</div>
                      <div className="flex justify-center items-baseline gap-1">
                        <span className={`text-3xl font-black tracking-tighter ${s.availability.offline === 0 ? 'text-slate-400' : 'text-rose-500'}`}>{s.availability.offline}</span>
                        <span className="text-sm text-slate-400 font-bold">次</span>
                      </div>
                    </div>
                  </div>

                  {s.mediaStats?.enabled && (
                    <div className="mt-auto bg-white/50 rounded-2xl p-4 border border-white relative z-10 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">资源库增量 (24H)</span>
                        {s.mediaStats.lastError && <span className="text-[10px] text-rose-500 font-bold">更新失败</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 divide-x divide-slate-200/60">
                        {[
                          { label: '电影', icon: Film, val: s.mediaStats.counts?.movie, delta: s.mediaStats.dailyDelta?.movie },
                          { label: '剧集', icon: Tv, val: s.mediaStats.counts?.series, delta: s.mediaStats.dailyDelta?.series },
                          { label: '单集', icon: PlaySquare, val: s.mediaStats.counts?.episode, delta: s.mediaStats.dailyDelta?.episode }
                        ].map((stat, i) => (
                          <div key={i} className="flex flex-col items-center justify-center px-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                              <stat.icon className="w-3.5 h-3.5" />
                              <span>{stat.label}</span>
                            </div>
                            <div className="flex items-end gap-1.5">
                              <span className="text-base font-black text-slate-700 tracking-tight">{stat.val || '--'}</span>
                              {stat.delta > 0 && <span className="text-[11px] font-black text-emerald-500">+{stat.delta}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex justify-between items-center text-[10px] text-slate-400 font-bold relative z-10">
                    <div className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-white">
                      <Clock className="w-3 h-3" />
                      最近检测: {new Date(s.lastCheck).toLocaleTimeString()}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">编辑</button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">删除</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'dashboard' && filteredServers.length > 0 && (
          <div className="glass-panel rounded-[2rem] p-5 flex flex-col gap-4 shadow-sm">
            {filteredServers.map((s) => (
              <div key={s.id} className="bg-white/60 hover:bg-white p-5 rounded-2xl border border-white transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-sm">
                <div className="flex items-center gap-5 w-full lg:w-1/3 relative">
                  <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-[15px] ${s.status === 'online' ? 'glow-online' : s.status === 'offline' ? 'glow-offline' : 'bg-blue-400/20'}`} />
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-xl text-slate-600 z-10">
                    {hideServerMeta ? <Server className="w-5 h-5" /> : s.name[0]}
                  </div>
                  <div className="z-10">
                    <div className="font-black text-slate-800 text-lg truncate tracking-tight">{hideServerMeta ? 'Node Hidden' : s.name}</div>
                    <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.status === 'online' ? 'dot-online' : s.status === 'offline' ? 'dot-offline' : 'dot-updating'}`} />
                      {s.availability.uptime}% 可用率 · {s.availability.offline} 次离线
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-14">
                  <StatusBars history={s.history} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-500" />系统设置
            </h2>
            <div className="space-y-6">
              <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />通知配置 (Telegram)
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Bot Token</label>
                    <input type="password" placeholder="123456:ABC-DEF1234..." className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Chat ID</label>
                    <input type="text" placeholder="填写接收通知的 Chat ID" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />视觉资产库
                </div>
                <div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="https://example.com/icons.json" className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                    <button className="px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors">拉取</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsSettingsOpen(false)} className="px-6 py-3 rounded-[14px] text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={() => setIsSettingsOpen(false)} className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-[14px] text-sm font-bold shadow-md transition-all">保存配置</button>
            </div>
          </div>
        </div>
      )}

      {isAddNodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsAddNodeOpen(false)} />
          <div className="relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAddNodeOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Server className="w-6 h-6 text-emerald-500" />
              部署新探针
            </h2>
            <div className="space-y-6">
              <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold">
                  <Link className="w-4 h-4 text-blue-500" />节点地址
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">节点标识 (别名)</label>
                  <input type="text" placeholder="例如：US West Main" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div className="grid grid-cols-[1fr_90px] gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">服务器域名 / IP</label>
                    <input type="text" placeholder="emby.example.com" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">端口</label>
                    <input type="text" placeholder="443" defaultValue="443" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-center outline-none" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />启用媒体库资源统计
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Emby 用户名</label>
                    <input type="text" placeholder="Admin" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Emby 密码</label>
                    <input type="password" placeholder="••••••••" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => setIsAddNodeOpen(false)}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2"
              >
                确认部署
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
