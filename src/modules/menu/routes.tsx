// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// pages
const MainRouterPage = lazy(() => import('./pages/main-router.page'));

export default function MenuRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={'Loading...'}>
                        <MainRouterPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
