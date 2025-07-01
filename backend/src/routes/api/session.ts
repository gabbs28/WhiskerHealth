import express, { Request, Response } from 'express';
import { prisma } from '../../database/client';
import bcrypt from 'bcryptjs';
import { createSafeUser, setTokenCookie } from '../../utils/auth';
import { check } from 'express-validator';
import { handleValidationErrors } from '../../utils/validation';
import { generateErrorResponse } from '../../utils/errors';

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
router.post('/', validateLogin, async (req: Request, res: Response) => {
    const { credential, password } = req.body;

    try {
        // Check if the username and password are valid.
        const user = await prisma.users.findFirst({
            where: {
                OR: [{ username: credential }, { email: credential }],
            },
        });

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            // Return error
            return res.json(invalid);
        }

        // Set session cookie
        setTokenCookie(res, user);

        // Return user
        return res.json(createSafeUser(user));
    } catch (error) {
        // Log
        console.log(`failed to find user with credential ${credential}: ${error}`);

        // Return error
        return res.json(invalid);
    }
});

// Get current user
router.get('/', async (req: Request, res: Response) => {
    const { user } = req;
    if (user) {
        return res.json(createSafeUser(user));
    } else {
        return res.json({ user: null });
    }
});

// Log out
router.delete('/', (_req: Request, res: Response) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

export default router;
