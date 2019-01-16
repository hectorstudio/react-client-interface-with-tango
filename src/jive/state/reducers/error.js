import { DISPLAY_ERROR, CLEAR_ERROR } from '../actions/actionTypes';

export default function error(state = '', action) {
  switch (action.type) {
    case DISPLAY_ERROR:
      return action.error;
    case CLEAR_ERROR:
      return null;
    default:
      return state;
  }
}
