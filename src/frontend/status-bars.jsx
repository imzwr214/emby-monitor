/*
 * 历史状态条组件。
 *
 * 负责服务器在线历史、当前状态和延迟的条形展示。后续改历史展示样式或 Tooltip 文案时看这里。
 */
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
