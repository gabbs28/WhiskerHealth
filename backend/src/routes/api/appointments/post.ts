// import express, { NextFunction, Request, Response } from 'express';
// import { prisma } from '../../../database/client';
// import { check } from 'express-validator';
// import bcrypt from 'bcryptjs';
// import { handleValidationErrors } from '../../../utils/validation';
// import { appointments } from '../../../database/prisma-client';
// import { App } from 'aws-sdk/clients/opsworks';

// const router = express.Router();

// const validateAppointments = [
//     check('info')
//         .exists({ checkFalsy: true })
//         .isLength( {
//             max: 100
//         })
//         .notEmpty()
//         .withMessage('Info is required'),
//     check('date')
//         .exists({ checkFalsy: true })
//         .notEmpty()
//         .withMessage('Date is required'),
//     handleValidationErrors
// ];

// interface AppointmentPost extends Omit<
//     // Starting model (base prisma model)
//     appointments,
//     // Excluded fields
//     'id' | 'created_at' | 'updated_at'
// > {

// }

// // create pet profile
// router.post(
//     '/',
//     validateAppointments,
//     async (req:Request <{}, {}, AppointmentPost>, res:Response<appointments>, next:NextFunction) => {
//         const data = req.body;

//         const appointment = await prisma.$transaction( async tx => {
//             const appointment = await tx.appointments.create({
//                 data
//             })

//             await tx.user_pets.create({
//                 data: {
//                     user_id: req.user?.id ?? -1,
//                     pet_id: pet.id
//                 }
//             })

//             return pet
//         })

//         res.json(appointment)

//     }
// );

// // Export router
// export default router;
