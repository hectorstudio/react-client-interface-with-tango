import {combineReducers} from 'redux';

import deviceDetail, { IDeviceDetailState } from './deviceDetail';
import deviceList, { IDeviceListState } from './deviceList';
import loadingStatus, { ILoadingStatusState } from './loadingStatus';
import commandOutput, { ICommandOutputState } from './commandOutput';

import currentDevice from './currentDevice';
import devices, { IDevicesState } from './devices';
import attributes, { IAttributesState } from './attributes';
import commands, { ICommandsState } from './commands';
import properties, { IPropertiesState } from './properties';

import ui from './ui';

export interface IRootState {
  // View state
  deviceDetail: IDeviceDetailState;
  deviceList: IDeviceListState;
  
  // App State
  loadingStatus: ILoadingStatusState;
  ui: any;

  // Data state
  devices: IDevicesState,
  commandOutput: ICommandOutputState;
  currentDevice: string;
  attributes: IAttributesState;
  commands: ICommandsState;
  properties: IPropertiesState;
}

const rootReducer = combineReducers<IRootState>({
  deviceDetail,
  deviceList,
  devices,
  loadingStatus,
  commandOutput,
  currentDevice,
  attributes,
  commands,
  properties,
  ui,
});

export default rootReducer;
