import { Modal } from '../../../shared/components';

import TraderLayout from '../layouts/trader.layout';
import CreateTraderForm from '../components/forms/create.trader.form';
import TraderTable from '../components/tables/trader.table';

import { FaRegPlusSquare } from 'react-icons/fa';

export default function TraderPage() {
    return (
        <TraderLayout>
            <Modal
                title="Tambah Trader"
                trigger={
                    <>
                        <button className="h-9 px-2 border rounded-sm flex justify-center items-center gap-2 hover:cursor-pointer bg-black text-white">
                            <FaRegPlusSquare className="w-4 h-4" />
                            <span className="text-sm">Tambah Trader</span>
                        </button>
                    </>
                }
            >
                <CreateTraderForm />
            </Modal>
            <TraderTable />
        </TraderLayout>
    );
}
