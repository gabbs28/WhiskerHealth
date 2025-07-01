import { users } from '../database/prisma-client/client';

declare global {
    namespace Express {
        interface Request {
            user?: users;
        }
    }
}
