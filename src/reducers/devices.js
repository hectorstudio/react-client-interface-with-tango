import {
  FETCH_DEVICE_NAMES, FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE, FETCH_DEVICE_SUCCESS, SET_DATA_FORMAT,
} from '../actions/actionTypes';

export default function devices(state = {
  nameList: [],
  current: null,
  activeDataFormat: null,

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
    case FETCH_DEVICE_SUCCESS: {
      const {device: {attributes}} = action;
      const hasAttrs = attributes && attributes.length > 0;

      return {
        ...state,
        current: action.device,
        loadingDevice: false,
        activeDataFormat: hasAttrs ? attributes[0].dataformat : null
      };
    }

    case SET_DATA_FORMAT:
      return {...state, activeDataFormat: action.format};

    default:
      return state;
  }
}
