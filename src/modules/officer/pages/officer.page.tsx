import type { ColumnDef } from '@tanstack/react-table';
import { Modal, Table } from '../../../shared/components';

import OfficerLayout from '../layouts/officer.layout';
import CreateOfficerForm from '../components/forms/create.officer.form';
import EditOfficerForm from '../components/forms/edit.officer.form';

import { FaRegPlusSquare } from 'react-icons/fa';

type User = {
    id: string;
    name: string;
    email: string;
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
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
                        <EditOfficerForm id={row.original.id} />
                    </Modal>
                    <span>|</span>
                    <button className="hover:cursor-pointer">Hapus</button>
                </div>
            );
        },
    },
];

const data: User[] = [
    { id: '1', name: 'Yudha', email: 'yudha@mail.com' },
    { id: '2', name: 'Budi', email: 'budi@mail.com' },
];

export default function OfficerPage() {
    return (
        <OfficerLayout>
            <Modal
                title="Tambah Petugas"
                trigger={
                    <>
                        <button className="h-9 px-2 border rounded-sm flex justify-center items-center gap-2 hover:cursor-pointer bg-black text-white">
                            <FaRegPlusSquare className="w-4 h-4" />
                            <span className="text-sm">Tambah Petugas</span>
                        </button>
                    </>
                }
            >
                <CreateOfficerForm />
            </Modal>
            <Table columns={columns} data={data} />
        </OfficerLayout>
    );
}
