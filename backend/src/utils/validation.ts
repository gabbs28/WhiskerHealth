import {NextFunction, Request, Response} from "express";
import {validationResult} from 'express-validator';
import {generateErrorResponse} from "./errors";

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
export const handleValidationErrors = (req: Request<any>, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors: any = {};

        validationErrors
            .array()
            .forEach((error: any) => errors[error.path] = error.msg);

        return res.json(generateErrorResponse('Bad Request', 400, errors));
    }

    next();
};
