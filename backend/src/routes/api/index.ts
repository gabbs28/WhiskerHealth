import express, { Request, Response } from 'express';

import { requireAuth } from '../../utils/auth';

// Import API routers
import userRouter from './users';
import sessionRouter from './session';
import petsRouter from './pets';
import notesRouter from './notes';

const router = express.Router();

// Routes that don't require authentication or authentication is called on an endpoint-by-endpoint basis
router.use('/session', sessionRouter);
router.use('/users', userRouter);
router.get('/restore-user', async (req: Request, res: Response) => {
    res.json(req.user);
});

// Routes that require authentication
router.use('/pets', requireAuth, petsRouter);
router.use('/notes', requireAuth, notesRouter);

export default router;
