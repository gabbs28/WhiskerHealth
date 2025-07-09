import { csrfFetch } from './csrf';

import { AppDispatch, AppThunk } from './store.ts';
import { ThunkError } from './error.ts';
import {
    LoginCredentials,
    RemoveUserSessionAction,
    SafeUserType,
    SessionActions,
    SessionInitialState,
    SetUserSessionAction,
    SignupUser,
} from './types/session';
import z from 'zod';

//schema
//https://zod.dev/api
//this is not linked to the model directly and will need to change as the model changes
export const UserSchema = z.object({
    id: z.coerce.bigint(),
    first_name: z.string().max(100),
    last_name: z.string().max(100),
    email: z.string().email().max(100),
    username: z.string().max(100),
});

//define types
export enum SessionActionTypes {
    SET_USER = 'session/setUser',
    REMOVE_USER = 'session/removeUser',
}

//define actions
const setUserAction = (user: SafeUserType): SetUserSessionAction => ({
    type: SessionActionTypes.SET_USER,
    payload: user,
});

const removeUserAction = (): RemoveUserSessionAction => ({
    type: SessionActionTypes.REMOVE_USER,
    payload: null,
});

//define thunks
export const thunkAuthenticate = (): AppThunk => async (dispatch: AppDispatch) => {
    // Attempt to restore the current user
    const response = await csrfFetch('/api/restore-user');

    // If a response is returned, validate it
    if (response.ok) {
        // Parse response as JSON
        const data = await response.json();

        // When no session exists, this will return null so we can early out
        if (data === null) {
            return;
        }

        // If the "error" field is set, abort
        if (data?.error) {
            // Log
            console.error(data.error);

            // Abort
            return;
        }

        // Convert to users
        const parsed = UserSchema.safeParse(data);

        // If conversion was a success
        if (parsed.success) {
            // Update state
            dispatch(setUserAction(parsed.data));
        } else {
            // Unable to parse data
            throw new ThunkError('Restore User Failure', { message: parsed.error?.format() });
        }
    } else {
        throw new ThunkError('Login Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

export const thunkLogin =
    (credentials: LoginCredentials): AppThunk =>
    async (dispatch: AppDispatch) => {
        // Attempt to log in
        const response = await csrfFetch('/api/session/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Login Failure', data.errors ?? {});
            }

            // Convert to users
            const parsed = UserSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(setUserAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Login Failure', { message: parsed.error?.format() });
            }
        } else {
            throw new ThunkError('Login Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };

export const thunkSignup =
    (user: SignupUser): AppThunk =>
    async (dispatch: AppDispatch) => {
        // Attempt to create the user
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Signup Failure', data.errors ?? {});
            }

            // Convert to users
            const parsed = UserSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(setUserAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Signup Failure', { message: parsed.error?.format() });
            }
        } else {
            throw new ThunkError('Signup Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };

export const thunkLogout = (): AppThunk => async (dispatch: AppDispatch) => {
    // Attempt to log out the user
    const response = await csrfFetch('/api/session', {
        method: 'DELETE',
    });

    // If a response is returned, validate it
    if (response.ok) {
        // Parse response as JSON
        const data = await response.json();

        // If the "error" field is set, return errors
        if (data?.error) {
            throw new ThunkError('Logout Failure', data.errors ?? {});
        }

        // Update state
        dispatch(removeUserAction());
    } else {
        throw new ThunkError('Logout Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

//default state
const initialState: SessionInitialState = { user: null };

//define reducer
function sessionReducer(state = initialState, action: SessionActions): SessionInitialState {
    switch (action.type) {
        case SessionActionTypes.SET_USER:
            return { ...state, user: action.payload };
        case SessionActionTypes.REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}

export default sessionReducer;
