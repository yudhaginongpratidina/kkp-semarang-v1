import CustomerServiceOnlineLayout from '../layouts/customer-service-online.layout';
import * as React from 'react';

import CustomerServiceOnlineStatistik from '../components/statistik/customer-service-online.statistik';
import CustomerServiceOnlineQueue from '../components/queues/customer-service-online.queue';
import CustomerServiceOnlineSkeleton from '../components/skeletons/customer-service-online.skeleton';
import useCustomerServiceOnlineStore from '../store';

const getTodayRegistrationDate = () => {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date());
};

export default function CustomerServiceOnlinePage() {
    const { customer_service_online, getCustomerServiceOnline, isLoading } =
        useCustomerServiceOnlineStore();

    React.useEffect(() => {
        const unsubscribe = getCustomerServiceOnline();
        return () => unsubscribe();
    }, [getCustomerServiceOnline]);

    const today = getTodayRegistrationDate();

    const statistics = React.useMemo(
        () => ({
            pending: customer_service_online.filter(
                (item) => item.status === 'pending',
            ).length,
            meeting: customer_service_online.filter(
                (item) =>
                    item.status === 'meeting' &&
                    item.tanggalRegistrasi === today,
            ).length,
            finished: customer_service_online.filter(
                (item) => item.status === 'selesai',
            ).length,
        }),
        [customer_service_online, today],
    );

    if (isLoading && customer_service_online.length === 0) {
        return <CustomerServiceOnlineSkeleton />;
    }

    return (
        <CustomerServiceOnlineLayout>
            <CustomerServiceOnlineStatistik
                pending_counter={statistics.pending}
                meeting_counter={statistics.meeting}
                finished_counter={statistics.finished}
            />
            <CustomerServiceOnlineQueue data={customer_service_online} />
        </CustomerServiceOnlineLayout>
    );
}
