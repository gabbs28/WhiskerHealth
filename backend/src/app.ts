// Global path for JSON.stringify
import './utils/json'

import 'express-async-errors'
import express, {Request, Response} from 'express';

import path from 'path'
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes'

import {isProduction} from './config';
import {generateErrorResponse} from "./utils/errors";

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
        policy: "cross-origin"
    })
);

//apply middleware to allow for usage of static react-vite from build
app.use(express.static(path.join(__dirname, "react-vite")));
app.use(express.static(path.join(__dirname, 'react-vite/assets/favicon.ico')));

//api routes
app.use(routes);

//send the React build as a static file
app.get('/', (_request: Request, response: Response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

//send the React build as a static file
app.get('/favicon.ico', (_request, response, _next) => {
    response.sendFile(path.join(__dirname, '/favicon.ico'));
});

app.get(/^(?!\/?api).*/, (request: Request, response: Response) => {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    response.sendFile(
        path.join(__dirname, 'react-app', 'index.html')
    );
});

// 404 error handler middleware
app.use((_request: Request, response: Response) => {
    response.json(generateErrorResponse("Not Found", 404));
});

// Global error handler
app.use((error: Error, _request: Request, response: Response) => {
    // Log
    console.error(error.stack);

    // Return
    response.json(generateErrorResponse("Internal Server Error", 500));
});