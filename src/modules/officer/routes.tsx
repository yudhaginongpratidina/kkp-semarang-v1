// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// skeleton
import OfficerSkeleton from './components/skeletons/officer.skeleton';

// pages
const OfficerPage = lazy(() => import('./pages/officer.page'));

export default function OfficerRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<OfficerSkeleton />}>
                        <OfficerPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
