import express, { type Request, type Response } from 'express';
import { prisma } from '../../../database/client.js';
import { isValidPet } from './helper.js';
import { generateErrorResponse } from '../../../utils/errors.js';
import { toBigIntID } from '../helper.js';

const router = express.Router();

// get pets
router.get('/', async (request: Request, response: Response) => {
    // Get the id of the user
    const userId = request.user?.id;

    // Get all pets that belong to the current logged-in user
    const pets = await prisma.user_pets.findMany({
        where: {
            user_id: userId ?? -1,
        },
        select: {
            pets: {
                include: {
                    pet_images: true,
                },
            },
        },
    });

    // Format response to be an array of pets
    const petsData = pets.map((pet) => pet.pets);

    // Return pets
    response.json(petsData);
});

router.get('/:id', async (request: Request<{ id: string }>, response: Response) => {
    // Get the id of the user and pet
    const userId = request.user?.id;
    const petId = request.params.id;

    // Confirm the pet belongs to the currently logged-in user
    try {
        // Confirm the pet belongs to the currently logged-in user
        const pet = await isValidPet(userId, petId);

        // Return the pet
        response.json(pet);
    } catch (error) {
        // Log
        console.log(`user ${userId} tried to access pet ${petId}: ${error}`);

        // Return error response
        response.json(generateErrorResponse('Forbidden', 403));
    }
});

// get all pet notes
router.get('/:id/notes', async (request: Request<{ id: string }>, response: Response) => {
    // Get the id of the user and pet
    const userId = request.user?.id;
    const petId = toBigIntID(request.params.id);

    // Confirm the pet belongs to the currently logged-in user
    try {
        await isValidPet(userId, petId);
    } catch (error) {
        // Log
        console.log(`user ${userId} tried to access pet ${petId}: ${error}`);

        // Return error response
        response.json(generateErrorResponse('Forbidden', 403));

        // Early out
        return;
    }

    // Get all notes for the pet
    const notes = await prisma.notes.findMany({
        where: {
            pet_id: petId,
        },
    });

    // Return notes
    response.json(notes);
});

// Export router
export default router;
