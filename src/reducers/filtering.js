import { SET_SEARCH_FILTER } from '../actions/actionTypes';

export default function filtering(state = {
  filter: ''
}, action) {
  switch (action.type) {
    case SET_SEARCH_FILTER:
      return {...state, filter: action.filter};
    default:
      return state;
  }
}
