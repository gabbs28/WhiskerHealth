import React, { useEffect, useRef, useState } from 'react';

// Thin line cat
import { TbCat } from 'react-icons/tb';
// Simple cat face
// import {FaCat} from 'react-icons/fa';
// Game-style cat
// import {GiCat} from 'react-icons/gi';
// Material Design pet/cat icon
// import {MdPets} from 'react-icons/md';
import styles from './Header.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/store.ts';
import { thunkLogout } from '../../redux/session.ts';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const reference = useRef<HTMLDivElement>(null);

    const user = useAppSelector((store) => store.session.user);

    const [showMenu, setShowMenu] = useState<boolean>(false);

    // Close menu
    const close = (event: MouseEvent) => {
        if (reference.current && !reference.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };

    // Home
    const home = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Prevent default action
        event.preventDefault();

        // Navigate
        navigate('/');
    };

    // Logout
    const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Logout and redirect
        dispatch(thunkLogout()).then(() => {
            // Close menu
            setShowMenu(false);

            // Navigate
            navigate('/');
        });
    };

    // Attach a listener that will close the menu when the user clicks anywhere
    useEffect(() => {
        // Attach the listener
        document.addEventListener('mousedown', close);

        // Remove the listener when the page is unloaded
        return () => {
            document.removeEventListener('mousedown', close);
        };
    }, []);

    return (
        <div className={styles.container}>
            <a className={styles.brand} href={'/'} onClick={home}>
                <span>WhiskerHealth</span>
                <TbCat size={24} />
            </a>
            {user && (
                <div className={styles.menu} ref={reference}>
                    <TbCat
                        size={24}
                        className={styles.icon}
                        onClick={() => setShowMenu(!showMenu)}
                    />
                    <div className={`${styles.dropdown} ${showMenu ? styles.show : ''}`}>
                        <div className={styles.item}>Welcome {user.username}</div>
                        <button className={styles.menuItem} onClick={(event) => logout(event)}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
