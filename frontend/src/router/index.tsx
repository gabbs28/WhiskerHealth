import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Test from '../components/Test.tsx';
import Dashboard from '../components/Dashboard';
import PetProfile from '../components/PetProfile';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: 'pet/:id',
                element: <PetProfile />,
            },
            {
                path: 'test',
                element: <Test />,
            },
        ],
    },
]);
