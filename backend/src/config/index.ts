export const environment: string = process.env.NODE_ENV ?? 'development';

export const isProduction: boolean = environment === 'production';

export const port: number = parseInt(process.env.PORT ?? "8000", 10);

export const jwtConfig: JWTConfiguration = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string)
};

export interface JWTConfiguration {
    secret: string;
    expiresIn: number;
}