// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// pages
const OfficerPage = lazy(() => import('./pages/officer.page'));

export default function OfficerRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={''}>
                        <OfficerPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
