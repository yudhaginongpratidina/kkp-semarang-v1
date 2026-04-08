// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// skeleton
import SMKHPOnlineSkeleton from './components/skeletons/smkhp-online.skeleton';

// pages
const SMKHPOnlinePage = lazy(() => import('./pages/smkhp-online.page'));

export default function SMKHPOnlineRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<SMKHPOnlineSkeleton />}>
                        <SMKHPOnlinePage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
