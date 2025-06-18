import express, { Request, Response } from 'express';
import { prisma } from '../../../database/client'

const router = express.Router();

// get pets
router.post('/', async (request: Request, response: Response) => {
    // Get all pets that belong to the current logged-in user
    const pets = await prisma.pets.findMany({
        where: {
            user_pets: {
                every: {
                    //if user is present return id property if not -1(nothing gets returned without breaking, basically user that doesn't exist)
                    user_id: request.user?.id ?? -1,
                },
            },
        },
        include: {
            pet_images: {
                select: {
                    url: true,
                },
            },
        },
    })

    //Return pets
    response.status(200).json(pets);
});

router.get('/:id', async (request: Request<{ id: number }>, response: Response) => {
    // Get pet by id (only if it belongs to the user)
    const pet = await prisma.pets.findFirstOrThrow({
        where: {
            id: request.params.id ?? -1,
            user_pets: {
                every: {
                    user_id: request.user?.id ?? -1,
                },
            },
        },
        include: {
            pet_images: {
                select: {
                    url: true,
                },
            },
        },
    });

    //Return pet
    response.status(200).json(pet);
});

// Export router
export default router;
