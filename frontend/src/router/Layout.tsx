import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Modal, ModalProvider } from '../context/Modal';
import { thunkAuthenticate } from '../redux/session';
import { useAppDispatch } from '../redux/store.ts';
import Header from '../components/Header';

export default function Layout() {
    const dispatch = useAppDispatch();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <ModalProvider>
            <Header />
            {isLoaded && <Outlet />}
            <Modal />
        </ModalProvider>
    );
}
