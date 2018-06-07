import {
  FETCH_DEVICE_NAMES, FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE, FETCH_DEVICE_SUCCESS, SET_DATA_FORMAT, CHANGE
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

    case CHANGE:
      if(state.current){
      return {...state, current: {...state.current, attributes: state.current.attributes.map(attr =>{
        if(action.data && action.data[state.current.name + "/" + attr.name] ){
          attr.value = action.data[state.current.name + "/" + attr.name].value.toString();
        }
        return attr;
      })}};
    }
    return state

    default:
      return state;
  }
}
