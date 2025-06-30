export class ThunkError extends Error {
    public readonly errors: Record<string, any>;

    constructor(message: string, errors: Record<string, any> = {}) {
        super(message);

        // Use class name as the name of the error
        this.name = this.constructor.name;

        // Store thunk errors
        this.errors = errors;

        // This is necessary for a proper prototype chain in TypeScript
        Object.setPrototypeOf(this, ThunkError.prototype);
    }
}