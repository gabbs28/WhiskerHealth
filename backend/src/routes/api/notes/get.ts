import express, { Request, Response } from 'express';
import { prisma } from '../../../database/client'

const router = express.Router();

router.get('/:id', async (request: Request<{ id: number }>, response: Response) => {
    // Get note by id (only if it belongs to the user)
    const pet = await prisma.notes.findFirstOrThrow({
        where: {
                id: request.params.id ?? -1,
                pets: {
                    user_pets: {
                        every: {
                            //if user is present return id property if not -1(nothing gets returned without breaking, basically user that doesn't exist)
                            user_id: request.user?.id ?? -1,
                        },
                    },
                }
            }
    });

    //Return pet
    response.status(200).json(pet);
});

// Export router
export default router;
