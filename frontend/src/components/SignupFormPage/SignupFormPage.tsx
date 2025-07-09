import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { thunkSignup } from '../../redux/session';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { ThunkError } from '../../redux/error.ts';
import styles from './SignupForm.module.css';
import form from '../../css/form.module.css';

interface SignupFormPageProperties {
    onLoading: (loading: boolean) => void;
    onSuccess: () => void;
}

export function SignupFormPage({ onLoading, onSuccess }: Readonly<SignupFormPageProperties>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector((state) => state.session.user);

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent default action
        event.preventDefault();

        // Validate required fields
        if (password !== confirmPassword) {
            return setErrors({
                password_confirmation:
                    'Confirm Password field must be the same as the Password field',
            });
        }

        // Set loading
        onLoading(true);

        // Send request
        dispatch(
            thunkSignup({
                first_name: firstName,
                last_name: lastName,
                email,
                username,
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
            <h1>Sign Up</h1>
            <form className={`${form.form} ${styles.form}`} onSubmit={submit}>
                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className={`${form.error} ${styles.error}`}>{errors.email}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {errors.username && (
                        <p className={`${form.error} ${styles.error}`}>{errors.username}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    {errors.first_name && (
                        <p className={`${form.error} ${styles.error}`}>{errors.first_name}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        id="last_name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    {errors.last_name && (
                        <p className={`${form.error} ${styles.error}`}>{errors.last_name}</p>
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

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.password_confirmation && (
                        <p className={`${form.error} ${styles.error}`}>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {errors.message && (
                    <div className={`${form.row} ${styles.row}`}>
                        <p className={`${form.error} ${styles.error}`}>{errors.message}</p>
                    </div>
                )}

                <div className={`${form.buttons} ${styles.buttons}`}>
                    <button type="submit" className={`${form.button} ${styles.button}`}>
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}
