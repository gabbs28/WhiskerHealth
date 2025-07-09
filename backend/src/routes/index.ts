import express, { type Request, type Response } from 'express';
import csurf from 'csurf';

import apiRouter from './api/index.js';
import { isProduction } from '../config/index.js';
import { restoreUser } from '../utils/auth.js';

const router = express.Router();

// Enable cross-site forgery protection
router.use(
    // the library hasn't been updated in over five years, see replacement csrf-csrf
    // https://www.npmjs.com/package/csrf-csrf
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'lax',
            httpOnly: true,
        },
    }),
);

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
