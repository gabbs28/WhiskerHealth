import {NextFunction, Request, Response} from 'express';
import {SafeUserType} from "../database/selects/users";
import jwt from 'jsonwebtoken';
import {jwtConfig} from '../config';
import {prisma} from "../database/client";
import {generateErrorResponse} from "./errors";

const {secret, expiresIn} = jwtConfig;

export const createSafeUser = (user: SafeUserType) => {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username
    };
}

// Sends a JWT Cookie
// Accept any objects in the shape of a safe user 
export const setTokenCookie = (res: Response, user: SafeUserType) => {
    // Create the token.
    const safeUser = createSafeUser(user);

    const token = jwt.sign(
        {data: safeUser},
        secret,
        {expiresIn: expiresIn} // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "lax"
    });

    return token;
};

export const restoreUser = (req: any, res: any, next: NextFunction) => {
    // token parsed from cookies
    const {token} = req.cookies;
    req.user = null;

    return jwt.verify(token as string, secret, async (err, jwtPayload) => {
        if (err) {
            next();
            return;
        }

        //If the payload is unexpected form clear the cookie and continue
        if (jwtPayload === undefined || typeof jwtPayload === "string") {
            // Clear cookie
            res.clearCookie('token');

            // Continue
            return next();
        }

        // Get user id from payload
        const {id} = jwtPayload.data;

        // Verify the user still exists in the database
        try {
            req.user = await prisma.users.findUnique({
                where: {
                    id: id
                }
            })
        } catch (error) {
            console.log(`user lookup failed when trying to restore from jwt using id ${id}: ${error}`)
        }

        // If the user isn't present, something is up with the payload, so clear it
        if (!req.user) {
            res.clearCookie('token');
        }

        return next();
    });
};

// If there is no current user, return an error
export const requireAuth = function (req: Request, res: Response, next: NextFunction) {
    // Ensure that a user is present otherwise block access
    if (req.user) {
        return next();
    }

    // Return error
    res.json(generateErrorResponse('Authentication Required', 401));
}
