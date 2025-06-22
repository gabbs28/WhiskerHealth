import express, { Request, Response } from 'express';
import { prisma, Prisma } from '../../../database/client'
// import { PrismaClient, Prisma } from '@prisma/client'

const router = express.Router();

// get notes
router.delete('/:id', async (request: Request<{ id: number }>, response: Response) => {
    // Get all pets that belong to the current logged-in user
    try {
        await prisma.notes.delete({
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
        })
    } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code ==='P2025')) {
            throw error
        }
        
    }
    //Return pets
    response.status(200).json({ message: "Note has been deleted" });
});

// Export router
export default router;


/*

*/
