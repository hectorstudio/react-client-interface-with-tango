import {
  FETCH_DEVICE_NAMES, FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE, FETCH_DEVICE_SUCCESS, CHANGE, EXECUTE_COMMAND_COMPLETE, EXECUTE_COMMAND
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
  displevel: string,
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
  loadingNames: boolean,
  loadingDevice: boolean,
  loadingOutput: {
    [device: string]: {
      [attribute: string]: boolean
    }
  },
  commandResults: {
    [device: string]: {
      [attribute: string]: any
    }
  }, // any, // TODO
}

export default function devices(state: IDevicesState = {
  nameList: [],
  loadingNames: false,
  loadingDevice: false,
  loadingOutput: {},
  commandResults: {},
}, action) {
  switch (action.type) {
    
    case FETCH_DEVICE_NAMES:
      return {...state, loadingNames: true};
    case FETCH_DEVICE_NAMES_SUCCESS:
      return {...state, nameList: action.names};

    case EXECUTE_COMMAND: {
    const oldLoadingOutput = state.loadingOutput
    const {command, device} = action;
    // const deviceName = state.current!.name
    const deviceResults = {...oldLoadingOutput[device], [command]: true};
    const loadingOutput = {...oldLoadingOutput, [device]: deviceResults};
    return {...state, loadingOutput}
    }

    case EXECUTE_COMMAND_COMPLETE: {
      const oldCommandResults = state.commandResults;
      const {command, result, device} = action;
      // const deviceName = state.current!.name
      const deviceResults = {...oldCommandResults[device], [command]: result};
      const commandResults = {...oldCommandResults, [device]: deviceResults};
      const oldLoadingOutput = state.loadingOutput
      const deviceLoading = {...oldLoadingOutput[device], [command]: false};
      const loadingOutput = {...oldLoadingOutput, [device]: deviceLoading};
      return {...state, loadingOutput, commandResults}
    }

    case FETCH_DEVICE:
      return {...state, loadingDevice: true};
    
    case FETCH_DEVICE_SUCCESS: {
      return {
        ...state,
        current: action.device,
        loadingDevice: false,
      };
    }

    case CHANGE: {
      const {current} = state;
      if (current) {
        const currentAttributes = current.attributes;
        if (currentAttributes) {
          const attributes = currentAttributes.map(attr => {
            if(action.data && (action.data.device === current.name) && (action.data.name === attr.name)){
              const value = action.data.data.value;
              return {...attr, value};
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
