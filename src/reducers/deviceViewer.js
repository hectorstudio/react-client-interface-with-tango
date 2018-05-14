import initialState from './initialState';
import {SET_HIGHLIGHTED_DEVICE} from '../actions/actionTypes';

export default function deviceViewer(state = initialState.deviceViewer, action) {
  switch (action.type) {
    case SET_HIGHLIGHTED_DEVICE:
      return {...state, ...action.info};
    default:
      return state;
  }
}