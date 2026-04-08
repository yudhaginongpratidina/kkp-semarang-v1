import CustomerServiceOfflineLayout from '../layouts/customer-service-offline.layout';

import CustomerServiceOfflineStatistik from '../components/statistik/customer-service-offline.statistik';
import CustomerServiceOfflineQueue from '../components/queues/customer-service-offline.queue';

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

export default function CustomerServiceOfflinePage() {
    return (
        <CustomerServiceOfflineLayout>
            <CustomerServiceOfflineStatistik
                pending_counter={0}
                processing_counter={0}
                waiting_counter={0}
            />
            <CustomerServiceOfflineQueue data={data} />
        </CustomerServiceOfflineLayout>
    );
}
