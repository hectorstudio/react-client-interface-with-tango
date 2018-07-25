export function objectValues(obj) {
    return obj ? Object.keys(obj).map(key => obj[key]) : [];
}

export function uniqueStrings(arr) {
    return Object.keys(arr.reduce((accum, str) => (
        {...accum, [str]: true}
    ), {}));
}
