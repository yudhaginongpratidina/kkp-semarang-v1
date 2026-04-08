import { useEffect } from 'react';
import SMKHPOfflineLayout from '../layouts/smkhp-offline.layout';
import SMKHPOfflineStatistik from '../components/statistik/smkhp-offline.statistik';
import SMKHPOfflineQueue from '../components/queues/smkhp-offline.queue';
import useSMKHPOfflineStore from '../store';

export default function SMKHPOfflinePage() {
    // 1. Ambil state dan action dari store
    const { smkhp, getSMKHP, isLoading } = useSMKHPOfflineStore();

    // 2. Berlangganan ke data Firestore secara realtime saat komponen dimuat
    useEffect(() => {
        const unsubscribe = getSMKHP();

        // Cleanup: Berhenti berlangganan saat user meninggalkan halaman
        return () => unsubscribe();
    }, [getSMKHP]);

    // 3. Kalkulasi data statistik secara dinamis berdasarkan subStatus
    const pendingCount = smkhp.filter(
        (q) => q.status === 'Pending' || !q.subStatus,
    ).length;
    const processingCount = smkhp.filter(
        (q) => q.subStatus === 'Dipanggil',
    ).length;
    const waitingCount = smkhp.filter((q) => q.subStatus === 'Diproses').length;

    return (
        <SMKHPOfflineLayout>
            <SMKHPOfflineStatistik
                pending_counter={pendingCount}
                processing_counter={processingCount}
                waiting_counter={waitingCount}
            />

            {/* Indikator Loading sederhana */}
            {isLoading && smkhp.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500 italic">
                    Menghubungkan ke server antrean...
                </div>
            )}
            <SMKHPOfflineQueue data={smkhp} />
        </SMKHPOfflineLayout>
    );
}
