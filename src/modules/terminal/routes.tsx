// react
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// pages
const TerminalPage = lazy(() => import('./pages/terminal.page'));

export default function TerminalRoutesWithSkeleton() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={'Loading...'}>
                        <TerminalPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
