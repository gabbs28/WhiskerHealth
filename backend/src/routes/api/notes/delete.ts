import express, { type Request, type Response } from 'express';
import { prisma, Prisma } from '../../../database/client.js';
import { generateErrorResponse } from '../../../utils/errors.js';
import { isValidPet } from '../pets/helper.js';
import { getNoteByID } from './helper.js';

const router = express.Router();

// delete a note
router.delete('/:id', async (request: Request<{ id: string }>, response: Response) => {
    // Look up the note to see if it belongs to a pet owned by the user
    const note = await getNoteByID(request.params.id);

    // Early out if the note doesn't exist
    if (!note) {
        // Return error response
        response.json(generateErrorResponse('Not Found', 404));

        // Early out
        return;
    }

    // Get the id of the user and pet
    const userId = request.user?.id;
    const petId = note.pet_id;

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
        await prisma.notes.delete({
            where: {
                id: note.id,
            },
        });
    } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')) {
            throw error;
        }
    }

    // Success
    response.json({ message: 'Notes Deleted' });
});

// Export router
export default router;
