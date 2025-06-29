//go back and add one day ! (will eliminate this file) https://www.npmjs.com/package/json-bigint-patch
// Capture the original function (stringify turns object into a string)
const original = JSON.stringify;

// Handle custom types
// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-521460510
const custom = (key: string, value: any) => {
    //if not on this list -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof,
    //than it will returns "object" (last row in list)
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};

// replacing the offical javascript function with my custom function
// value: thing that I want to turn into a string
// https://stackoverflow.com/questions/65876907/how-to-add-a-global-replacer-for-json-stringify-and-global-reviver-for-json-pars
JSON.stringify = function stringify(value: any ): string {
    return original(value, custom)
} as typeof JSON.stringify;

// Export
export default original;