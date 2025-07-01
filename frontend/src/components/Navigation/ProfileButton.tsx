import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from '../../redux/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import SignupFormPage from '../SignupFormPage';
import LoginFormPage from '../LoginFormPage';
import { useModal } from '../../context/Modal.tsx';

export default function ProfileButton() {
    const dispatch = useAppDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const user = useAppSelector((store) => store.session.user);
    const ulRef = useRef<any>();
    const { closeModal } = useModal();

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e: any) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        dispatch(thunkLogout()).then(closeMenu);
    };

    return (
        <>
            <button onClick={(e) => toggleMenu(e)}>
                <FaUserCircle />
            </button>
            {showMenu && (
                <ul className={'profile-dropdown'} ref={ulRef}>
                    {user ? (
                        <>
                            <li>{user.username}</li>
                            <li>{user.email}</li>
                            <li>
                                <button onClick={(e) => logout(e)}>Log Out</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormPage onSuccess={closeModal} />}
                            />
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormPage onSuccess={closeModal} />}
                            />
                        </>
                    )}
                </ul>
            )}
        </>
    );
}
