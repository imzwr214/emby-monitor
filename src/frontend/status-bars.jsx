/*
 * 历史状态条组件。
 *
 * 专业 Uptime 时间分片状态柱：固定高度、等宽切片，绿色代表可用，红色代表离线。
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
            if (normalized[index].status !== null || normalized[index - 1].status === null) continue;
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

    const getHistoryTitle = (item) => {
        if (!item || item.status === null) return '暂无记录 - ' + formatHistoryTime(item && item.time);
        const status = item.status === 'online' ? '在线' : '离线';
        return formatHistoryTime(item.time) + ' · ' + status;
    };

    const getTooltipPosition = (index) => {
        if (index > maxBars - 8) return 'right-0';
        if (index < 8) return 'left-0';
        return 'left-1/2 -translate-x-1/2';
    };

    const updateTouchHover = (event) => {
        const touch = event.touches && event.touches[0] ? event.touches[0] : null;
        const container = event.currentTarget;
        if (!touch || !container) return;
        const rect = container.getBoundingClientRect();
        if (!rect.width) return;
        const ratio = Math.min(0.999, Math.max(0, (touch.clientX - rect.left) / rect.width));
        setHoveredIndex(Math.min(maxBars - 1, Math.max(0, Math.floor(ratio * maxBars))));
    };

    return (
        <div
            data-status-bars
            className="flex items-center gap-[3px] h-9 w-full overflow-visible touch-pan-y"
            onTouchStart={updateTouchHover}
            onTouchMove={updateTouchHover}
            onTouchEnd={() => setHoveredIndex(null)}
            onTouchCancel={() => setHoveredIndex(null)}
        >
            {buckets.map((item, index) => {
                const isOnline = item.status === 'online';
                const isOffline = item.status === 'offline';
                const color = isOnline ? 'bg-emerald-500' : isOffline ? 'bg-rose-500' : 'bg-slate-200/70';
                return (
                    <div
                        key={index}
                        className={"flex-1 h-full rounded-[3px] opacity-85 hover:opacity-100 hover:scale-y-110 transition-all cursor-crosshair group relative origin-bottom " + color}
                        title={getHistoryTitle(item)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className={"absolute bottom-full mb-2 px-2 py-1 rounded-md bg-slate-950/90 text-[10px] text-white font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all duration-150 " + getTooltipPosition(index) + " " + (hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>
                            {getHistoryTitle(item)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
