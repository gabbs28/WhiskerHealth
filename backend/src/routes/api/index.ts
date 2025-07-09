import express, { type Request, type Response } from 'express';

import { requireAuth } from '../../utils/auth.js';

// Import API routers
import userRouter from './users.js';
import sessionRouter from './session.js';
import petsRouter from './pets.js';
import notesRouter from './notes.js';

const router = express.Router();

// Routes that don't require authentication or authentication is called on an endpoint-by-endpoint basis
router.use('/session', sessionRouter);
router.use('/users', userRouter);
router.get('/restore-user', async (request: Request, response: Response) => {
    response.json(request.user);
});

// Routes that require authentication
router.use('/pets', requireAuth, petsRouter);
router.use('/notes', requireAuth, notesRouter);

export default router;
