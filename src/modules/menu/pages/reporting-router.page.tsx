import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { collection, onSnapshot } from 'firebase/firestore';
import { Button, Table } from '../../../shared/components';
import RoleGuard from '../../../shared/auth/role-guard';
import HeaderNavigation from '../../../shared/navigations/header.navigation';
import FooterNavigation from '../../../shared/navigations/footer.navigation';
import { db } from '../../../shared/configs/firebase';

type FilterType = 'daily' | 'weekly' | 'monthly' | 'custom';

type ReportingRecord = {
    id: string;
    serviceKey: string;
    serviceLabel: string;
    channel: string;
    dateKey: string;
    timestamp: number;
};

type ReportingRow = {
    date: string;
    smkhpOffline: number;
    smkhpOnline: number;
    laboratoriumUmum: number;
    laboratoriumC: number;
    customerServiceOffline: number;
    customerServiceOnline: number;
    total: number;
};

const SERVICE_META = {
    SMKHP: {
        serviceKey: 'smkhpOffline',
        serviceLabel: 'SMKHP Offline',
        channel: 'Offline',
    },
    onlineSMKHP: {
        serviceKey: 'smkhpOnline',
        serviceLabel: 'SMKHP Online',
        channel: 'Online',
    },
    LAB: {
        serviceKey: 'laboratoriumUmum',
        serviceLabel: 'Laboratorium Umum',
        channel: 'Laboratorium',
    },
    LabOc: {
        serviceKey: 'laboratoriumC',
        serviceLabel: 'Laboratorium C',
        channel: 'Laboratorium',
    },
    CustomerService: {
        serviceKey: 'customerServiceOffline',
        serviceLabel: 'Customer Service Offline',
        channel: 'Offline',
    },
    onlineCS: {
        serviceKey: 'customerServiceOnline',
        serviceLabel: 'Customer Service Online',
        channel: 'Online',
    },
} as const;

const getTodayDate = () => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
};

const addDays = (date: string, amount: number) => {
    const base = new Date(`${date}T00:00:00+07:00`);
    base.setUTCDate(base.getUTCDate() + amount);
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(base);
};

const getMonthStart = (date: string) => `${date.slice(0, 7)}-01`;

const formatDateLabel = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(`${date}T00:00:00+07:00`));
};

const getTimestampFromDateKey = (dateKey: string) =>
    new Date(`${dateKey}T00:00:00+07:00`).getTime();

const parseDateFromString = (value?: string) => {
    if (!value) return '';

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [day, month, year] = value.split('/');
        return `${year}-${month}-${day}`;
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }

    return '';
};

const getRecordDateKey = (value: Record<string, any>) => {
    const details = (value.details || {}) as Record<string, any>;

    return (
        parseDateFromString(details.tanggal) ||
        parseDateFromString(value.tanggalRegistrasi) ||
        parseDateFromString(value.tanggalPengujian) ||
        parseDateFromString(value.tanggalPenerbitan) ||
        parseDateFromString(value.createdAt) ||
        parseDateFromString(value.updatedAt) ||
        (() => {
            const rawTimestamp =
                value.timestamp ||
                details.timestamp ||
                value.updatedAt ||
                value.createdAt ||
                details.appointmentTimeMillis;
            const asNumber = Number(rawTimestamp);
            if (!Number.isFinite(asNumber) || asNumber <= 0) return '';
            return new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Jakarta',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(asNumber));
        })() ||
        ''
    );
};

const createEmptyRow = (date: string): ReportingRow => ({
    date,
    smkhpOffline: 0,
    smkhpOnline: 0,
    laboratoriumUmum: 0,
    laboratoriumC: 0,
    customerServiceOffline: 0,
    customerServiceOnline: 0,
    total: 0,
});

export default function ReportingRouterPage() {
    const [records, setRecords] = React.useState<ReportingRecord[]>([]);
    const [filterType, setFilterType] = React.useState<FilterType>('daily');
    const today = React.useMemo(() => getTodayDate(), []);
    const [startDate, setStartDate] = React.useState(today);
    const [endDate, setEndDate] = React.useState(today);

    React.useEffect(() => {
        if (filterType === 'daily') {
            setStartDate(today);
            setEndDate(today);
            return;
        }

        if (filterType === 'weekly') {
            setStartDate(addDays(today, -6));
            setEndDate(today);
            return;
        }

        if (filterType === 'monthly') {
            setStartDate(getMonthStart(today));
            setEndDate(today);
        }
    }, [filterType, today]);

    React.useEffect(() => {
        const collectionNames = Object.keys(SERVICE_META) as Array<
            keyof typeof SERVICE_META
        >;
        const cache: Partial<
            Record<keyof typeof SERVICE_META, ReportingRecord[]>
        > = {};

        const flush = () => {
            const merged = collectionNames.flatMap((name) => cache[name] || []);
            setRecords(merged.sort((a, b) => a.timestamp - b.timestamp));
        };

        const unsubscribers = collectionNames.map((collectionName) =>
            onSnapshot(collection(db, collectionName), (snapshot) => {
                cache[collectionName] = snapshot.docs
                    .map((item) => {
                        const value = item.data();
                        const dateKey = getRecordDateKey(value);
                        if (!dateKey) return null;

                        return {
                            id: item.id,
                            serviceKey: SERVICE_META[collectionName].serviceKey,
                            serviceLabel:
                                SERVICE_META[collectionName].serviceLabel,
                            channel: SERVICE_META[collectionName].channel,
                            dateKey,
                            timestamp: getTimestampFromDateKey(dateKey),
                        } satisfies ReportingRecord;
                    })
                    .filter(Boolean) as ReportingRecord[];
                flush();
            }),
        );

        return () => {
            unsubscribers.forEach((unsubscribe) => unsubscribe());
        };
    }, []);

    const filteredRecords = React.useMemo(() => {
        const start = getTimestampFromDateKey(startDate);
        const end = getTimestampFromDateKey(endDate) + 86_399_999;

        return records.filter((record) => {
            return record.timestamp >= start && record.timestamp <= end;
        });
    }, [endDate, records, startDate]);

    const dateKeys = React.useMemo(() => {
        const dates: string[] = [];
        let cursor = startDate;

        while (cursor <= endDate) {
            dates.push(cursor);
            cursor = addDays(cursor, 1);
        }

        return dates;
    }, [endDate, startDate]);

    const rows = React.useMemo<ReportingRow[]>(() => {
        const rowMap = new Map<string, ReportingRow>();

        dateKeys.forEach((date) => rowMap.set(date, createEmptyRow(date)));

        filteredRecords.forEach((record) => {
            const row =
                rowMap.get(record.dateKey) || createEmptyRow(record.dateKey);
            row[
                record.serviceKey as keyof Omit<ReportingRow, 'date' | 'total'>
            ] += 1;
            row.total += 1;
            rowMap.set(record.dateKey, row);
        });

        return Array.from(rowMap.values()).sort((a, b) =>
            a.date.localeCompare(b.date),
        );
    }, [dateKeys, filteredRecords]);

    const totals = React.useMemo(() => {
        return rows.reduce(
            (acc, row) => ({
                smkhpOffline: acc.smkhpOffline + row.smkhpOffline,
                smkhpOnline: acc.smkhpOnline + row.smkhpOnline,
                laboratoriumUmum: acc.laboratoriumUmum + row.laboratoriumUmum,
                laboratoriumC: acc.laboratoriumC + row.laboratoriumC,
                customerServiceOffline:
                    acc.customerServiceOffline + row.customerServiceOffline,
                customerServiceOnline:
                    acc.customerServiceOnline + row.customerServiceOnline,
                total: acc.total + row.total,
            }),
            {
                smkhpOffline: 0,
                smkhpOnline: 0,
                laboratoriumUmum: 0,
                laboratoriumC: 0,
                customerServiceOffline: 0,
                customerServiceOnline: 0,
                total: 0,
            },
        );
    }, [rows]);

    const columns: ColumnDef<ReportingRow>[] = [
        {
            accessorKey: 'date',
            header: 'Tanggal',
            cell: ({ row }) => formatDateLabel(row.original.date),
        },
        { accessorKey: 'smkhpOffline', header: 'SMKHP Offline' },
        { accessorKey: 'smkhpOnline', header: 'SMKHP Online' },
        { accessorKey: 'laboratoriumUmum', header: 'Lab Umum' },
        { accessorKey: 'laboratoriumC', header: 'Lab C' },
        {
            accessorKey: 'customerServiceOffline',
            header: 'CS Offline',
        },
        {
            accessorKey: 'customerServiceOnline',
            header: 'CS Online',
        },
        { accessorKey: 'total', header: 'Total' },
    ];

    const handleExportPdf = () => {
        const summaryItems = [
            ['SMKHP Offline', totals.smkhpOffline],
            ['SMKHP Online', totals.smkhpOnline],
            ['Laboratorium Umum', totals.laboratoriumUmum],
            ['Laboratorium C', totals.laboratoriumC],
            ['Customer Service Offline', totals.customerServiceOffline],
            ['Customer Service Online', totals.customerServiceOnline],
            ['Total', totals.total],
        ];

        const summaryHtml = summaryItems
            .map(
                ([label, value]) =>
                    `<tr><td style="padding:8px;border:1px solid #111827;">${label}</td><td style="padding:8px;border:1px solid #111827;text-align:right;">${value}</td></tr>`,
            )
            .join('');

        const rowsHtml = rows
            .map(
                (row) => `
                <tr>
                    <td style="padding:8px;border:1px solid #111827;">${formatDateLabel(row.date)}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.smkhpOffline}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.smkhpOnline}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.laboratoriumUmum}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.laboratoriumC}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.customerServiceOffline}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.customerServiceOnline}</td>
                    <td style="padding:8px;border:1px solid #111827;text-align:right;">${row.total}</td>
                </tr>`,
            )
            .join('');

        const printWindow = window.open('', '_blank', 'noopener,noreferrer');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporting KKP Semarang</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                        h1, h2 { margin-bottom: 8px; }
                        p { margin-top: 0; color: #475569; }
                        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                        th { background: #e2e8f0; border: 1px solid #111827; padding: 8px; text-align: left; }
                    </style>
                </head>
                <body>
                    <h1>Reporting Layanan KKP Semarang</h1>
                    <p>Periode ${formatDateLabel(startDate)} sampai ${formatDateLabel(endDate)}</p>
                    <h2>Ringkasan</h2>
                    <table>${summaryHtml}</table>
                    <h2>Tabel Harian</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>SMKHP Offline</th>
                                <th>SMKHP Online</th>
                                <th>Lab Umum</th>
                                <th>Lab C</th>
                                <th>CS Offline</th>
                                <th>CS Online</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <RoleGuard feature="reporting">
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <HeaderNavigation />
                <main className="flex-1 p-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-black uppercase">
                                    Reporting
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Rekap jumlah layanan SMKHP, Laboratorium,
                                    dan Customer Service untuk periode yang bisa
                                    Anda filter sendiri.
                                </p>
                            </div>
                            <Button onClick={handleExportPdf}>
                                Export PDF
                            </Button>
                        </div>

                        <div className="grid gap-4 rounded-sm border border-slate-200 bg-white p-4 md:grid-cols-4">
                            <label className="flex flex-col gap-1 text-sm">
                                <span>Mode Filter</span>
                                <select
                                    className="h-10 rounded-sm border border-slate-300 bg-white px-3 outline-none"
                                    value={filterType}
                                    onChange={(event) =>
                                        setFilterType(
                                            event.target.value as FilterType,
                                        )
                                    }
                                >
                                    <option value="daily">Harian</option>
                                    <option value="weekly">Mingguan</option>
                                    <option value="monthly">Bulanan</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1 text-sm">
                                <span>Tanggal Mulai</span>
                                <input
                                    type="date"
                                    className="h-10 rounded-sm border border-slate-300 bg-white px-3 outline-none disabled:bg-slate-100"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    disabled={filterType !== 'custom'}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm">
                                <span>Tanggal Akhir</span>
                                <input
                                    type="date"
                                    className="h-10 rounded-sm border border-slate-300 bg-white px-3 outline-none disabled:bg-slate-100"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    disabled={filterType !== 'custom'}
                                />
                            </label>
                            <div className="rounded-sm border border-slate-200 bg-slate-50 p-3 flex flex-col justify-center">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Periode Aktif
                                </p>
                                <p className="mt-2 text-sm font-bold">
                                    {formatDateLabel(startDate)} -{' '}
                                    {formatDateLabel(endDate)}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    SMKHP Offline
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.smkhpOffline}
                                </p>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    SMKHP Online
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.smkhpOnline}
                                </p>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Lab Umum
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.laboratoriumUmum}
                                </p>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Lab C
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.laboratoriumC}
                                </p>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    CS Offline
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.customerServiceOffline}
                                </p>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    CS Online
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.customerServiceOnline}
                                </p>
                            </div>
                            <div className="rounded-sm border border-black bg-black p-4 text-white">
                                <p className="text-xs font-bold uppercase text-white/70">
                                    Total
                                </p>
                                <p className="mt-2 text-2xl font-black">
                                    {totals.total}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-4">
                            <Table columns={columns} data={rows} />
                        </div>
                    </div>
                </main>
                <FooterNavigation />
            </div>
        </RoleGuard>
    );
}
