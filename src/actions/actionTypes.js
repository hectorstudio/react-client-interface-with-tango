/*

Naming convention:

- FETCH_XXX           Remote asynchronous calls
- FETCH_XXX_SUCCESS   Data returned from remote calls (typically created in .then(json => ...))
- FETCH_XXX_FAILED    Failure to retrieve remote data (typically created in .catch(err => ...))
- SET_XXX             Set local state synchronously

Avoid GET_XXX in order not to confuse selectors and action creators.

*/

export const FETCH_DEVICE_NAMES = "FETCH_DEVICE_NAMES";
export const FETCH_DEVICE_NAMES_SUCCESS = "FETCH_DEVICE_NAMES_SUCCESS";
export const FETCH_DEVICE_NAMES_FAILED = "FETCH_DEVICE_NAMES_FAILED";

export const FETCH_DEVICE = "FETCH_DEVICE";
export const FETCH_DEVICE_SUCCESS = "FETCH_DEVICE_SUCCESS";
export const FETCH_DEVICE_FAILED = "FETCH_DEVICE_FAILED";

export const SET_CURRENT_DEVICE = "SET_CURRENT_DEVICE";
export const SET_SEARCH_FILTER = "SET_SEARCH_FILTER";
export const SET_DATA_FORMAT = "SET_DATA_FORMAT";

export const DISPLAY_ERROR = "DISPLAY_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const ATTRIBUTE_CHANGE = "ATTRIBUTE_CHANGE";

export const EXECUTE_COMMAND = "EXECUTE_COMMAND";
export const EXECUTE_COMMAND_SUCCESS = "EXECUTE_COMMAND_SUCCESS";
export const EXECUTE_COMMAND_FAILED = "EXECUTE_COMMAND_FAILED";

export const ENABLE_DISPLEVEL = "ENABLE_DISPLEVEL";
export const DISABLE_DISPLEVEL = "DISABLE_DISPLEVEL";
export const ENABLE_ALL_DISPLEVEL = "ENABLE_ALL_DISPLEVEL";

export const SET_DEVICE_PROPERTY = "SET_DEVICE_PROPERTY";
export const SET_DEVICE_PROPERTY_SUCCESS = "SET_DEVICE_PROPERTY_SUCCESS";
export const SET_DEVICE_PROPERTY_FAILED = "SET_DEVICE_PROPERTY_FAILED";

export const SET_DEVICE_ATTRIBUTE = "SET_DEVICE_ATTRIBUTE";
export const SET_DEVICE_ATTRIBUTE_SUCCESS = "SET_DEVICE_ATTRIBUTE_SUCCESS";
export const SET_DEVICE_ATTRIBUTE_FAILED = "SET_DEVICE_ATTRIBUTE_FAILED";

export const DELETE_DEVICE_PROPERTY = "DELETE_DEVICE_PROPERTY";
export const DELETE_DEVICE_PROPERTY_SUCCESS = "DELETE_DEVICE_PROPERTY_SUCCESS";
export const DELETE_DEVICE_PROPERTY_FAILED = "DELETE_DEVICE_PROPERTY_FAILED";

export const TOGGLE_EXPAND_DOMAIN = "TOGGLE_EXPAND_DOMAIN";
export const TOGGLE_EXPAND_FAMILY = "TOGGLE_EXPAND_FAMILY";

export const OPEN_LOGIN_DIALOG = "OPEN_LOGIN_DIALOG";
export const CLOSE_LOGIN_DIALOG = "CLOSE_LOGIN_DIALOG";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const PRELOAD_USER = "PRELOAD_USER";
export const PRELOAD_USER_SUCCESS = "PRELOAD_USER_SUCCESS";
export const PRELOAD_USER_FAILED = "PRELOAD_USER_FAILED";

export const EXTEND_LOGIN = "EXTEND_LOGIN";
export const EXTEND_LOGIN_SUCCESS = "EXTEND_LOGIN_SUCCESS";
export const EXTEND_LOGIN_FAILED = "EXTEND_LOGIN_FAILED";
