import initialState from './initialState';
import {SET_DEVICES, SET_HIGHLIGHTED_DEVICE, SET_SEARCH_FILTER} from '../actions/actionTypes';

export default function deviceList(state = initialState.deviceList, action) {
  switch (action.type) {
    case SET_DEVICES:
      return {...state, devices: action.list};
    case SET_HIGHLIGHTED_DEVICE:
      return {...state, highlightedDevice: action.name};
    case SET_SEARCH_FILTER:
      return {...state, filter: action.filter};
    default:
      return state;
  }
}

