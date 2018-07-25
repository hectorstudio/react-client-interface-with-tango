import {combineReducers} from 'redux';

import devices, { IDevicesState } from './devices';
import deviceDetail, { IDeviceDetailState } from './deviceDetail';
import deviceList, { IDeviceListState } from './deviceList';
import loadingStatus, { ILoadingStatusState } from './loadingStatus';
import commandOutput, { ICommandOutputState } from './commandOutput';

import currentDevice from './currentDevice';
import devices2, { IDevices2State } from './devices2';
import attributes, { IAttributesState } from './attributes';
import commands, { ICommandsState } from './commands';
import properties, { IPropertiesState } from './properties';

import ui from './ui';

export interface IRootState {
  // View state
  deviceDetail: IDeviceDetailState;
  deviceList: IDeviceListState;
  
  // Data state
  devices: IDevicesState;
  loadingStatus: ILoadingStatusState;
  commandOutput: ICommandOutputState;
  currentDevice: string;
  devices2: IDevices2State,
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
  devices2,
  attributes,
  commands,
  properties,
  ui,
});

export default rootReducer;
