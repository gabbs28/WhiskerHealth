export class NoResourceError extends Error {
    status?: number;
    title?: string;
    errors?: [{ message?: string; path?: string }];
    path?: string;

    constructor(
        message: string | undefined,
        status?: number,
        title?: string,
        errors?: [
            {
                message?: string;
                path?: string;
            },
        ],
    ) {
        super(message);
        this.status = status;
        this.title = title;
        this.errors = errors;
    }
}
