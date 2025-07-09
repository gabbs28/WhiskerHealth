import express, { type Request, type Response } from 'express';
import { generateErrorResponse } from '../../../utils/errors.js';
import { isValidPet } from '../pets/helper.js';
import { getNoteByID } from './helper.js';

const router = express.Router();

// get all notes for a pet
// see pets get.ts

// Get note by id
router.get('/:id', async (request: Request<{ id: string }>, response: Response) => {
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

    //Return the note
    response.json(note);
});

// Export router
export default router;
