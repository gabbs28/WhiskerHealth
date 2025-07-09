import React, { useEffect, useState } from 'react';
import { thunkLogin } from '../../redux/session';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import form from '../../css/form.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { ThunkError } from '../../redux/error.ts';

interface LoginFormPageProperties {
    onLoading: (loading: boolean) => void;
    onSuccess: () => void;
}

export function LoginFormPage({ onLoading, onSuccess }: Readonly<LoginFormPageProperties>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector((state) => state.session.user);

    const [credential, setCredential] = useState<string>('testz');
    const [password, setPassword] = useState<string>('Password123!');
    const [errors, setErrors] = useState<Record<string, string>>({ credential: '', password: '' });

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent default action
        event.preventDefault();

        // Set loading
        onLoading(true);

        // Send request
        dispatch(
            thunkLogin({
                credential,
                password,
            }),
        )
            .then(() => onSuccess())
            .catch((error) => {
                // Update errors
                if (error instanceof ThunkError) {
                    setErrors(error.errors);
                } else {
                    setErrors({ message: error.message });
                }
            })
            .finally(() => {
                // Clear loading
                onLoading(false);
            });
    };

    // Redirect if already signed in
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className={`${form.container} ${styles.container}`}>
            <h1>Log In</h1>
            <form className={`${form.form} ${styles.form}`} onSubmit={submit}>
                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="credential">Credential</label>
                    <input
                        id="credential"
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                    {errors.credential && (
                        <p className={`${form.error} ${styles.error}`}>{errors.credential}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && (
                        <p className={`${form.error} ${styles.error}`}>{errors.password}</p>
                    )}
                </div>

                {errors.message && (
                    <div className={`${form.row} ${styles.row}`}>
                        <p className={`${form.error} ${styles.error}`}>{errors.message}</p>
                    </div>
                )}

                <div className={`${form.button} ${styles.buttons}`}>
                    <button type="submit" className={`${form.button} ${styles.button}`}>
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
}
