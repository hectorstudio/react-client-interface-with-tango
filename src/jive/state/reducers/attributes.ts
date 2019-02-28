import {
  FETCH_DEVICE_SUCCESS,
  ATTRIBUTE_FRAME_RECEIVED
} from "../actions/actionTypes";

interface IDeviceAttribute {
  name: string;
  value: any;
  displevel: string;
  dataformat: string;
}

export interface IAttributesState {
  [deviceName: string]: {
    [attributeName: string]: IDeviceAttribute;
  };
}

export default function attributes(state: IAttributesState = {}, action) {
  switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
      const { name, attributes: attrs } = action.device;
      const hash = (attrs || []).reduce(
        (accum, attribute) => ({
          ...accum,
          [attribute.name]: attribute
        }),
        {}
      );
      return { ...state, [name]: hash };
    }

    case ATTRIBUTE_FRAME_RECEIVED: {
      const { value, writeValue, quality, device, attribute } = action.frame;
      const oldDevice = state[device];
      const oldAttribute = oldDevice[attribute];
      return {
        ...state,
        [device]: {
          ...oldDevice,
          [attribute]: { ...oldAttribute, value, writeValue, quality }
        }
      };
    }

    default:
      return state;
  }
}
