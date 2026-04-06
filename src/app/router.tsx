// react
import { createBrowserRouter } from 'react-router-dom';

// routing with skeleton
import AuthRoutesWithSkeleton from '../modules/auth/routes';

// main router
export const router = createBrowserRouter([
    {
        path: '/auth/*',
        Component: AuthRoutesWithSkeleton,
    },
]);
