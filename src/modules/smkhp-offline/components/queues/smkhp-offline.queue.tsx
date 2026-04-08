import * as React from 'react';
import { cva } from 'class-variance-authority';

import { ItemQueue, Modal } from '../../../../shared/components';
import SMKHPOfflineForm from '../forms/smkhp-offline.form';

import useSMKHPOfflineStore, { type SMKHPData } from '../../store';

/**
 * =========================================================
 * TYPES
 * =========================================================
 */

type QueueStatus = 'Pending' | 'Menunggu' | 'Diproses';

// Sesuai dengan interface SMKHPData dari store
type QueueItem = {
    token: string;
    queue: number;
    name: string;
    phone: string;
    status: QueueStatus;
};

type SMKHPOfflineQueueListProps = Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'children'
> & {
    data: SMKHPData[]; // Gunakan tipe data dari Firebase
    defaultFilter?: QueueStatus | 'All';
};

/**
 * =========================================================
 * NORMALIZER
 * =========================================================
 */

const normalizeStatus = (status: string): QueueStatus => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'Pending';
        case 'menunggu':
        case 'waiting':
            return 'Menunggu';
        case 'diproses':
        case 'dipanggil':
        case 'processing':
            return 'Diproses';
        default:
            return 'Pending';
    }
};

const filterButtonVariants = cva(
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

/**
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function SMKHPOfflineQueue(props: SMKHPOfflineQueueListProps) {
    const { data, defaultFilter = 'All', className, ...rest } = props;

    // Ambil aksi dari store
    const { updateSMKHPStatus } = useSMKHPOfflineStore();

    /**
     * 🔥 MAPPING DATA FIREBASE KE UI
     */
    const safeData: QueueItem[] = React.useMemo(() => {
        return data.map((item) => ({
            token: item.token,
            queue: item.queueNo, // Firebase: queueNo
            name: item.userName, // Firebase: userName
            phone: item.nomorHp, // Firebase: nomorHp
            status: normalizeStatus(item.subStatus || 'Pending'), // Firebase: subStatus
        }));
    }, [data]);

    const [filter, setFilter] = React.useState<QueueStatus | 'All'>(
        defaultFilter,
    );

    const filteredData = React.useMemo(() => {
        if (filter === 'All') return safeData;
        return safeData.filter((item) => item.status === filter);
    }, [safeData, filter]);

    return (
        <div
            className={`w-full flex flex-col gap-4 ${className ?? ''}`}
            {...rest}
        >
            {/* FILTER */}
            <div className="flex gap-2">
                {(['All', 'Pending', 'Menunggu', 'Diproses'] as const).map(
                    (item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={filterButtonVariants({
                                active: filter === item,
                            })}
                        >
                            {item}
                        </button>
                    ),
                )}
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {filteredData.length === 0 && (
                    <div className="text-[12px] font-bold text-slate-400 text-center py-6 border border-slate-200 rounded-sm">
                        Tidak ada data
                    </div>
                )}

                {filteredData.map((item) => (
                    <ItemQueue
                        key={item.token}
                        token={item.token}
                        queue={item.queue}
                        name={item.name}
                        phone={item.phone}
                        serviceType="smkhp-offline"
                        status={item.status}
                        onAction={
                            item.status === 'Menunggu' ||
                            item.status === 'Pending' ? (
                                <button
                                    onClick={() =>
                                        updateSMKHPStatus(
                                            item.token,
                                            'Diproses',
                                        )
                                    }
                                    className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm"
                                >
                                    PROSES
                                </button>
                            ) : item.status === 'Diproses' ? (
                                <Modal
                                    title="DETAIL ANTREAN SMKHP"
                                    trigger={
                                        <button className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm">
                                            DETAIL
                                        </button>
                                    }
                                >
                                    <SMKHPOfflineForm id={item.token} />
                                </Modal>
                            ) : null
                        }
                        onRecall={() => ''}
                    />
                ))}
            </div>
        </div>
    );
}
