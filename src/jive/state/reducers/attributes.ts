import {
  FETCH_DEVICE_SUCCESS,
  ATTRIBUTE_FRAME_RECEIVED,
  SET_DEVICE_ATTRIBUTE_SUCCESS
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

function updateAttribute(
  state: IAttributesState,
  device: string,
  name: string,
  quality: string,
  value: any,
  writeValue: any
) {
  const oldDevice = state[device];
  const oldAttribute = oldDevice[name];
  return {
    ...state,
    [device]: {
      ...oldDevice,
      [name]: { ...oldAttribute, value, writeValue, quality }
    }
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

    case SET_DEVICE_ATTRIBUTE_SUCCESS: {
      const { device, name, quality, value, writevalue } = action.attribute;
      return updateAttribute(state, device, name, quality, value, writevalue);
    }

    case ATTRIBUTE_FRAME_RECEIVED: {
      const { value, writeValue, quality, device, attribute } = action.frame;
      return updateAttribute(
        state,
        device,
        attribute,
        quality,
        value,
        writeValue
      );
    }

    default:
      return state;
  }
}
