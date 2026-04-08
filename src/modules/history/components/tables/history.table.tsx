import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal, Table, MenuTab } from '../../../../shared/components';

type History = {
    id: string;
    nama: string;
    phone: string;
    npwp: string;
};

export default function HistroyTable() {
    // Tabs global untuk semua row
    const tabs = [
        { label: 'SMKHP Offline', value: 'smkhp-offline' },
        { label: 'SMKHP Online', value: 'smkhp-online' },
        { label: 'CS Offline', value: 'customer-service-offline' },
        { label: 'CS Online', value: 'customer-service-online' },
    ];

    // State per row
    const [activeMap, setActiveMap] = useState<Record<string, string>>({});

    const columns: ColumnDef<History>[] = [
        {
            accessorKey: 'nama',
            header: 'Nama',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'npwp',
            header: 'NPWP',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'action',
            header: 'Action',
            enableColumnFilter: false,
            cell: ({ row }) => {
                const current = activeMap[row.original.id] ?? 'smkhp-offline';

                return (
                    <div className="flex items-center gap-2">
                        {/* Riwayat Modal */}
                        <Modal
                            title="Riwayat"
                            trigger={
                                <button className="hover:cursor-pointer">
                                    Riwayat
                                </button>
                            }
                        >
                            {/* Stop event propagation agar modal tidak close */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <MenuTab
                                    tabs={tabs}
                                    value={current}
                                    onChange={(val) =>
                                        setActiveMap((prev) => ({
                                            ...prev,
                                            [row.original.id]: val,
                                        }))
                                    }
                                />

                                {current === 'smkhp-offline' && (
                                    <p>SMKHP Offline {row.original.id}</p>
                                )}
                                {current === 'smkhp-online' && (
                                    <p>SMKHP Online {row.original.id}</p>
                                )}
                                {current === 'customer-service-offline' && (
                                    <p>CS Offline {row.original.id}</p>
                                )}
                                {current === 'customer-service-online' && (
                                    <p>CS Online {row.original.id}</p>
                                )}
                            </div>
                        </Modal>

                        <span>|</span>

                        {/* Edit Modal */}
                        <Modal
                            title="Edit"
                            trigger={
                                <button className="hover:cursor-pointer">
                                    Edit
                                </button>
                            }
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <p>Edit {row.original.id}</p>
                            </div>
                        </Modal>

                        <span>|</span>

                        <button className="hover:cursor-pointer">Hapus</button>
                    </div>
                );
            },
        },
    ];

    const data: History[] = [
        { id: '1', nama: 'Yudha', phone: '1', npwp: '1' },
        { id: '2', nama: 'Budi', phone: '2', npwp: '2' },
        { id: '3', nama: 'Andi', phone: '3', npwp: '3' },
    ];

    return <Table columns={columns} data={data} />;
}
