import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { isValidPet } from '../pets/helper';
import { NoteBody, validateNote } from './helper';

const router = express.Router();

// create a note
router.post(
    '/', 
    validateNote,
    async (req:Request <{}, {}, NoteBody>, res:Response, next:NextFunction) => {
        const data = req.body;

        try {
            await isValidPet(req.user?.id, data.pet_id)
            
            const note = await prisma.notes.create({
                data
            })

            res.json(note)
        } catch (error) {
            res.json("Could not create")
        }

    }
);

// Export router
export default router;
