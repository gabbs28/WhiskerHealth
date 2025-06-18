import express, { Request, Response } from 'express';
import { prisma, Prisma } from '../../../database/client'
// import { PrismaClient, Prisma } from '@prisma/client'

const router = express.Router();

// get pets
router.delete('/:petId', async (request: Request<{ petId: number }>, response: Response) => {
    // Get all pets that belong to the current logged-in user
    try {
        await prisma.pets.delete({
            where: {
                id: request.params.petId ?? -1,
                user_pets: {
                    every: {
                        user_id: request.user?.id ?? -1,
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
    response.status(200).json({ message: "Pet has been deleted" });
});

// Export router
export default router;


/*
DELETE FROM pets
JOIN user_pets ON (pets.id + user_pets.pet_id)
WHERE pets.id = petId
AND user_pets.user_id = request.user.id
*/
