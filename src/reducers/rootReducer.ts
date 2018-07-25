import {combineReducers} from 'redux';

import devices, { IDevicesState } from './devices';
import deviceDetail, { IDeviceDetailState } from './deviceDetail';
import deviceList, { IDeviceListState } from './deviceList';
import loadingStatus, { ILoadingStatusState } from './loadingStatus';
import commandOutput, { ICommandOutputState } from './commandOutput';
import currentDeviceInfo, { ICurrentDeviceInfoState } from './currentDeviceInfo';
import currentDeviceProperties, { ICurrentDevicePropertiesState } from './currentDeviceProperties';

import ui from './ui';

export interface IRootState {
  devices: IDevicesState;
  deviceDetail: IDeviceDetailState;
  deviceList: IDeviceListState;
  loadingStatus: ILoadingStatusState;
  commandOutput: ICommandOutputState;
  
  currentDeviceInfo: ICurrentDeviceInfoState;
  currentDeviceProperties: ICurrentDevicePropertiesState;
}

const rootReducer = combineReducers<IRootState>({
  devices,
  deviceDetail,
  deviceList,
  loadingStatus,
  commandOutput,
  currentDeviceInfo,
  currentDeviceProperties,
  ui,
});

export default rootReducer;
