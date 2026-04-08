import CustomerServiceOnlineLayout from '../layouts/customer-service-online.layout';

import CustomerServiceOnlineStatistik from '../components/statistik/customer-service-online.statistik';
import CustomerServiceOnlineQueue from '../components/queues/customer-service-online.queue';

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

export default function CustomerServiceOnlinePage() {
    return (
        <CustomerServiceOnlineLayout>
            <CustomerServiceOnlineStatistik
                pending_counter={0}
                processing_counter={0}
                waiting_counter={0}
            />
            <CustomerServiceOnlineQueue data={data} />
        </CustomerServiceOnlineLayout>
    );
}
