import express, { Request, Response } from 'express';
import { prisma } from '../../../database/client'
import { isValidPet } from './helper';

const router = express.Router();

// get pets
router.get('/', async (request: Request, response: Response) => {
    // Get all pets that belong to the current logged-in user
    const pets = await prisma.user_pets.findMany({
            where: {
                user_id: request.user?.id ?? -1,
            },
            select: {
                pets: {
                    include: {
                        pet_images: true,
                    }
                }
            },
        })

    const petsData = pets.map(pet => pet.pets)
    //Return pets
    response.status(200).json(petsData);
});

router.get('/:id', async (request: Request<{ id: number }>, response: Response) => {
    // Get pet by id (only if it belongs to the user)
    const pet = await prisma.user_pets.findFirstOrThrow({
            where: {
                user_id: request.user?.id ?? -1,
                pet_id: request.params.id
            },
            select: {
                pets: {
                    include: {
                        pet_images: true,
                    }
                }
            },
        })

    //Return pet
    response.status(200).json(pet.pets);
});

// get all pet notes
router.get('/:id/notes', async (request: Request<{ id: number }>, response: Response) => {
    // Get all notes that belong to the current logged-in user
    await isValidPet(request.user?.id, request.params.id)
    const notes = await prisma.notes.findMany({
        where: {
            pet_id: request.params.id ?? -1,
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

    //Return notes
    response.status(200).json(notes);
});

// Export router
export default router;
