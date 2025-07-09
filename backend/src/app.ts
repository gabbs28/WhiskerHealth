// https://www.npmjs.com/package/json-with-bigint
// Handle BigInt correctly and uniformly between seeding, backend, and frontend
// Should be loaded in the entrypoint file to ensure proper usage
// JSONParse('{"someBigNumber":9007199254740992}')
// JSONStringify({ someBigNumber: 9007199254740992n })
import { JSONParse, JSONStringify } from 'json-with-bigint';
import 'express-async-errors';
import express, { type Request, type Response } from 'express';
import { dirname } from 'dirname-filename-esm';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

import { isProduction } from './config/index.js';
import { generateErrorResponse } from './utils/errors.js';
import csurf from 'csurf';

JSON.stringify = JSONStringify;
JSON.parse = JSONParse;

// Frontend location
// https://nodejs.org/docs/latest/api/modules.html#__dirname
//const frontend = [__dirname, '..', '..', 'frontend', 'dist'];
// https://www.npmjs.com/package/dirname-filename-esm
const __dirname = dirname(import.meta);
const frontend = [__dirname, '..', '..', 'frontend', 'dist'];

export const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin',
    }),
);

// Enable cross-site forgery protection
app.use(
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

// Serve React application
app.get('/', (request: Request, response: Response) => {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    response.sendFile(path.join(...frontend, 'index.html'));
});
app.use(express.static(path.join(...frontend)));

//api routes
app.use(routes);

// 404 error handler middleware
app.use((_request: Request, response: Response) => {
    response.json(generateErrorResponse('Not Found', 404));
});

// Global error handler
app.use((error: Error, _request: Request, response: Response) => {
    // Log
    console.error(error.stack);

    // Return
    response.json(generateErrorResponse('Internal Server Error', 500));
});