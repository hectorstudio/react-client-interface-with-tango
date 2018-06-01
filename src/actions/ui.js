import { DISPLAY_ERROR, CLEAR_ERROR } from './actionTypes';

export function displayError(error) {
    return {type: DISPLAY_ERROR, error};
}

export function clearError() {
    return {type: CLEAR_ERROR};
}
