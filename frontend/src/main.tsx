// https://www.npmjs.com/package/json-with-bigint
// Handle BigInt correctly and uniformly between seeding, backend, and frontend
// Should be loaded in the entrypoint file to ensure proper usage
// JSONParse('{"someBigNumber":9007199254740992}')
// JSONStringify({ someBigNumber: 9007199254740992n })
import { JSONParse, JSONStringify } from 'json-with-bigint';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import * as sessionActions from './redux/session';
import './index.css';
import store from './redux/store';
import { csrfFetch, restoreCSRF } from './redux/csrf';

JSON.stringify = JSONStringify;
JSON.parse = JSONParse;

declare global {
    interface Window {
        csrfFetch: any;
        store: any;
        sessionActions: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

if (import.meta.env.VITE_NODE_ENV !== 'production') {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <RouterProvider router={router} />
        </ReduxProvider>
    </React.StrictMode>,
);
