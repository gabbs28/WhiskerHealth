import express, { type Request, type Response } from 'express';
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import { createSafeUser, setTokenCookie } from '../../utils/auth.js';
import { check } from 'express-validator';
import { handleValidationErrors } from '../../utils/validation.js';
import { generateErrorResponse } from '../../utils/errors.js';

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
    handleValidationErrors,
];

const invalid = generateErrorResponse('Invalid Credentials', 401, {
    credential: 'The provided credentials were invalid.',
    password: 'The provided credentials were invalid.',
});

// Log in
router.post('/', validateLogin, async (request: Request, response: Response) => {
    const { credential, password } = request.body;

    try {
        // Check if the username and password are valid.
        const user = await prisma.users.findFirst({
            where: {
                OR: [{ username: credential }, { email: credential }],
            },
        });

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            // Return error
            response.json(invalid);

            // Early out
            return;
        }

        // Set session cookie
        setTokenCookie(response, user);

        // Return user
        response.json(createSafeUser(user));
    } catch (error) {
        // Log
        console.log(`failed to find user with credential ${credential}: ${error}`);

        // Return error
        response.json(invalid);
    }
});

// Get current user
router.get('/', async (request: Request, response: Response) => {
    const { user } = request;

    if (user) {
        response.json(createSafeUser(user));
    } else {
        response.json({ user: null });
    }
});

// Log out
router.delete('/', (_request: Request, response: Response) => {
    response.clearCookie('token');
    response.json({ message: 'success' });
});

export default router;
