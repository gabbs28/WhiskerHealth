// Global path for JSON.stringify
import './utils/json';

import 'express-async-errors';
import express, { Request, Response } from 'express';

import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes';

import { isProduction } from './config';
import { generateErrorResponse } from './utils/errors';

// Frontend location
//https://nodejs.org/docs/latest/api/modules.html#__dirname
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

// apply middleware to allow for usage of static react-vite from build
app.use(express.static(path.join(...frontend)));

//api routes
app.use(routes);

app.get(/^(?!\/?api).*/, (request: Request, response: Response) => {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    response.sendFile(path.join(...frontend, 'index.html'));
});

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
