import { body } from 'express-validator';
import { handleValidationErrors } from '../../../utils/validation';
import { notes } from '../../../database/prisma-client/client';
import { prisma } from '../../../database/client';

export const validateNote = [
    body('date').exists({ checkFalsy: true }).notEmpty().withMessage('Date is required'),
    body('title')
        .exists({ checkFalsy: true })
        .isLength({
            max: 100,
        })
        .notEmpty()
        .withMessage('Title is required'),
    body('pain_level').exists({ checkFalsy: true }).notEmpty().withMessage('Pain is required'),
    body('fatigue_level')
        .exists({ checkFalsy: true })
        .isDate()
        .notEmpty()
        .withMessage('Fatigue Level is required'),
    body('activity_level')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Activity Level is required'),
    body('appetite_level')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Appetite Level is required'),
    body('water_intake')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Water Intake is required'),
    body('sleep_level')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Sleep Level is required'),
    body('regular_meds')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Regular Meds is required'),
    body('relief_meds')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Relief Meds is required'),
    body('fecal_score')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Fecal Score is required'),
    body('fecal_color')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Fecal Color is required'),
    body('urine_color')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Urine Color is required'),
    body('notes').exists({ checkFalsy: true }).notEmpty().withMessage('Notes is required'),
    body('pet_id').isInt().notEmpty(),
    handleValidationErrors,
];

export interface NoteBody
    extends Omit<
        // Starting model (base prisma model)
        notes,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}

export const getNoteByID = async (id: number | bigint = -1): Promise<notes | null> => {
    return prisma.notes.findUnique({
        where: {
            id,
        },
    });
};
