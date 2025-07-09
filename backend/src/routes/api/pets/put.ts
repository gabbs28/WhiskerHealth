import express, { type Request, type Response } from 'express';
import { prisma } from '../../../database/client.js';
import { isValidPet, type PetBody, validatePet } from './helper.js';
import { generateErrorResponse } from '../../../utils/errors.js';
import { toBigIntID } from '../helper.js';

const router = express.Router();

// update pet profile
router.put(
    '/:id',
    validatePet,
    async (request: Request<{ id: string }, {}, PetBody>, response: Response) => {
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

        // Extract pet body
        const data = request.body;

        // Update the pet
        const updated = await prisma.pets.update({
            where: {
                id: petId,
            },
            data,
        });

        // Return the pet
        response.json(updated);
    },
);

// Export router
export default router;
