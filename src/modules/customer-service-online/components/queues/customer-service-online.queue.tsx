import * as React from 'react';
import { cva } from 'class-variance-authority';

import { ItemQueue, Modal } from '../../../../shared/components';
import CustomerServiceOnlineForm from '../forms/customer-service-online.form';
import type { CustomerServiceOnlineData } from '../../store';

type QueueStatus = 'Pending' | 'Meeting' | 'Selesai';

type QueueItem = {
    raw: CustomerServiceOnlineData;
    status: QueueStatus;
    subtitle: string;
};

type CustomerServiceOnlineQueueListProps = Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'children'
> & {
    data: CustomerServiceOnlineData[];
    defaultFilter?: QueueStatus | 'All';
};

const normalizeStatus = (status: CustomerServiceOnlineData['status']) => {
    switch (status.toLowerCase()) {
        case 'meeting':
            return 'Meeting';
        case 'selesai':
            return 'Selesai';
        default:
            return 'Pending';
    }
};

const getTodayRegistrationDate = () => {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date());
};

const isTodayMeeting = (item: CustomerServiceOnlineData) => {
    return (
        normalizeStatus(item.status) === 'Meeting' &&
        item.tanggalRegistrasi === getTodayRegistrationDate()
    );
};

const getSubtitle = (item: CustomerServiceOnlineData) => {
    const base = `HP: ${item.nomorHp || '-'}`;

    if (!item.timemeet || !item.tanggalRegistrasi) return base;

    return `${base} | ${item.tanggalRegistrasi} ${item.timemeet}`;
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
    const [filter, setFilter] = React.useState<QueueStatus | 'All'>(
        defaultFilter,
    );
    const [selectedSchedule, setSelectedSchedule] =
        React.useState<CustomerServiceOnlineData | null>(null);
    const [selectedDetail, setSelectedDetail] =
        React.useState<CustomerServiceOnlineData | null>(null);

    const safeData: QueueItem[] = React.useMemo(() => {
        return data.map((item) => ({
            raw: item,
            status: normalizeStatus(item.status),
            subtitle: getSubtitle(item),
        }));
    }, [data]);

    const filteredData = React.useMemo(() => {
        if (filter === 'All') return safeData;
        if (filter === 'Meeting') {
            return safeData.filter((item) => isTodayMeeting(item.raw));
        }

        return safeData.filter((item) => item.status === filter);
    }, [safeData, filter]);

    return (
        <>
            <div
                className={`w-full flex flex-col gap-4 ${className ?? ''}`}
                {...rest}
            >
                <div className="flex gap-2 flex-wrap">
                    {(['All', 'Pending', 'Meeting', 'Selesai'] as const).map(
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
                            {filter === 'Meeting'
                                ? 'Tidak ada meeting customer service online untuk hari ini'
                                : 'Tidak ada antrean dalam kategori ini'}
                        </div>
                    )}

                    {filteredData.map((item) => (
                        <ItemQueue
                            key={item.raw.token}
                            token={item.raw.token}
                            queue={item.raw.queueNo}
                            name={item.raw.name}
                            subtitle={item.subtitle}
                            serviceType="customer-service-online"
                            status={item.status}
                            onAction={
                                item.status === 'Pending' ? (
                                    <button
                                        onClick={() =>
                                            setSelectedSchedule(item.raw)
                                        }
                                        className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm"
                                    >
                                        PROSES
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setSelectedDetail(item.raw)
                                        }
                                        className="px-3 py-2 text-[10px] font-black uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all rounded-sm"
                                    >
                                        DETAIL
                                    </button>
                                )
                            }
                        />
                    ))}
                </div>
            </div>

            <Modal
                title="JADWALKAN CUSTOMER SERVICE ONLINE"
                open={!!selectedSchedule}
                onOpenChange={(open) => {
                    if (!open) setSelectedSchedule(null);
                }}
            >
                {selectedSchedule && (
                    <CustomerServiceOnlineForm
                        item={selectedSchedule}
                        mode="schedule"
                        onSuccess={() => setSelectedSchedule(null)}
                    />
                )}
            </Modal>

            <Modal
                title="DETAIL CUSTOMER SERVICE ONLINE"
                open={!!selectedDetail}
                onOpenChange={(open) => {
                    if (!open) setSelectedDetail(null);
                }}
            >
                {selectedDetail && (
                    <CustomerServiceOnlineForm
                        item={selectedDetail}
                        mode="detail"
                        onSuccess={() => setSelectedDetail(null)}
                    />
                )}
            </Modal>
        </>
    );
}
