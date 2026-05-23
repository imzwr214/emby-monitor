/*
 * 前端内置 SVG 图标。
 *
 * 负责 Icon 基础组件和 Icons 图标集合。后续只改图标路径或新增内置图标时看这里。
 */
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
    Glasses: (p) => <Icon {...p} path='<circle cx="6" cy="15" r="4"></circle><circle cx="18" cy="15" r="4"></circle><path d="M10 15h4"></path><path d="M2.5 13 5 5"></path><path d="M21.5 13 19 5"></path>' />,
    RefreshCw: (p) => <Icon {...p} path='<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>' />,
    Film: (p) => <Icon {...p} path='<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>' />,
    Tv: (p) => <Icon {...p} path='<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>' />,
    PlaySquare: (p) => <Icon {...p} path='<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><polygon points="10 8 16 12 10 16 10 8"></polygon>' />,
    AlertCircle: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' />,
    LayoutGrid: (p) => <Icon {...p} path='<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' />,
    BarChart3: (p) => <Icon {...p} path='<path d="M3 3v18h18"></path><rect x="18" y="13" width="4" height="8"></rect><rect x="12" y="5" width="4" height="16"></rect><rect x="6" y="9" width="4" height="12"></rect>' />,
    TrendingUp: (p) => <Icon {...p} path='<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>' />,
    CheckCircle2: (p) => <Icon {...p} path='<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' />,
    XCircle: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' />,
    Clock: (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>' />,
    ClockOff: (p) => <Icon {...p} path='<path d="M21 12a9 9 0 0 0-9-9 8.8 8.8 0 0 0-4 1"></path><path d="M3 3l18 18"></path><path d="M3.6 8A9 9 0 0 0 12 21a8.8 8.8 0 0 0 4-1"></path><path d="M12 7v5l2 2"></path>' />,
    Cloud: (p) => <Icon {...p} path='<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>' />,
    X: (p) => <Icon {...p} path='<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' />,
    Copy: (p) => <Icon {...p} path='<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' />,
    Share2: (p) => <Icon {...p} path='<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>' />,
    Trash2: (p) => <Icon {...p} path='<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' />,
    ExternalLink: (p) => <Icon {...p} path='<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>' />,
    MessageSquare: (p) => <Icon {...p} path='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' />,
    ImageIcon: (p) => <Icon {...p} path='<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>' />,
    Search: (p) => <Icon {...p} path='<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' />,
    Link: (p) => <Icon {...p} path='<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' />,
    ShieldCheck: (p) => <Icon {...p} path='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>' />,
    DownloadCloud: (p) => <Icon {...p} path='<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>' />
};
