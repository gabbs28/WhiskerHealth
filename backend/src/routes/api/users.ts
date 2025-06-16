import { NextFunction, Request, Response } from 'express';
import { AuthReq } from "../../typings/express";
import { setTokenCookie, restoreUser } from "../../utils/auth";
import { handleValidationErrors } from '../../utils/validation';
import { check } from 'express-validator';
import bcrypt from 'bcryptjs';
import { prisma } from '../../database/client';
import { createSafeUser } from '../../utils/auth';
import { errors } from '../../typings/errors';
import { SelectSafeUser } from '../../database/selects/users';


const router = require('express').Router();

const validateSignup = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password, username } = req.body;
    const password_hash = bcrypt.hashSync(password);

    //checking if user exists already
    const existingUser = await prisma.users.findFirst({
        where: {
            OR : [{username}, {email}]
        }
    })

    if (existingUser) {
        let errors: errors = {}

        if (existingUser.email === email) {
            errors["email"] = "User with that email already exists";
        }
        if (existingUser.username === username) {
            errors["username"] = "User with that username already exists";
        }
        res.status(500)
        return res.json({ message: "User already exists", errors })
    } else {
        try {
            const user = await prisma.users.create({
                data: {
                    first_name, last_name, email, username, password_hash
                },
                select: SelectSafeUser
            })

            await setTokenCookie(res, user);

            return res.json(
                user,

            );
        } catch (e) {
            return next(e)
        }
    }
}
);
// Restore session user
router.get('/', restoreUser, async (req: AuthReq, res: Response) => {
    const { user } = req;
    if (user) {
        const safeUser = createSafeUser(user);
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});

//get all users
router.get('/all', async (_req: Request, res: Response) => {

    const users = await prisma.users.findMany({
        select: SelectSafeUser,
        orderBy: [
            {
                last_name : "desc"
            },
            {
                first_name : "desc"
            }
        ]
    })

    res.json(users)
})


// router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         req.params.
//         const userId = req.params.id;
//         if (userId !== String(userId)) {

//             const user = await User.findByPk(userId);
//             if (!user) throw new NoResourceError("No user found with those credentials", 404);
//             user.destroy();
//             res.status(202);
//             res.json({ user: null });
//         } else {
//             throw new Error("You can not delete the Demo User account.")
//         }
//     } catch (error) {
//         next(error);
//     }
// })




export = router;