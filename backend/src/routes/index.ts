import express, { type Request, type Response } from 'express';
import apiRouter from './api/index.js';
import { restoreUser } from '../utils/auth.js';

const router = express.Router();

// Add health endpoint for Render
router.get('/health', (_request: Request, response: Response) => {
    response.json({
        status: 'ok',
    });
});

// Add CSRF restore endpoint
router.get('/api/csrf/restore', (request: Request, response: Response) => {
    const csrfToken = request.csrfToken();

    response.cookie('XSRF-TOKEN', csrfToken);
    response.json({
        'XSRF-Token': csrfToken,
    });
});

// Restore user
router.use(restoreUser);

// Attach API endpoints
router.use('/api', apiRouter);

export default router;
