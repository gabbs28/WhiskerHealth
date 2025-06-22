import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { pets } from '../../../database/prisma-client';
import { PetBody, validatePet, isValidPet } from './helper';
import { PetsScalarFieldEnum } from '../../../database/prisma-client/internal/prismaNamespace';


const router = express.Router();

// create pet profile
router.put(
    '/:id', 
    validatePet,

    async (req:Request <{id: bigint}, {}, PetBody>, res:Response<pets>) => {
        const data = req.body;

        await isValidPet(req.user?.id, req.params.id)
        
        const pet = await prisma.pets.update({
            where: {
                id: req.params.id ?? -1,
            },
            data
        })

        res.json(pet)
    }
);

// Export router
export default router;
