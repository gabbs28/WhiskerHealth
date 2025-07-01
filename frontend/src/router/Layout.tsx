import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Modal, ModalProvider } from '../context/Modal';
import { thunkAuthenticate } from '../redux/session';
import Navigation from '../components/Navigation/Navigation';
import { useAppDispatch } from '../redux/store.ts';

export default function Layout() {
    const dispatch = useAppDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <ModalProvider>
            <Navigation />
            {isLoaded && <Outlet />}
            <Modal />
        </ModalProvider>
    );
}
