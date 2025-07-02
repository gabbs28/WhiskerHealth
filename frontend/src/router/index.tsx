import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Test from '../components/Test.tsx';
import Dashboard from '../components/Dashboard';

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
                element: <h1>Pet Detail</h1>,
            },
            {
                path: 'login',
                element: <LoginFormPage onSuccess={() => <Navigate to="/" replace />} />,
            },
            {
                path: 'signup',
                element: <SignupFormPage onSuccess={() => <Navigate to="/" replace />} />,
            },
            {
                path: 'test',
                element: <Test />,
            },
        ],
    },
]);
