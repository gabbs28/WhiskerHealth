import { ErrorResponse } from '../typings/errors';

export const generateErrorResponse = (
    title: string,
    status: number,
    errors: Record<string, string> = {},
): ErrorResponse => {
    return {
        error: true,
        title,
        status,
        errors,
    };
};
