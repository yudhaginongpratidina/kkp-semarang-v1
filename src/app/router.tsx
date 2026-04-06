// react
import { createBrowserRouter } from 'react-router-dom';

// routing with skeleton
import AuthRoutesWithSkeleton from '../modules/auth/routes';
import MenuRoutesWithSkeleton from '../modules/menu/routes';

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
]);
