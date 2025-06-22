import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { check, body } from 'express-validator';
import bcrypt from 'bcryptjs';
import { handleValidationErrors } from '../../../utils/validation';
import { notes } from '../../../database/prisma-client';
import { isValidPet } from '../pets/helper';

const router = express.Router();

const validateNote = [
    check('date') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Date is required'),
    check('title') 
        .exists({ checkFalsy: true })
        .isLength( {
            max: 100
        })
        .notEmpty()
        .withMessage('Title is required'),
    check('pain_level') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Pain is required'),
    check('fatigue_level') 
        .exists({ checkFalsy: true })
        .isDate()
        .notEmpty()
        .withMessage('Fatigue Level is required'),
    check('activity_level') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Activity Level is required'),
    check('appetite_level') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Appetite Level is required'),
    check('water_intake') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Water Intake is required'),
    check('sleep_level') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Sleep Level is required'),
    check('regular_meds') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Regular Meds is required'),
    check('relief_meds') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Relief Meds is required'),
    check('fecal_score') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Fecal Score is required'),
    check('fecal_color') 
        .exists({ checkFalsy: true })     
        .notEmpty()
        .withMessage('Fecal Color is required'),
    check('urine_color') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Urine Color is required'),
    check('notes') 
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Notes is required'),
    body('pet_id')
        .isInt()
        .notEmpty(),
    handleValidationErrors
];


interface NotesPost extends Omit<
    // Starting model (base prisma model)
    notes,
    // Excluded fields
    'id' | 'created_at' | 'updated_at'
> {

}

// create pet profile
router.post(
    '/', 
    validateNote,
    async (req:Request <{}, {}, NotesPost>, res:Response, next:NextFunction) => {
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
