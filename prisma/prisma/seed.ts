//got from prisma documentation
//https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
import { PrismaClient } from '../src/prisma-client';
import * as bcrypt from 'bcryptjs';

const primsa = new PrismaClient();

async function main() {
    // Write your seed data here
    await primsa.users.create({
        data: {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            username: 'test',
            password_hash: bcrypt.hashSync('Password123!', 10),
        },
    });

    // Log seeding is complete
    console.log('Seeding completed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
