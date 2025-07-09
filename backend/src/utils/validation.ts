import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateErrorResponse } from './errors.js';

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
export const handleValidationErrors = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    // Validate the incoming request
    const validationErrors = validationResult(request);

    // If there are validation issues collect the errors and return error response
    if (!validationErrors.isEmpty()) {
        // Create mapping between the field and its validation errors
        const errors = validationErrors.array().reduce((acc: any, error: any) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});

        // Return error response
        response.json(generateErrorResponse('Bad Request', 400, errors));

        // Early out
        return;
    }

    next();
};
