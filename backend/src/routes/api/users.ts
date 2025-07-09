import express, { type NextFunction, type Request, type Response } from 'express';
import { setTokenCookie } from '../../utils/auth.js';
import { handleValidationErrors } from '../../utils/validation.js';
import { check } from 'express-validator';
import bcrypt from 'bcryptjs';
import { prisma } from '../../database/client.js';
import { SelectSafeUser } from '../../database/selects/users.js';
import { generateErrorResponse } from '../../utils/errors.js';

const router = express.Router();

const validateSignup = [
    check('email').isEmail().withMessage('Please provide a valid email.'),
    check('username')
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username').not().isEmail().withMessage('Username cannot be an email.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (request: Request, response: Response, next: NextFunction) => {
        const { first_name, last_name, email, password, username } = request.body;

        const password_hash = bcrypt.hashSync(password);

        // Check to see if the user exists already
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            // Collect errors
            const errors: Record<string, string> = {};

            if (existingUser.email === email) {
                errors.email = 'User with that email already exists';
            }

            if (existingUser.username === username) {
                errors.username = 'User with that username already exists';
            }

            response.json(generateErrorResponse('User Already Exists', 500, errors));
        } else {
            try {
                const user = await prisma.users.create({
                    data: {
                        first_name,
                        last_name,
                        email,
                        username,
                        password_hash,
                    },
                    select: SelectSafeUser,
                });

                setTokenCookie(response, user);

                response.json(user);
            } catch (e) {
                return next(e);
            }
        }
    },
);

export default router;
