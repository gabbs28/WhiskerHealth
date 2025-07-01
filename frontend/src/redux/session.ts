import { csrfFetch } from './csrf';
import { ActionCreator } from './types/redux';

import { AppDispatch, AppThunk } from './store.ts';
import { ThunkError } from './error.ts';
import { users } from '../database/client.ts';
import {
    LoginCredentials,
    SessionActionPayload,
    SessionInitialState,
    SignupUser,
} from './types/session';

//define types
export enum SessionActionTypes {
    SET_USER = 'session/setUser',
    REMOVE_USER = 'session/removeUser',
}

//define actions
const setUser = (user: users): ActionCreator<SessionActionTypes, users> => ({
    type: SessionActionTypes.SET_USER,
    payload: user,
});

const removeUser = (): ActionCreator<SessionActionTypes, null> => ({
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

        // If the "error" field is set, abort
        if (data?.error) {
            return;
        }

        // Update state
        dispatch(setUser(data));
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

            // Update state
            dispatch(setUser(data));
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

            // Update state
            dispatch(setUser(data));
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
        dispatch(removeUser());
    } else {
        throw new ThunkError('Logout Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

//default state
const initialState: SessionInitialState = { user: null };

//define reducer
function sessionReducer(
    state = initialState,
    action: ActionCreator<SessionActionTypes, SessionActionPayload>,
): SessionInitialState {
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
