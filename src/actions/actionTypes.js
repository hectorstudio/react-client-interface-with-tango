/*

Naming convention:

- FETCH_XXX           Remote asynchronous calls
- FETCH_XXX_SUCCESS   Data returned from remote calls (typically created in .then(json => ...))
- FETCH_XXX_FAILED    Failure to retrieve remote data (typically created in .catch(err => ...))
- SET_XXX             Set local state synchronously

*/

export const FETCH_DEVICE_NAMES = 'FETCH_DEVICE_NAMES';
export const FETCH_DEVICE_NAMES_SUCCESS = 'FETCH_DEVICE_NAMES_SUCCESS';

export const FETCH_DEVICE = 'FETCH_DEVICE';
export const FETCH_DEVICE_SUCCESS = 'FETCH_DEVICE_SUCCESS';

export const SET_CURRENT_DEVICE = 'SET_CURRENT_DEVICE';
export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER';

export const DISPLAY_ERROR = 'DISPLAY_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
