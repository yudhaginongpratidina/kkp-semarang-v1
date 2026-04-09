import * as React from 'react';
import LaboratoriumUmumLayout from '../layouts/laboratorium-umum.layout';
import useLaboratoriumUmumStore from '../store';
import LabStatistik from '../../laboratory-shared/components/lab.statistik';
import LabQueue from '../../laboratory-shared/components/lab.queue';
import LaboratoriumUmumSkeleton from '../components/skeletons/laboratorium-umum.skeleton';
import { normalizeLabStatus } from '../../laboratory-shared/lab.utils';
import useGlobalStore from '../../../shared/stores/global.store';

export default function LaboratoriumUmumPage() {
    const { state: globalUser } = useGlobalStore();
    const {
        items,
        getItems,
        setPetugas,
        advanceStatus,
        submitTestingStep,
        isLoading,
        isSubmitting,
    } = useLaboratoriumUmumStore();

    React.useEffect(() => {
        setPetugas(globalUser.full_name, globalUser.nip);
        const unsubscribe = getItems();
        return () => unsubscribe();
    }, [getItems, globalUser.full_name, globalUser.nip, setPetugas]);

    const statistics = React.useMemo(
        () => ({
            pending: items.filter(
                (item) => normalizeLabStatus(item) === 'Pending',
            ).length,
            process: items.filter(
                (item) => normalizeLabStatus(item) === 'Diproses',
            ).length,
            finished: items.filter(
                (item) => normalizeLabStatus(item) === 'Selesai',
            ).length,
        }),
        [items],
    );

    if (isLoading && items.length === 0) return <LaboratoriumUmumSkeleton />;

    return (
        <LaboratoriumUmumLayout>
            <LabStatistik
                pendingCounter={statistics.pending}
                processCounter={statistics.process}
                finishedCounter={statistics.finished}
            />
            <LabQueue
                title="Laboratorium Umum"
                data={items}
                serviceType="laboratorium-umum"
                onAdvanceStatus={advanceStatus}
                onSubmitResult={submitTestingStep}
                isSubmitting={isSubmitting}
            />
        </LaboratoriumUmumLayout>
    );
}
