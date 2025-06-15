import { NextFunction, Request, Response } from "express";
import { CredError, InvalidCredentialError, LoginError } from "../../errors/customErrors";
import {prisma} from '../../database/client'


import express from 'express';
// import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

import { setTokenCookie, restoreUser } from '../../utils/auth';


// import db from '../../db/models';
// import { LoginUser } from "../../typings/data";
// const {User} = db


import { check } from 'express-validator';
import { handleValidationErrors } from '../../utils/validation';

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

// Log in
router.post(
    '/',
    validateLogin,
    async (req:Request, res:Response, next:NextFunction) => {
        const { credential, password } = req.body;
            if(credential && password){
                try{
                        // Check if the username and password are valid.
                    const user = await prisma.users.findFirst({
                        where: { 
                            OR : [{username: credential}, {email: credential}]
                        },
                    });
                // let user = await User.unscoped().findOne({
                //     where: {
                //         [Op.or]: {
                //             username: credential,
                //             email: credential,
                //         },
                //     }
                // });

                if (!user || !bcrypt.compareSync(password, user.password_hash)) {
                    const err = new LoginError('Invalid credentials', 401);
                    err.status = 401;
                    throw err
                }


                await setTokenCookie(res, user);

                //safeuser
                let loginUser = {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                }
                return res.json({
                    ...loginUser
                });

            } catch (e){
                return next(e);
            }
        } else {
            try {
                const errors:CredError = {}

                if(!credential && !password){

                    errors.credential = "Email or username is required";
                    errors.password = "Password is required";
                    throw new InvalidCredentialError("Please pass in a valid username/email and password", errors)

                } else if (!credential && password){

                    errors.credential = "Email or username is required";
                    throw new InvalidCredentialError("Please pass in a valid username/email", errors)

                } else if(credential && !password){
                    errors.password = "Password is required";
                    throw new InvalidCredentialError("Please pass in a valid password", errors)
                } else {
                    errors.credential = "Server Error processing your credential";
                    errors.password = "Server Error processing your password";
                    throw new InvalidCredentialError("There was an error submitting your form. Please Try Again", errors, 500)
                }
            } catch (err){
                return next(err)
            }
        }
    }
);

//get the current user
router.get('/', restoreUser, async(req:any, res:Response) => {
    if(req.user){
        const user = await req.user.getSafeUser();
        res.json({user})
    } else {
        res.json({"user": null})
    }
})


// Log out
router.delete('/', (_req:Request, res:Response) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});


export = router;
