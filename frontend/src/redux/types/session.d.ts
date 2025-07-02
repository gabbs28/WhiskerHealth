import { users } from '../../database/client';

export interface SessionInitialState {
    user: users | null;
}

export type SessionActionPayload = users | null;

// Fields required to log in
// credential can be either a username or an email address
export interface LoginCredentials {
    credential: string;
    password: string;
}

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
