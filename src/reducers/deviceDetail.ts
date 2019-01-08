import {
  ENABLE_DISPLEVEL,
  DISABLE_DISPLEVEL,
  SET_DATA_FORMAT,
  SELECT_DEVICE_SUCCESS
} from "../actions/actionTypes";

import { unique } from '../utils';

export interface IDeviceDetailState {
  activeDataFormat?: string,
  disabledDisplevels: string[],
}

export default function deviceViewer(state: IDeviceDetailState = {
  disabledDisplevels: []
}, action) {
  switch (action.type) {
    case ENABLE_DISPLEVEL: {
      const { displevel } = action;
      const disabledDisplevels = state.disabledDisplevels.filter(displevel2 => displevel2 !== displevel);
      return { ...state, disabledDisplevels };
    }

    case DISABLE_DISPLEVEL: {
      const { displevel } = action;
      const disabledDisplevels = [...state.disabledDisplevels, displevel];
      return { ...state, disabledDisplevels };
    }

    case SELECT_DEVICE_SUCCESS: {
      const device = action.device;
      const commands = device.commands || [];
      const attributes = device.attributes || [];

      const enabledDisplevels = unique(commands.map(cmd => cmd.displevel));
      const activeDataFormat = attributes.length ? attributes[0].dataformat : null;

      return {...state, enabledDisplevels, activeDataFormat};
    }

    case SET_DATA_FORMAT:
      return {...state, activeDataFormat: action.format};

    default:
      return state;
  }
}
