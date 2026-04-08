// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// skeleton
import CustomerServiceOfflineSkeleton from './components/skeletons/customer-service-offline.skeleton';

// pages
const CustomerServiceOfflinePage = lazy(
    () => import('./pages/customer-service-offline.page'),
);

export default function CustomerServiceOfflineRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<CustomerServiceOfflineSkeleton />}>
                        <CustomerServiceOfflinePage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
