import type { ColumnDef } from '@tanstack/react-table';
import { Modal, Table } from '../../../../shared/components';
import EditTraderForm from '../forms/edit.trader.form';

type Trader = {
    id: string;
    kode: string;
    nama: string;
    npwp: string;
    alamat: string;
};

const columns: ColumnDef<Trader>[] = [
    {
        accessorKey: 'kode',
        header: 'Kode',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'nama',
        header: 'Nama',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'npwp',
        header: 'NPWP',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'alamat',
        header: 'Alamat',
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
                        title="Edit Petugas"
                        trigger={
                            <button className="hover:cursor-pointer">
                                Edit
                            </button>
                        }
                    >
                        <EditTraderForm id={row.original.id} />
                    </Modal>
                    <span>|</span>
                    <button className="hover:cursor-pointer">Hapus</button>
                </div>
            );
        },
    },
];

const data: Trader[] = [
    { id: '1', kode: '1', nama: 'Yudha', npwp: '1', alamat: 'Yogyakarta' },
    { id: '2', kode: '2', nama: 'Budi', npwp: '2', alamat: 'Jakarta' },
    { id: '3', kode: '3', nama: 'Andi', npwp: '3', alamat: 'Bandung' },
];

export default function TraderTable() {
    return (
        <>
            <Table columns={columns} data={data} />
        </>
    );
}
