import express, {NextFunction, Request, Response} from "express";
import csurf from "csurf";

import apiRouter from './api'
import {isProduction} from "../config";
import {restoreUser} from "../utils/auth";

const router = express.Router();

// Enable cross-site forgery protection
router.use(
    // @ts-ignore (not sure why this is needed )
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "lax",
            httpOnly: true
        }
    })
);

// Add CSRF restore endpoint
router.get("/api/csrf/restore", (req: Request, res: Response, _next: NextFunction) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.json({
        'XSRF-Token': csrfToken
    });
});

// Restore user
router.use(restoreUser);

// Attach API endpoints
router.use('/api', apiRouter);


export default router;
