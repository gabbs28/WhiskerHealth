import { users } from '../database/prisma-client/client.ts';

declare global {
    namespace Express {
        interface Request {
            user: users | null;
        }
    }
}
