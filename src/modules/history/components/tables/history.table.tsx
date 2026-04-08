import type { ColumnDef } from '@tanstack/react-table';
import { Modal, Table } from '../../../../shared/components';

type History = {
    id: string;
    nama: string;
    phone: string;
    npwp: string;
};

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
            return (
                <div className="flex items-center gap-2">
                    <Modal
                        title="Riwayat"
                        trigger={
                            <button className="hover:cursor-pointer">
                                Riwayat
                            </button>
                        }
                    >
                        <p>Riwayat {row.original.id}</p>
                    </Modal>
                    <span>|</span>
                    <Modal
                        title="Edit"
                        trigger={
                            <button className="hover:cursor-pointer">
                                Edit
                            </button>
                        }
                    >
                        <p>Riwayat {row.original.id}</p>
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

export default function HistroyTable() {
    return (
        <>
            <Table columns={columns} data={data} />
        </>
    );
}
