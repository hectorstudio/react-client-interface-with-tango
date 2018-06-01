import { DISPLAY_ERROR, CLEAR_ERROR } from '../actions/actionTypes';

export default function ui(state = {
    error: ''
}, action) {
  switch (action.type) {
    case DISPLAY_ERROR:
      return {...state, error: action.error};
    case CLEAR_ERROR:
      return {...state, error: null};
    default:
      return state;
  }
}
