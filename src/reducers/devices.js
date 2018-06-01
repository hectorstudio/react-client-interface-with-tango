import {
  FETCH_DEVICE_NAMES, FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE, FETCH_DEVICE_SUCCESS,
} from '../actions/actionTypes';

export default function devices(state = {
  nameList: [],
  current: null,

  loadingNames: false,
  loadingDevice: false,
}, action) {
  switch (action.type) {
    
    case FETCH_DEVICE_NAMES:
      return {...state, loadingNames: true};
    case FETCH_DEVICE_NAMES_SUCCESS:
      return {...state, nameList: action.names};

    case FETCH_DEVICE:
      return {...state, loadingDevice: true};
    case FETCH_DEVICE_SUCCESS:
      return {...state, current: action.device, loadingDevice: false};

    default:
      return state;
  }
}
