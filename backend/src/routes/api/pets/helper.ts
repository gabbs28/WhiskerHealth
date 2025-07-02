import { body } from 'express-validator';
import { handleValidationErrors } from '../../../utils/validation';
import { pets } from '../../../database/prisma-client/client';
import { prisma } from '../../../database/client';

export const validatePet = [
    body('name')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Name is required and must be less than 100 characters'),

    body('breed').notEmpty().withMessage('Breed is required'),

    body('birthday')
        .notEmpty()
        // isISO8601() is for date
        // https://en.wikipedia.org/wiki/ISO_8601
        .isISO8601()
        .toDate()
        .withMessage('Birthday is required and must be a valid date'),

    body('gender').notEmpty().withMessage('Gender is required'),

    body('sterilized').notEmpty().isBoolean().withMessage('Sterilized must be true or false'),

    body('weight')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('Weight is required and must be a positive number'),

    body('color').notEmpty().withMessage('Color is required'),

    body('hair_length').notEmpty().withMessage('Hair Length is required'),

    body('fur_pattern').notEmpty().withMessage('Fur Pattern is required'),

    body('allergies').notEmpty().isArray().withMessage('Allergies must be an array'),

    body('microchip')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Microchip is required and must be less than 100 characters'),

    body('medical_condition')
        .notEmpty()
        .isArray()
        .withMessage('Medical Condition must be an array'),

    handleValidationErrors,
];

export interface PetBody
    extends Omit<
        // Starting model (base prisma model)
        pets,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}

//checking if the pet belongs to user
//undefined means not set or null, will use -1 in that case
export const isValidPet = async (
    user_id: number | bigint = -1,
    pet_id: number | bigint = -1,
): Promise<pets> => {
    const pet = await prisma.user_pets.findFirstOrThrow({
        where: {
            user_id,
            pet_id,
        },
        select: {
            pets: {
                include: {
                    pet_images: true,
                },
            },
        },
    });

    return pet.pets;
};
