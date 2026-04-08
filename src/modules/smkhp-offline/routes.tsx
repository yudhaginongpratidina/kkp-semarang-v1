// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// skeleton
import SMKHPOfflineSkeleton from './components/skeletons/smkhp-offline.skeleton';

// pages
const SMKHPOfflinePage = lazy(() => import('./pages/smkhp-offline.page'));

export default function SMKHPOfflineRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<SMKHPOfflineSkeleton />}>
                        <SMKHPOfflinePage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
