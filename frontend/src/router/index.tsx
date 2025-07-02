import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Test from '../components/Test.tsx';
import Dashboard from '../components/Dashboard';
import { PetProfile } from '../components/PetProfile/PetProfile.tsx';

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
                path: 'pet/:id/edit',
                element: <h1>Pet Edit</h1>,
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
