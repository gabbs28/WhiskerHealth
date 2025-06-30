//got from prisma documentation
//https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
import {PrismaClient} from '../src/prisma-client/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Write your seed data here
    const user = await prisma.users.create({
        data: {
            email: 'testz@example.com',
            first_name: 'Test1',
            last_name: 'User1',
            username: 'testz',
            password_hash: bcrypt.hashSync('Password123!', 10),
        },
    });

    const pet = await prisma.pets.create({
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
            allergies: ['Allergic to fish and chicken'],
            microchip: '123456',
            medical_condition: ['Hyperthyroid, IBS, High Blood Pressure, Food Allergies'],

        }
    })

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
        }
    })

    await prisma.user_pets.create({
        data: {
            user_id: user.id,
            pet_id: pet.id,
        },
    });
    // Log seeding is complete
    console.log('Seeding completed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});