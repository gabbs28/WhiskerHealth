import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { pets } from '../../../database/prisma-client';
import { PetBody, validatePet } from './helper';

const router = express.Router();

// create pet profile
router.post(
    '/', 
    validatePet,
    async (req:Request <{}, {}, PetBody>, res:Response<pets>, next:NextFunction) => {
        const data = req.body;
        
        const pet = await prisma.$transaction( async tx => {
            const pet = await tx.pets.create({
                data
            })

            await tx.user_pets.create({
                data: {
                    user_id: req.user?.id ?? -1,
                    pet_id: pet.id
                }
            })

            return pet
        })

        res.json(pet)

    }
);

// Export router
export default router;
