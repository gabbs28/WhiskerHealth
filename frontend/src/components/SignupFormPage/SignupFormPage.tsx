import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import {thunkSignup} from "../../redux/session";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ThunkError} from "../../redux/error.ts";

export default function SignupFormPage({ onSuccess }: Readonly<{ onSuccess: () => void }>) {
    const dispatch = useAppDispatch();

    const sessionUser = useAppSelector((state) => state.session.user);

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: ""
    });

    if (sessionUser) return <Navigate to="/" replace={true}/>;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            return setErrors({
                password_confirmation: "Confirm Password field must be the same as the Password field",
            });
        }

        dispatch(
            thunkSignup({
                first_name: firstName,
                last_name: lastName,
                email,
                username,
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
            <h1>Sign Up</h1>
            <form onSubmit={(event) => handleSubmit(event)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    {errors.first_name && <p>{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        id="last_name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    {errors.last_name && <p>{errors.last_name}</p>}
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
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.password_confirmation && <p>{errors.password_confirmation}</p>}
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </>
    );
}
