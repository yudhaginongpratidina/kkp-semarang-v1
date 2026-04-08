import SMKHPOfflineLayout from '../layouts/smkhp-offline.layout';

import SMKHPOfflineStatistik from '../components/statistik/smkhp-offline.statistik';
import SMKHPOfflineQueue from '../components/queues/smkhp-offline.queue';

const data = [
    {
        token: '1',
        queue: 1,
        name: 'Yudha',
        phone: '08123',
        status: 'pending',
    },
    {
        token: '2',
        queue: 2,
        name: 'Budi',
        phone: '08222',
        status: 'menunggu',
    },
    {
        token: '3',
        queue: 3,
        name: 'Siti',
        phone: '08333',
        status: 'diproses',
    },
];

export default function SMKHPOfflinePage() {
    return (
        <SMKHPOfflineLayout>
            <SMKHPOfflineStatistik
                pending_counter={0}
                processing_counter={0}
                waiting_counter={0}
            />
            <SMKHPOfflineQueue data={data} />
        </SMKHPOfflineLayout>
    );
}
