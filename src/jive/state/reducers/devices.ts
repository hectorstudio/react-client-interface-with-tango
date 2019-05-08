import {
  FETCH_DEVICE_SUCCESS,
  ATTRIBUTE_FRAME_RECEIVED,
  DEVICE_STATE_RECEIVED
} from "../actions/actionTypes";
import JiveAction from "../actions";

interface IDevice {
  name: string;
  state: string;
  server: {
    id: string;
    host: string;
  };
  errors: object[];
}

export interface IDevicesState {
  [name: string]: IDevice;
}

export default function devices(
  state: IDevicesState = {},
  action: JiveAction
): IDevicesState {
  switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
      const { attributes, properties, commands, name, ...core } = action.device;
      return { ...state, [name]: { ...core, name } };
    }

    case ATTRIBUTE_FRAME_RECEIVED: {
      const { device: deviceName, attribute, value } = action.frame;
      if (attribute === "State") {
        const device = { ...state[deviceName], state: value };
        return { ...state, [deviceName]: device };
      } else {
        return state;
      }
    }

    case DEVICE_STATE_RECEIVED: {
      const { device } = action;
      const oldDevice = state[device];
      return { ...state, [device]: { ...oldDevice, state: action.state } };
    }

    default:
      return state;
  }
}
