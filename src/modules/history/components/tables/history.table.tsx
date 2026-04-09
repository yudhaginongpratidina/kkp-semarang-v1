import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal, Table, MenuTab } from '../../../../shared/components';
import useLaboratoriumUmumStore from '../../../laboratorium-umum/store';
import useLaboratoriumCStore from '../../../laboratorium-c/store';
import type { LabHistoryItem } from '../../../laboratory-shared/lab.types';
import LabReportView from '../../../laboratory-shared/components/lab-report.view';
import { formatCurrency } from '../../../laboratory-shared/lab.utils';

type HistoryTab = 'lab-umum' | 'lab-c';

export default function HistroyTable() {
    const tabs = [
        { label: 'History Lab Umum', value: 'lab-umum' },
        { label: 'History Lab C', value: 'lab-c' },
    ];
    const [activeTab, setActiveTab] = React.useState<HistoryTab>('lab-umum');
    const [selectedItem, setSelectedItem] =
        React.useState<LabHistoryItem | null>(null);
    const { histories: historiesUmum, getHistories: getHistoriesUmum } =
        useLaboratoriumUmumStore();
    const { histories: historiesC, getHistories: getHistoriesC } =
        useLaboratoriumCStore();

    React.useEffect(() => {
        const unsubscribeUmum = getHistoriesUmum();
        const unsubscribeC = getHistoriesC();

        return () => {
            unsubscribeUmum();
            unsubscribeC();
        };
    }, [getHistoriesC, getHistoriesUmum]);

    const data = React.useMemo(
        () => (activeTab === 'lab-umum' ? historiesUmum : historiesC),
        [activeTab, historiesC, historiesUmum],
    );

    const columns: ColumnDef<LabHistoryItem>[] = [
        {
            accessorKey: 'lpp',
            header: 'LPP',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'namaSampel',
            header: 'Nama Sampel',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'tanggalPenerbitan',
            header: 'Tanggal Penerbitan',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'namaPenanggungJawab',
            header: 'Penanggung Jawab',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'totalTarif',
            header: 'Total Tarif',
            enableColumnFilter: false,
            cell: ({ row }) => formatCurrency(row.original.totalTarif),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableColumnFilter: true,
        },
        {
            id: 'action',
            header: 'Action',
            enableColumnFilter: false,
            cell: ({ row }) => (
                <button
                    className="hover:cursor-pointer font-bold"
                    onClick={() => setSelectedItem(row.original)}
                >
                    View
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <MenuTab
                tabs={tabs}
                value={activeTab}
                onChange={(value) => setActiveTab(value as HistoryTab)}
            />

            <Table columns={columns} data={data} />

            <Modal
                title="VIEW LHU HISTORY LAB"
                open={!!selectedItem}
                onOpenChange={(open) => {
                    if (!open) setSelectedItem(null);
                }}
            >
                {selectedItem && (
                    <LabReportView
                        item={selectedItem}
                        title={
                            activeTab === 'lab-umum'
                                ? 'Laboratorium Umum'
                                : 'Laboratorium C'
                        }
                    />
                )}
            </Modal>
        </div>
    );
}
