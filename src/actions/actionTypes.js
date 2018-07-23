/*

Naming convention:

- FETCH_XXX           Remote asynchronous calls
- FETCH_XXX_SUCCESS   Data returned from remote calls (typically created in .then(json => ...))
- FETCH_XXX_FAILED    Failure to retrieve remote data (typically created in .catch(err => ...))
- SET_XXX             Set local state synchronously

Avoid GET_XXX in order not to confuse selectors and action creators.

*/

export const FETCH_DEVICE_NAMES = 'FETCH_DEVICE_NAMES';
export const FETCH_DEVICE_NAMES_SUCCESS = 'FETCH_DEVICE_NAMES_SUCCESS';

export const FETCH_DEVICE = 'FETCH_DEVICE';
export const FETCH_DEVICE_SUCCESS = 'FETCH_DEVICE_SUCCESS';

export const SET_CURRENT_DEVICE = 'SET_CURRENT_DEVICE';
export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER';
export const SET_DATA_FORMAT = 'SET_DATA_FORMAT';
export const SET_TAB = 'SET_TAB';

export const DISPLAY_ERROR = 'DISPLAY_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const CHANGE = "CHANGE";
export const EXECUTE_COMMAND_COMPLETE = "EXECUTE_COMMAND_COMPLETE";
export const EXECUTE_COMMAND = "EXECUTE_COMMAND";
export const ENABLE_DISPLEVEL = "ENABLE_DISPLEVEL";
export const DISABLE_DISPLEVEL = "DISABLE_DISPLEVEL";
export const ENABLE_ALL_DISPLEVEL = "ENABLE_ALL_DISPLEVEL";
export const SET_DEVICE_PROPERTY = "SET_DEVICE_PROPERTY";
