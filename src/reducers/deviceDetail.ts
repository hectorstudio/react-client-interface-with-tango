import {
  ENABLE_DISPLEVEL,
  DISABLE_DISPLEVEL,
  FETCH_DEVICE_SUCCESS,
  SET_DATA_FORMAT,
  SET_TAB
} from "../actions/actionTypes";

import { unique } from './utils';

export interface IDeviceViewState {
  activeDataFormat?: string,
  activeTab: string,
  loadingOutput: {
    [device: string]: {
      [attribute: string]: boolean
    }
  },
  commandResults: {
    [device: string]: {
      [attribute: string]: any // TODO
    }
  },
  enabledDisplevels: string[],
}

export default function deviceViewer(state: IDeviceViewState = {
  activeTab: 'properties',
  loadingOutput: {},
  commandResults: {},
  enabledDisplevels: []
}, action) {
  switch (action.type) {
    case ENABLE_DISPLEVEL: {
      const {displevel} = action;
      const enabledDisplevels = [...state.enabledDisplevels, displevel];
      return {...state, enabledDisplevels};
    }

    case DISABLE_DISPLEVEL: {
      const {displevel} = action;
      const enabledDisplevels = state.enabledDisplevels.filter(level => level !== displevel);
      return {...state, enabledDisplevels};
    }

    case FETCH_DEVICE_SUCCESS: {
      const device = action.device;
      const commands = device.commands || [];
      const attributes = device.attributes || [];

      const enabledDisplevels = unique(commands.map(cmd => cmd.displevel));
      const activeDataFormat = attributes.length ? attributes[0].dataformat : null;

      return {...state, enabledDisplevels, activeDataFormat};
    }

    case SET_DATA_FORMAT:
      return {...state, activeDataFormat: action.format};

    case SET_TAB:
      return {...state, activeTab: action.tab};

    default:
      return state;
  }
}
