import SMKHPOnlineLayout from '../layouts/smkhp-online.layout';

import SMKHPOnlineStatistik from '../components/statistik/smkhp-online.statistik';
import SMKHPOnlineQueue from '../components/queues/smkhp-online.queue';

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

export default function SMKHPOnlinePage() {
    return (
        <SMKHPOnlineLayout>
            <SMKHPOnlineStatistik
                pending_counter={0}
                processing_counter={0}
                waiting_counter={0}
            />
            <SMKHPOnlineQueue data={data} />
        </SMKHPOnlineLayout>
    );
}
