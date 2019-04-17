import {
  FETCH_DEVICE_SUCCESS,
  DELETE_DEVICE_PROPERTY_SUCCESS,
  SET_DEVICE_PROPERTY_SUCCESS
} from "../actions/actionTypes";
import JiveAction from "../actions";

interface IDeviceProperty {
  name: string;
  value: string[];
}

export interface IPropertiesState {
  [deviceName: string]: {
    [propertyName: string]: IDeviceProperty;
  };
}

export default function properties(
  state: IPropertiesState = {},
  action: JiveAction
): IPropertiesState {
  switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
      const { name, properties: props } = action.device;
      const hash = (props || []).reduce(
        (accum, property) => ({
          ...accum,
          [property.name]: property
        }),
        {}
      );
      return { ...state, [name]: hash };
    }

    case SET_DEVICE_PROPERTY_SUCCESS: {
      const { device, name, value } = action;
      const forDevice = state[device];
      return { ...state, [device]: { ...forDevice, [name]: { name, value } } };
    }

    case DELETE_DEVICE_PROPERTY_SUCCESS: {
      const { device, name } = action;
      const forDevice = { ...state[device] };
      delete forDevice[name];
      return { ...state, [device]: forDevice };
    }

    default:
      return state;
  }
}
