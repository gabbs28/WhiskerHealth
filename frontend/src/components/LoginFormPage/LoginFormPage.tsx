import React, {useState} from "react";
import {thunkLogin} from "../../redux/session";
import {Navigate} from "react-router-dom";
import "./LoginForm.css";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ThunkError} from "../../redux/error.ts";

export default function LoginFormPage({ onSuccess }: Readonly<{ onSuccess: () => void }>) {
    const dispatch = useAppDispatch();

    const sessionUser = useAppSelector((state) => state.session.user);

    const [credential, setCredential] = useState<string>("testz");
    const [password, setPassword] = useState<string>("Password123!");
    const [errors, setErrors] = useState<Record<string, string>>({credential: "", password: ""});

    if (sessionUser) return <Navigate to="/" replace={true}/>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(
            thunkLogin({
                credential,
                password,
            })
        )
            .then(() => onSuccess())
            .catch(error => {
                if (error instanceof ThunkError) {
                    setErrors(error.errors);
                } else {
                    setErrors({message: error.message});
                }
            })
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label htmlFor="credential">Credential</label>
                    <input
                        id="credential"
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                    {errors.credential && <p>{errors.credential}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <div>
                    <button type="submit">Log In</button>
                </div>
            </form>
        </>
    );
}
