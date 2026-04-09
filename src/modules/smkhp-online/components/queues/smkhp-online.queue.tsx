import * as React from 'react';
import { cva } from 'class-variance-authority';

import { ItemQueue, Modal } from '../../../../shared/components';
import SMKHPOnlineForm from '../forms/smkhp-online.form';
import type { SMKHPOnlineData } from '../../store';

type QueueStatus = 'Pending' | 'Meeting' | 'Selesai';

type QueueItem = {
    raw: SMKHPOnlineData;
    status: QueueStatus;
    subtitle: string;
};

type SMKHPOnlineQueueListProps = Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'children'
> & {
    data: SMKHPOnlineData[];
    defaultFilter?: QueueStatus | 'All';
};

const normalizeStatus = (status: SMKHPOnlineData['status']) => {
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

const isTodayMeeting = (item: SMKHPOnlineData) => {
    return (
        normalizeStatus(item.status) === 'Meeting' &&
        item.tanggalRegistrasi === getTodayRegistrationDate()
    );
};

const getSubtitle = (item: SMKHPOnlineData) => {
    const noAju =
        item.noAju && item.noAju !== '-' ? item.noAju : 'Belum ada no aju';

    if (!item.timemeet || !item.tanggalRegistrasi) return `No Aju: ${noAju}`;

    return `No Aju: ${noAju} | ${item.tanggalRegistrasi} ${item.timemeet}`;
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

export default function SMKHPOnlineQueue(props: SMKHPOnlineQueueListProps) {
    const { data, defaultFilter = 'All', className, ...rest } = props;
    const [filter, setFilter] = React.useState<QueueStatus | 'All'>(
        defaultFilter,
    );
    const [selectedSchedule, setSelectedSchedule] =
        React.useState<SMKHPOnlineData | null>(null);
    const [selectedDetail, setSelectedDetail] =
        React.useState<SMKHPOnlineData | null>(null);

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
                                ? 'Tidak ada meeting SMKHP online untuk hari ini'
                                : 'Tidak ada antrean dalam kategori ini'}
                        </div>
                    )}

                    {filteredData.map((item) => (
                        <ItemQueue
                            key={item.raw.token}
                            token={item.raw.token}
                            queue={item.raw.queueNo}
                            name={item.raw.nama}
                            subtitle={item.subtitle}
                            serviceType="smkhp-online"
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
                title="JADWALKAN SMKHP ONLINE"
                open={!!selectedSchedule}
                onOpenChange={(open) => {
                    if (!open) setSelectedSchedule(null);
                }}
            >
                {selectedSchedule && (
                    <SMKHPOnlineForm
                        item={selectedSchedule}
                        mode="schedule"
                        onSuccess={() => setSelectedSchedule(null)}
                    />
                )}
            </Modal>

            <Modal
                title="DETAIL SMKHP ONLINE"
                open={!!selectedDetail}
                onOpenChange={(open) => {
                    if (!open) setSelectedDetail(null);
                }}
            >
                {selectedDetail && (
                    <SMKHPOnlineForm
                        item={selectedDetail}
                        mode="detail"
                        onSuccess={() => setSelectedDetail(null)}
                    />
                )}
            </Modal>
        </>
    );
}
