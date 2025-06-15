import { users } from "../prisma-client";

//second const means you cant edit the object
export const SelectSafeUser = {
    id: true,
    first_name: true,
    last_name: true,
    username: true,
    email: true,
} as const;

export type SafeUserType = Pick<
    // Starting model (base prisma model)
    users,
    // Wanted fields (required model fields)
    'id' | 'first_name' | 'last_name' | 'username' | 'email'
>

