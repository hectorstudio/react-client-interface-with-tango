import {
  FETCH_DEVICE_SUCCESS,
  ATTRIBUTE_FRAME_RECEIVED,
  SET_DEVICE_ATTRIBUTE_SUCCESS,
  DEVICE_STATE_RECEIVED
} from "../actions/actionTypes";
import JiveAction from "../actions";

interface IDeviceAttribute {
  name: string;
  value: any;
  writeValue: any;
  displevel: string;
  dataformat: string;
  quality: string;
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
  fields: Partial<IDeviceAttribute>
): IAttributesState {
  const oldDevice = state[device];
  const oldAttribute = oldDevice[name];
  return {
    ...state,
    [device]: {
      ...oldDevice,
      [name]: { ...oldAttribute, ...fields }
    }
  };
}

export default function attributes(
  state: IAttributesState = {},
  action: JiveAction
): IAttributesState {
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
      return updateAttribute(state, device, name, {
        quality,
        value,
        writeValue: writevalue
      });
    }

    case ATTRIBUTE_FRAME_RECEIVED: {
      const { value, writeValue, quality, device, attribute } = action.frame;
      return updateAttribute(state, device, attribute, {
        quality,
        value,
        writeValue
      });
    }

    // This case relies on the fact that State is a special attribute
    case DEVICE_STATE_RECEIVED: {
      return updateAttribute(state, action.device, "State", {
        value: action.state
      });
    }

    default:
      return state;
  }
}
