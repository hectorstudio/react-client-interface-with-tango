import {combineReducers} from 'redux';

import devices, { IDevicesState } from './devices';
import deviceView, { IDeviceViewState } from './deviceDetail';
import deviceList, { IDeviceListState } from './deviceList';
import loadingStatus, { ILoadingStatusState } from './loadingStatus';
import ui from './ui';

export interface IRootState {
  devices: IDevicesState,
  deviceView: IDeviceViewState,
  deviceList: IDeviceListState,
  loadingStatus: ILoadingStatusState,
}

const rootReducer = combineReducers<IRootState>({
  devices,
  deviceView,
  deviceList,
  loadingStatus,
  ui,
});

export default rootReducer;
