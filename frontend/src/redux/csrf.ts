import Cookies from 'js-cookie';
import { CSRFHttpOptions } from './types/redux';

export async function csrfFetch(
    url: string,
    options: CSRFHttpOptions = {
        method: 'GET',
    },
) {
    // set options.method to 'GET' if there is no method
    options.method = options.method ?? 'GET';

    // set options.headers to an empty object if there are no headers
    options.headers = options.headers || {};

    // if the options.method is not 'GET', then set the "Content-Type" header to
    // "application/json", and set the "XSRF-TOKEN" header to the value of the
    // "XSRF-TOKEN" cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        //token is either string/true or undefined/false
        //headers in redux.d.ts file is a string key pointing to a string value
        //but the get method on line 19 returns a string or undefined
        //is why we have to check token first
        const token = Cookies.get('XSRF-TOKEN');
        if (token) {
            options.headers['XSRF-Token'] = token;
        }
    }
    // call the default window's fetch with the url and the options passed in
    const res = await window.fetch(url, options);

    // if the response status code is 400 or above, then throw an error with the
    // error being the response
    if (res.status >= 400) throw res;

    // if the response status code is under 400, then return the response to the
    // next promise chain
    return res;
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
