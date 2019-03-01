import { combineReducers } from "redux";

import deviceDetail, { IDeviceDetailState } from "./deviceDetail";
import deviceList, { IDeviceListState } from "./deviceList";
import loadingStatus, { ILoadingStatusState } from "./loadingStatus";
import commandOutput, { ICommandOutputState } from "./commandOutput";
import loggedActions, { ILoggedActionsState } from "./loggedActions";

import currentDevice from "./currentDevice";
import devices, { IDevicesState } from "./devices";
import database, { IDatabaseState } from "./database";
import attributes, { IAttributesState } from "./attributes";
import commands, { ICommandsState } from "./commands";
import properties, { IPropertiesState } from "./properties";

import user, { IUserState } from "../../../shared/user/state/reducer";

import error from "./error";

export interface IRootState {
  // View state
  deviceDetail: IDeviceDetailState;
  deviceList: IDeviceListState;

  // App State
  loadingStatus: ILoadingStatusState;
  error: string;
  user: IUserState;

  // Data state
  database: IDatabaseState;
  devices: IDevicesState;
  commandOutput: ICommandOutputState;
  currentDevice: string;
  attributes: IAttributesState;
  commands: ICommandsState;
  properties: IPropertiesState;
  loggedActions: ILoggedActionsState;
}

const rootReducer = combineReducers<IRootState>({
  deviceDetail,
  deviceList,
  database,
  devices,
  loadingStatus,
  commandOutput,
  currentDevice,
  attributes,
  commands,
  properties,
  error,
  user,
  loggedActions
});

export default rootReducer;
