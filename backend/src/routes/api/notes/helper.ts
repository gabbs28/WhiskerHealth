import { body } from 'express-validator';
import { handleValidationErrors } from '../../../utils/validation.js';
import type { notes } from '../../../database/prisma-client/client.js';
import { prisma } from '../../../database/client.js';
import { toBigIntID } from '../helper.js';

export const validateNote = [
    body('date')
        .notEmpty()
        .isISO8601()
        .toDate()
        .withMessage('Date is required and must be a valid date'),

    body('title')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Title is required and must be less than 100 characters'),

    body('pain_level').notEmpty().withMessage('Pain level is required'),

    body('fatigue_level').notEmpty().withMessage('Fatigue level is required'),

    body('activity_level').notEmpty().withMessage('Activity level is required'),

    body('appetite_level').notEmpty().withMessage('Appetite level is required'),

    body('water_intake').notEmpty().withMessage('Water intake is required'),

    body('sleep_level').notEmpty().withMessage('Sleep level is required'),

    body('regular_meds')
        .notEmpty()
        .isBoolean()
        .withMessage('Regular medications must be true or false'),

    body('relief_meds')
        .notEmpty()
        .isBoolean()
        .withMessage('Relief medications must be true or false'),

    body('notes').trim().notEmpty().withMessage('Notes are required'),

    body('pet_id').notEmpty().isInt().withMessage('Pet ID is required and must be an integer'),

    handleValidationErrors,
];

export interface NoteBody
    extends Omit<
        // Starting model (base prisma model)
        notes,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}

export const getNoteByID = async (
    id: bigint | string | undefined | null,
): Promise<notes | null> => {
    return prisma.notes.findUnique({
        where: {
            id: toBigIntID(id),
        },
    });
};
