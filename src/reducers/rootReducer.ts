import {combineReducers} from 'redux';

import devices, { IDevicesState } from './devices';
import deviceView, { IDeviceViewState } from './deviceView';
import deviceList, { IDeviceListState } from './deviceList';
import ui from './ui';

export interface IRootState {
  devices: IDevicesState,
  deviceView: IDeviceViewState,
  deviceList: IDeviceListState,
}

const rootReducer = combineReducers<IRootState>({
  devices,
  deviceView,
  deviceList,
  ui,
});

export default rootReducer;
