import { Stat } from '../../../../shared/components';

import { MdOutlinePendingActions } from 'react-icons/md';
import { MdAccessTime } from 'react-icons/md';
import { MdAutorenew } from 'react-icons/md';

export default function SMKHPOfflineStatistik({
    pending_counter,
    processing_counter,
    waiting_counter,
}: {
    pending_counter: number;
    processing_counter: number;
    waiting_counter: number;
}) {
    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
            <Stat
                icon={<MdOutlinePendingActions size={24} />}
                label="Pending Approval"
                value={pending_counter}
                description="Tiket yang menunggu persetujuan"
            />
            <Stat
                icon={<MdAccessTime size={24} />}
                label="Menunggu Respons"
                value={waiting_counter}
                description="Tiket yang belum ditindaklanjuti"
            />
            <Stat
                icon={<MdAutorenew size={24} />}
                label="Sedang Diproses"
                value={processing_counter}
                description="Tiket yang sedang ditangani"
            />
        </div>
    );
}
