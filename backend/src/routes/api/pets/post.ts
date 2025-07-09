import express, { type Request, type Response } from 'express';
import { prisma } from '../../../database/client.js';
import type { pets } from '../../../database/prisma-client/client.js';
import { isValidPet, type PetBody, validatePet } from './helper.js';
import { type NoteBody, validateNote } from '../notes/helper.js';
import { generateErrorResponse } from '../../../utils/errors.js';

const router = express.Router();

// create pet profile
router.post(
    '/',
    validatePet,
    async (request: Request<{}, {}, PetBody>, response: Response<pets>) => {
        // Extract pet body
        const data = request.body;

        // Create pet and link to the current user using a transaction
        const pet = await prisma.$transaction(async (tx) => {
            // Create the pet
            const pet = await tx.pets.create({
                data,
            });

            // Link pet to the current user
            await tx.user_pets.create({
                data: {
                    user_id: request.user?.id ?? -1,
                    pet_id: pet.id,
                },
            });

            // Return the pet
            return pet;
        });

        // Return the pet
        response.json(pet);
    },
);

// create a note for the pet
router.post(
    '/:id/notes',
    validateNote,
    async (request: Request<{ id: string }, {}, NoteBody>, response: Response) => {
        // Get the id of the user and pet
        const userId = request.user?.id;
        const petId = request.params.id;

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

        // Extract note body
        const data = request.body;

        // Create the note
        const note = await prisma.notes.create({
            data,
        });

        // Return the note
        response.json(note);
    },
);

// Export router
export default router;
