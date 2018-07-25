import {
  FETCH_DEVICE_SUCCESS, CHANGE
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
  current?: IDevice,
}

export default function devices(state: IDevicesState = {}, action) {
  switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
      return {...state, current: action.device};
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
