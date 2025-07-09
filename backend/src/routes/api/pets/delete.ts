import express, { type Request, type Response } from 'express';
import { prisma, Prisma } from '../../../database/client.js';
import { isValidPet } from './helper.js';
import { generateErrorResponse } from '../../../utils/errors.js';
import { toBigIntID } from '../helper.js';

const router = express.Router();

// get pets
router.delete('/:id', async (request: Request<{ id: string }>, response: Response) => {
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

    // Get all pets that belong to the current logged-in user
    try {
        await prisma.pets.delete({
            where: {
                id: petId,
            },
        });
    } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')) {
            throw error;
        }
    }

    // Success
    response.json({ message: 'Pets Deleted' });
});

// Export router
export default router;
