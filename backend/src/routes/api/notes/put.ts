import express, {Request, Response} from 'express';
import {prisma} from '../../../database/client';
import {NoteBody, validateNote} from './helper';
import {isValidPet} from '../pets/helper';
import {generateErrorResponse} from "../../../utils/errors";

const router = express.Router();

// update a note
router.put(
    '/:id',
    validateNote,
    async (request: Request<{ id: number }, {}, NoteBody>, response: Response) => {
        // Extract note body
        const data = request.body;

        // Get the id of the user, pet, and note
        const userId = request.user?.id
        const petId = data.pet_id;
        const noteId = request.params.id;

        // Confirm the pet belongs to the currently logged-in user
        try {
            await isValidPet(userId, petId)
        } catch (error) {
            // Log
            console.log(`user ${userId} tried to access pet ${petId}: ${error}`);

            // Return error response
            return response.json(generateErrorResponse("Forbidden", 403));
        }

        // Update the note
        const note = await prisma.notes.update({
            where: {
                id: noteId ?? -1
            },
            data
        })

        // Return the note
        response.json(note)
    }
);

// Export router
export default router;
