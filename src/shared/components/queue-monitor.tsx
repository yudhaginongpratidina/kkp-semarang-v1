import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';

/**
 * =========================================================
 * TYPES
 * =========================================================
 */

export type ServiceType =
    | 'smkhp-offline'
    | 'smkhp-online'
    | 'customer-service-offline'
    | 'customer-service-online'
    | 'laboratorium-umum'
    | 'laboratorium-official';

export type QueueStatus = 'Menunggu' | 'Diproses' | 'Dipanggil';

export type QueueItem = {
    id: string;
    queueNo: number;
    userName: string;
    serviceType: ServiceType;
    status: QueueStatus;
};

type ServiceDataMap = Partial<Record<ServiceType, QueueItem[]>>;

type Props = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: ServiceDataMap;
    defaultFilter?: ServiceType | 'ALL';
    onItemClick?: (item: QueueItem) => void;
};

/**
 * =========================================================
 * CONFIG
 * =========================================================
 */

const SERVICE_CONFIG: Record<
    ServiceType,
    { prefix: string; label: string; icon: React.ReactNode }
> = {
    'smkhp-offline': {
        prefix: 'A',
        label: 'SMKHP Offline',
        icon: <span className="text-xs font-black">A</span>,
    },
    'smkhp-online': {
        prefix: 'A',
        label: 'SMKHP Online',
        icon: <span className="text-xs font-black">A</span>,
    },
    'customer-service-offline': {
        prefix: 'C',
        label: 'CS Offline',
        icon: <span className="text-xs font-black">C</span>,
    },
    'customer-service-online': {
        prefix: 'C',
        label: 'CS Online',
        icon: <span className="text-xs font-black">C</span>,
    },
    'laboratorium-umum': {
        prefix: 'B',
        label: 'Lab Umum',
        icon: <span className="text-xs font-black">B</span>,
    },
    'laboratorium-official': {
        prefix: 'B',
        label: 'Lab Official',
        icon: <span className="text-xs font-black">B</span>,
    },
};

/**
 * =========================================================
 * UTILS
 * =========================================================
 */

const formatQueue = (type: ServiceType, num?: number) => {
    const prefix = SERVICE_CONFIG[type]?.prefix ?? '';
    return `${prefix}${String(num ?? 0).padStart(3, '0')}`;
};

/**
 * =========================================================
 * VARIANTS
 * =========================================================
 */

const filterVariants = cva(
    'px-3 py-2 text-[10px] font-black uppercase border rounded-sm transition-all',
    {
        variants: {
            active: {
                true: 'bg-black text-white border-black',
                false: 'bg-white text-black border-slate-300 hover:border-black',
            },
        },
    },
);

const statusVariants = cva(
    'text-[10px] font-bold uppercase px-2 py-1 rounded-sm border',
    {
        variants: {
            status: {
                Menunggu: 'bg-white text-black border-slate-200',
                Diproses: 'bg-black text-white border-black',
                Dipanggil: 'bg-white text-black border-slate-300',
            },
        },
    },
);

/**
 * =========================================================
 * ANIMATION
 * =========================================================
 */

const containerMotion = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const itemMotion = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
};

/**
 * =========================================================
 * SUB COMPONENTS
 * =========================================================
 */

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <motion.div
            variants={itemMotion}
            className="bg-white border border-slate-200 rounded-sm p-3"
        >
            <p className="text-[10px] font-bold uppercase text-slate-400">
                {label}
            </p>
            <p className="text-xl font-black text-black mt-1">{value}</p>
        </motion.div>
    );
}

function ServiceCard({
    type,
    current,
}: {
    type: ServiceType;
    current?: QueueItem;
}) {
    const config = SERVICE_CONFIG[type];

    return (
        <motion.div
            variants={itemMotion}
            className="bg-white border border-slate-200 rounded-sm p-4"
        >
            <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                    {config.label}
                </span>
                {config.icon}
            </div>

            <div className="text-3xl font-black text-black">
                {current ? formatQueue(type, current.queueNo) : '---'}
            </div>

            <p className="text-xs text-slate-400 truncate">
                {current?.userName ?? 'Menunggu...'}
            </p>
        </motion.div>
    );
}

function FeedItem({
    item,
    onClick,
}: {
    item: QueueItem;
    onClick?: () => void;
}) {
    return (
        <motion.div
            layout
            variants={itemMotion}
            onClick={onClick}
            className="bg-white border border-slate-200 rounded-sm px-4 py-3 flex justify-between items-center cursor-pointer hover:border-black transition-all"
        >
            <div>
                <div className="text-lg font-black text-black">
                    {formatQueue(item.serviceType, item.queueNo)}
                </div>
                <div className="text-xs text-slate-400">{item.userName}</div>
            </div>

            <span
                className={statusVariants({
                    status: item.status as QueueStatus,
                })}
            >
                {item.status}
            </span>
        </motion.div>
    );
}

/**
 * =========================================================
 * MAIN COMPONENT
 * =========================================================
 */

export default function QueueMonitor({
    data,
    defaultFilter = 'ALL',
    onItemClick,
    className,
    ...rest
}: Props) {
    const [filter, setFilter] = React.useState<ServiceType | 'ALL'>(
        defaultFilter,
    );

    const allItems = React.useMemo(() => {
        return Object.values(data).filter(Boolean).flat() as QueueItem[];
    }, [data]);

    const filteredItems = React.useMemo(() => {
        if (filter === 'ALL') return allItems;
        return allItems.filter((i) => i.serviceType === filter);
    }, [allItems, filter]);

    const processingMap = React.useMemo(() => {
        const map: Partial<Record<ServiceType, QueueItem>> = {};
        allItems.forEach((item) => {
            if (item.status === 'Diproses') {
                map[item.serviceType] = item;
            }
        });
        return map;
    }, [allItems]);

    const stats = React.useMemo(() => {
        return {
            total: allItems.length,
            waiting: allItems.filter((i) => i.status === 'Menunggu').length,
            processing: allItems.filter((i) => i.status === 'Diproses').length,
            called: allItems.filter((i) => i.status === 'Dipanggil').length,
        };
    }, [allItems]);

    const filters: (ServiceType | 'ALL')[] = [
        'ALL',
        ...(Object.keys(SERVICE_CONFIG) as ServiceType[]),
    ];

    return (
        <div
            className={`w-full min-h-screen bg-slate-100 text-black p-6 flex flex-col gap-6 ${
                className ?? ''
            }`}
            {...rest}
        >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-lg font-black uppercase">
                        Queue Monitor
                    </h1>
                    <p className="text-xs text-slate-400">Sistem Antrian</p>
                </div>
            </div>

            {/* STATS */}
            <motion.div
                className="grid grid-cols-4 gap-2"
                variants={containerMotion}
                initial="hidden"
                animate="show"
            >
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Menunggu" value={stats.waiting} />
                <StatCard label="Diproses" value={stats.processing} />
                <StatCard label="Dipanggil" value={stats.called} />
            </motion.div>

            {/* FILTER */}
            <div className="flex flex-wrap gap-2">
                {filters.map((key) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={filterVariants({
                            active: filter === key,
                        })}
                    >
                        {key === 'ALL' ? 'SEMUA' : SERVICE_CONFIG[key]?.label}
                    </button>
                ))}
            </div>

            {/* CURRENT */}
            <div className="grid grid-cols-3 gap-3">
                {(Object.keys(SERVICE_CONFIG) as ServiceType[]).map((type) => (
                    <ServiceCard
                        key={type}
                        type={type}
                        current={processingMap[type]}
                    />
                ))}
            </div>

            {/* LIST */}
            <motion.div
                className="flex flex-col gap-2"
                variants={containerMotion}
                initial="hidden"
                animate="show"
            >
                <AnimatePresence mode="popLayout">
                    {filteredItems.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="text-center text-sm text-slate-400 py-10"
                        >
                            Tidak ada data
                        </motion.div>
                    ) : (
                        filteredItems.map((item) => (
                            <FeedItem
                                key={item.id}
                                item={item}
                                onClick={() => onItemClick?.(item)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
