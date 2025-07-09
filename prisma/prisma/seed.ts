// https://www.npmjs.com/package/json-with-bigint
// Handle BigInt correctly and uniformly between seeding, backend, and frontend
// Should be loaded in the entrypoint file to ensure proper usage
// JSONParse('{"someBigNumber":9007199254740992}')
// JSONStringify({ someBigNumber: 9007199254740992n })
import { JSONParse, JSONStringify } from 'json-with-bigint';
JSON.stringify = JSONStringify;
JSON.parse = JSONParse;

//got from prisma documentation
//https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
import { PrismaClient } from '../src/prisma-client/client.js';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Log seeding is starting
    console.log('Seeding starting');

    // Write your seed data here
    // User
    const user = await prisma.users.upsert({
        where: {
            email: 'testz@example.com',
        },
        update: {}, // No updates if exists
        create: {
            email: 'testz@example.com',
            first_name: 'Test1',
            last_name: 'User1',
            username: 'testz',
            password_hash: bcrypt.hashSync('Password123!', 10),
        },
    });

    // Pet
    const existingPet = await prisma.pets.findFirst({
        where: {
            AND: [
                { name: 'Muffin' },
                { microchip: '123456' },
                { birthday: new Date('2024-06-15T14:30:00Z') },
            ],
        },
    });

    const pet =
        existingPet ||
        (await prisma.pets.create({
            data: {
                name: 'Muffin',
                breed: 'American_Shorthair',
                birthday: new Date('2024-06-15T14:30:00Z'),
                gender: 'Female',
                sterilized: true,
                weight: 10,
                color: 'Orange',
                hair_length: 'Short_hair',
                fur_pattern: 'Bi_Color',
                allergies: ['Fish', 'Chicken'],
                microchip: '123456',
                medical_condition: ['Food Allergies', 'High Blood Pressure', 'Hyperthyroid', 'IBS'],
            },
        }));

    // Notes
    const existingNote = await prisma.notes.findFirst({
        where: {
            AND: [
                { pet_id: pet.id },
                { date: new Date('2024-06-15T14:30:00Z') },
                { title: 'Mild Allergic Reaction' },
            ],
        },
    });

    if (!existingNote) {
        await prisma.notes.create({
            data: {
                pet_id: pet.id,
                date: new Date('2024-06-15T14:30:00Z'),
                title: 'Mild Allergic Reaction',
                pain_level: 'Low',
                fatigue_level: 'Medium',
                activity_level: 'Medium',
                appetite_level: 'High',
                water_intake: 'Medium',
                sleep_level: 'Medium',
                regular_meds: true,
                relief_meds: false,
                fecal_score: 'Firm_but_not_hard',
                fecal_color: 'Brown',
                urine_color: 'Brown',
                notes: 'Sneezing and some itching observed after going outside.',
            },
        });
    }

    // User <-> Pet
    const existingUserPet = await prisma.user_pets.findFirst({
        where: {
            AND: [{ user_id: user.id }, { pet_id: pet.id }],
        },
    });

    if (!existingUserPet) {
        await prisma.user_pets.create({
            data: {
                user_id: user.id,
                pet_id: pet.id,
            },
        });
    }

    // Log seeding is complete
    console.log('Seeding completed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
