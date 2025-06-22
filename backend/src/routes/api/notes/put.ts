import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { notes, pets } from '../../../database/prisma-client';
import { NoteBody, validateNote} from './helper';
import { isValidPet } from '../pets/helper';

const router = express.Router();

// create pet profile
router.put(
    '/:id', 
    validateNote,
    async (req:Request <{id: bigint}, {}, NoteBody>, res:Response<notes>) => {
        const data = req.body;

        await isValidPet(req.user?.id, req.params.id)
        
        const note = await prisma.notes.update({
            where: {
                id: req.params.id ?? -1,
            },
            data
        })

        res.json(note)
    }
);

// Export router
export default router;
