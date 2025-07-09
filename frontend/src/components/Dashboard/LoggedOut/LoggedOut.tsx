import { useModal } from '../../../context/Modal.tsx';
import LoginFormPage from '../../LoginFormPage';
import SignupFormPage from '../../SignupFormPage';
import styles from './LoggedOut.module.css';

export function LoggedOut() {
    const { setModalContent, setIsLoading, closeModal } = useModal();

    const login = () => {
        setModalContent(<LoginFormPage onLoading={setIsLoading} onSuccess={closeModal} />);
    };

    const signup = () => {
        setModalContent(<SignupFormPage onLoading={setIsLoading} onSuccess={closeModal} />);
    };

    return (
        <div className={styles.container}>
            <h1>Get your pet's medical need organized so you can focus on them.</h1>
            <div className={`${styles.buttons}`}>
                <button onClick={login}>Log In</button>
                <button onClick={signup} className={'secondary'}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}
