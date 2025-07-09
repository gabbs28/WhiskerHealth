export interface CSRFHttpOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    //changed from any bc it needs to be an object where the key is a string and the value is a string.
    //headers have to be a name and value
    //follow this doc in the future: https://developer.mozilla.org/en-US/docs/Web/API/Headers
    headers?: { [key: string]: string };
    body?: string | FormData;
}
