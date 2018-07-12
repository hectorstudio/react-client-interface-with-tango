import {
  FETCH_DEVICE_NAMES, FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE, FETCH_DEVICE_SUCCESS, SET_DATA_FORMAT, CHANGE, SET_TAB, EXECUTE_COMMAND_COMPLETE
} from '../actions/actionTypes';

interface IDeviceAttribute {
  name: string,
  value: any,
  dataformat: string,
}

interface IDeviceProperty {
  name: string,
  value: string[],
}

interface IDeviceCommand {
  name: string,
}

interface IDevice {
  name: string,
  attributes: IDeviceAttribute[],
  properties: IDeviceProperty[],
  commands: IDeviceCommand[],
  state: string
}

export interface IDevicesState {
  nameList: string[],
  current?: IDevice,
  activeDataFormat?: string,
  activeTab: string,
  loadingNames: boolean,
  loadingDevice: boolean,
  commandResults: any, // TODO
}

export default function devices(state: IDevicesState = {
  nameList: [],
  activeTab: "attributes",
  loadingNames: false,
  loadingDevice: false,
  commandResults: {},
}, action) {
  switch (action.type) {
    
    case FETCH_DEVICE_NAMES:
      return {...state, loadingNames: true};
    case FETCH_DEVICE_NAMES_SUCCESS:
      return {...state, nameList: action.names};

    case EXECUTE_COMMAND_COMPLETE:
      const oldCommandResults = state.commandResults;
      const {command, result} = action;
      const deviceName = state.current!.name
      const commandResults = {...oldCommandResults, deviceName, [command]: result};
      return {...state, commandResults}

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

    case SET_TAB:
      return {...state, activeTab: action.tab};

    case CHANGE: {
      const {current} = state;
      if (current) {
        const currentAttributes = current.attributes;
        if (currentAttributes) {
          const attributes = currentAttributes.map(attr => {
            if(action.data && action.data[current.name + "/" + attr.name] ){
              attr.value = action.data[current.name + "/" + attr.name].value.toString();
            }
            return attr;
          });

          return {...state, current: {...state.current, attributes}};
        }
      }
      return state;
    }
    default:
      return state;
  }
}
