export const environment: string = process.env.NODE_ENV || 'development';

export const portnum: number = parseInt(process.env.PORT || "8000", 10);

export const db: DatabaseConfiguration = {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    schema: process.env.SCHEMA as string,
    host: process.env.DB_HOST as string
};

export const jwtConfig: JWTConfiguration = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string)
};

export interface DatabaseConfiguration {
    username: string;
    password: string;
    database: string;
    schema: string;
    host: string;
}

export interface JWTConfiguration {
    secret: string;
    expiresIn: number;
}