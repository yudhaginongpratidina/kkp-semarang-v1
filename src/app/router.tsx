// react
import { createBrowserRouter } from 'react-router-dom';

// routing with skeleton
import AuthRoutesWithSkeleton from '../modules/auth/routes';
import MenuRoutesWithSkeleton from '../modules/menu/routes';
import OfficerRoutesWithSkeleton from '../modules/officer/routes';
import TraderRoutesWithSkeleton from '../modules/trader/routes';
import HistoryRoutesWithSkeleton from '../modules/history/routes';

import SMKHPOfflineRoutesWithSkeleton from '../modules/smkhp-offline/routes';

// main router
export const router = createBrowserRouter([
    {
        path: '/*',
        Component: MenuRoutesWithSkeleton,
    },
    {
        path: '/auth/*',
        Component: AuthRoutesWithSkeleton,
    },
    {
        path: '/officers/*',
        Component: OfficerRoutesWithSkeleton,
    },
    {
        path: '/traders/*',
        Component: TraderRoutesWithSkeleton,
    },
    {
        path: '/history/*',
        Component: HistoryRoutesWithSkeleton,
    },
    {
        path: '/smkhp-offline/*',
        Component: SMKHPOfflineRoutesWithSkeleton,
    },
]);
