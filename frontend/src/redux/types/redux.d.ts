

// ---- general types ----
export interface CSRFHttpOptions {
    method?: string;
    //changed from any bc it needs to be an object where the key is a string and the value is a string.
    //headers have to be a name and value
    //follow this doc in future: https://developer.mozilla.org/en-US/docs/Web/API/Headers
    headers?: {[key: string]: string};
    body?: string | FormData;
};

export interface IActionCreator {
    type: string;
    payload: IUser
}
