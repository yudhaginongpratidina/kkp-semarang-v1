import * as React from 'react';
import { cva } from 'class-variance-authority';

import { ItemQueue, Modal } from '../../../../shared/components';
import CustomerServiceOnlineForm from '../forms/customer-service-online.form';

type QueueStatus = 'Pending' | 'Menunggu' | 'Diproses';

type RawQueueItem = {
    token: string;
    queue: number;
    name: string;
    phone: string;
    status: string;
};

type QueueItem = {
    token: string;
    queue: number;
    name: string;
    phone: string;
    status: QueueStatus;
};

type CustomerServiceOnlineQueueListProps = Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'children'
> & {
    data: RawQueueItem[];
    defaultFilter?: QueueStatus | 'All';
};

const normalizeStatus = (status: string): QueueStatus => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Pending';
        case 'menunggu':
        case 'waiting':
            return 'Menunggu';
        case 'diproses':
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

export default function CustomerServiceOnlineQueue(
    props: CustomerServiceOnlineQueueListProps,
) {
    const { data, defaultFilter = 'All', className, ...rest } = props;

    const safeData: QueueItem[] = React.useMemo(() => {
        return data.map((item) => ({
            ...item,
            status: normalizeStatus(item.status),
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
                        serviceType="customer-service-online"
                        status={item.status}
                        onAction={
                            item.status === 'Menunggu' ? (
                                <button className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm">
                                    PROSES
                                </button>
                            ) : item.status === 'Diproses' ? (
                                <Modal
                                    title="CUSTOMER SERVICE OFFLINE"
                                    trigger={
                                        <button className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm">
                                            DETAIL
                                        </button>
                                    }
                                >
                                    <CustomerServiceOnlineForm
                                        id={item.token}
                                    />
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
