import express, { Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { getNoteByID, NoteBody, validateNote } from './helper';
import { isValidPet } from '../pets/helper';
import { generateErrorResponse } from '../../../utils/errors';

const router = express.Router();

// update a note
router.put(
    '/:id',
    validateNote,
    async (request: Request<{ id: number }, {}, NoteBody>, response: Response) => {
        // Look up the note to see if it belongs to a pet owned by the user
        const note = await getNoteByID(request.params.id);

        // Early out if the note doesn't exist
        if (!note) {
            return response.json(generateErrorResponse('Not Found', 404));
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
            return response.json(generateErrorResponse('Forbidden', 403));
        }

        // Extract note body
        const data = request.body;

        // Ensure pet_id of the posted body doesn't change
        data.pet_id = petId;

        // Update the note
        const updated = await prisma.notes.update({
            where: {
                id: note.id,
            },
            data,
        });

        // Return the note
        response.json(updated);
    },
);

// Export router
export default router;
