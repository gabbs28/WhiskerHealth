import {body} from 'express-validator';
import {handleValidationErrors} from '../../../utils/validation';
import {pets} from '../../../database/prisma-client/client';
import {prisma} from '../../../database/client';

export const validatePet = [
    body('name')
        .exists({checkFalsy: true})
        .isLength({
            max: 100
        })
        .notEmpty()
        .withMessage('Name is required'),
    body('breed')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Breed is required'),
    body('birthday')
        .exists({checkFalsy: true})
        .isDate()
        .notEmpty()
        .withMessage('Birthday is required'),
    body('gender')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Gender is required'),
    body('sterilized')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Sterilized is required'),
    body('weight')
        .exists({checkFalsy: true})
        .isDecimal()
        .notEmpty()
        .withMessage('Weight is required'),
    body('color')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Color is required'),
    body('hair_length')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Hair Length is required'),
    body('fur_pattern')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Fur Pattern is required'),
    body('allergies')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Allergies is required'),
    body('microchip')
        .exists({checkFalsy: true})
        .isLength({
            max: 100
        })
        .notEmpty()
        .withMessage('Microchip is required'),
    body('medical_condition')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Medical Condition is required'),
    handleValidationErrors
];


export interface PetBody extends Omit<
    // Starting model (base prisma model)
    pets,
    // Excluded fields
    'id' | 'created_at' | 'updated_at'
> {

}

//checking if the pet belongs to user
//undefined means not set or null, will use -1 in that case
export const isValidPet = async (user_id: number | bigint = -1, pet_id: number | bigint = -1): Promise<pets> => {
    const pet = await prisma.user_pets.findFirstOrThrow({
        where: {
            user_id,
            pet_id
        },
        select: {
            pets: {
                include: {
                    pet_images: true,
                }
            }
        },
    })

    return pet.pets
}