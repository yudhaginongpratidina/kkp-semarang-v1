import { useEffect } from 'react';
import CustomerServiceOfflineLayout from '../layouts/customer-service-offline.layout';
import CustomerServiceOfflineStatistik from '../components/statistik/customer-service-offline.statistik';
import CustomerServiceOfflineQueue from '../components/queues/customer-service-offline.queue';
import useCustomerServiceOfflineStore from '../store';

export default function CustomerServiceOfflinePage() {
    // 1. Ambil state dan action dari store
    const { customer_service, getCustomerService, isLoading } =
        useCustomerServiceOfflineStore();

    // 2. Lifecycle untuk data realtime
    useEffect(() => {
        const unsubscribe = getCustomerService();
        return () => unsubscribe(); // Cleanup listener saat unmount
    }, [getCustomerService]);

    // 3. Kalkulasi statistik dinamis
    const pendingCount = customer_service.filter(
        (q) => q.subStatus === 'Pending' || !q.subStatus,
    ).length;
    const processingCount = customer_service.filter(
        (q) => q.subStatus === 'Diproses',
    ).length;
    const waitingCount = customer_service.filter(
        (q) => q.subStatus === 'Menunggu',
    ).length;

    return (
        <CustomerServiceOfflineLayout>
            <CustomerServiceOfflineStatistik
                pending_counter={pendingCount}
                processing_counter={processingCount}
                waiting_counter={waitingCount}
            />

            {isLoading && customer_service.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
                    Sinkronisasi data antrean...
                </div>
            )}

            <CustomerServiceOfflineQueue data={customer_service} />
        </CustomerServiceOfflineLayout>
    );
}
