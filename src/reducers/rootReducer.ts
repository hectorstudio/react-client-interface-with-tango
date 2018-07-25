import {combineReducers} from 'redux';

import devices, { IDevicesState } from './devices';
import deviceDetail, { IDeviceDetailState } from './deviceDetail';
import deviceList, { IDeviceListState } from './deviceList';
import loadingStatus, { ILoadingStatusState } from './loadingStatus';
import commandOutput, { ICommandOutputState } from './commandOutput';
import currentDeviceInfo, { ICurrentDeviceInfoState } from './currentDeviceInfo';
import currentDeviceProperties, { ICurrentDevicePropertiesState } from './currentDeviceProperties';
import currentDeviceAttributes, { ICurrentDeviceAttributesState } from './currentDeviceAttributes';

import currentDevice from './currentDevice';
import devices2, { IDevices2State } from './devices2';
import attributes, { IAttributesState } from './attributes';
import commands, { ICommandsState } from './commands';
import properties, { IPropertiesState } from './properties';

import ui from './ui';

export interface IRootState {
  devices: IDevicesState;
  deviceDetail: IDeviceDetailState;
  deviceList: IDeviceListState;
  loadingStatus: ILoadingStatusState;
  commandOutput: ICommandOutputState;
  
  currentDeviceInfo: ICurrentDeviceInfoState;
  currentDeviceProperties: ICurrentDevicePropertiesState;
  currentDeviceAttributes: ICurrentDeviceAttributesState,

  currentDevice: string;
  devices2: IDevices2State,
  attributes: IAttributesState;
  commands: ICommandsState;
  properties: IPropertiesState;
}

const rootReducer = combineReducers<IRootState>({
  devices,
  deviceDetail,
  deviceList,
  loadingStatus,
  commandOutput,
  currentDeviceInfo,
  currentDeviceProperties,
  currentDeviceAttributes,
  ui,

  currentDevice,
  devices2,
  attributes,
  commands,
  properties,
});

export default rootReducer;
