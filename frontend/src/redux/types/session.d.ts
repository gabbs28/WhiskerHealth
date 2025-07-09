import { users } from '../../database/client';
import { Action } from 'redux';
import { SessionActionTypes } from '../session.ts';

export interface SessionInitialState {
    user: SafeUserType | null;
}

export interface SetUserSessionAction extends Action<typeof SessionActionTypes.SET_USER> {
    payload: SafeUserType;
}

export interface RemoveUserSessionAction extends Action<typeof SessionActionTypes.REMOVE_USER> {
    payload: null;
}

export type SessionActions = SetUserSessionAction | RemoveUserSessionAction;

// Fields required to log in
// credential can be either a username or an email address
export interface LoginCredentials {
    credential: string;
    password: string;
}

// Fields for session user
// based on the Prisma user model excluding / adding fields
export type SafeUserType = Pick<
    // Starting model (base prisma model)
    users,
    // Wanted fields (required model fields)
    'id' | 'first_name' | 'last_name' | 'username' | 'email'
>;

// Fields required to create a new user
// based on the Prisma user model excluding / adding fields
export interface SignupUser
    extends Omit<
        // Starting model (base prisma model)
        users,
        // Excluded fields
        'id' | 'password_hash' | 'created_at' | 'updated_at'
    > {
    password: string;
}
