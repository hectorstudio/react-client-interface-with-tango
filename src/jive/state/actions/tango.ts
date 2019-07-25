import { Action } from "redux";
import {
  FETCH_DATABASE_INFO,
  FETCH_DATABASE_INFO_SUCCESS,
  FETCH_DATABASE_INFO_FAILED,
  FETCH_DEVICE,
  FETCH_DEVICE_SUCCESS,
  FETCH_DEVICE_FAILED,
  FETCH_DEVICE_NAMES,
  FETCH_DEVICE_NAMES_SUCCESS,
  EXECUTE_COMMAND,
  EXECUTE_COMMAND_SUCCESS,
  EXECUTE_COMMAND_FAILED,
  DISABLE_DISPLEVEL,
  ENABLE_DISPLEVEL,
  SET_DEVICE_PROPERTY,
  SET_DEVICE_PROPERTY_SUCCESS,
  SET_DEVICE_PROPERTY_FAILED,
  SET_DEVICE_ATTRIBUTE,
  SET_DEVICE_ATTRIBUTE_SUCCESS,
  SET_DEVICE_ATTRIBUTE_FAILED,
  DELETE_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY_SUCCESS,
  DELETE_DEVICE_PROPERTY_FAILED,
  FETCH_DEVICE_NAMES_FAILED,
  ATTRIBUTE_FRAME_RECEIVED,
  FETCH_LOGGED_ACTIONS,
  FETCH_LOGGED_ACTIONS_SUCCESS,
  FETCH_LOGGED_ACTIONS_FAILED,
  SET_DATA_FORMAT,
  DEVICE_STATE_RECEIVED
} from "./actionTypes";

interface FetchDatabaseInfoAction extends Action {
  type: typeof FETCH_DATABASE_INFO;
  tangoDB: string;
}

export function fetchDatabaseInfo(tangoDB: string): FetchDatabaseInfoAction {
  return { type: FETCH_DATABASE_INFO, tangoDB };
}

interface FetchDatabaseInfoSuccessAction extends Action {
  type: typeof FETCH_DATABASE_INFO_SUCCESS;
  tangoDB: string;
  info: string;
}

export function fetchDatabaseInfoSuccess(
  tangoDB: string,
  info
): FetchDatabaseInfoSuccessAction {
  return { type: FETCH_DATABASE_INFO_SUCCESS, tangoDB, info };
}

interface FetchDatabaseInfoFailedAction extends Action {
  type: typeof FETCH_DATABASE_INFO_FAILED;
  tangoDB: string;
}

export function fetchDatabaseInfoFailed(
  tangoDB: string
): FetchDatabaseInfoFailedAction {
  return { type: FETCH_DATABASE_INFO_FAILED, tangoDB };
}

interface FetchDeviceNamesAction extends Action {
  type: typeof FETCH_DEVICE_NAMES;
  tangoDB: string;
}

export function fetchDeviceNames(tangoDB): FetchDeviceNamesAction {
  return { type: FETCH_DEVICE_NAMES, tangoDB };
}

interface DeleteDevicePropertyAction extends Action {
  type: typeof DELETE_DEVICE_PROPERTY;
  tangoDB: string;
  device: string;
  name: string;
}

export function deleteDeviceProperty(
  tangoDB: string,
  device,
  name
): DeleteDevicePropertyAction {
  return { type: DELETE_DEVICE_PROPERTY, tangoDB, device, name };
}

interface DeleteDevicePropertySuccessAction extends Action {
  type: typeof DELETE_DEVICE_PROPERTY_SUCCESS;
  tangoDB: string;
  device: string;
  name: string;
}

export function deleteDevicePropertySuccess(
  tangoDB: string,
  device: string,
  name: string
): DeleteDevicePropertySuccessAction {
  return { type: DELETE_DEVICE_PROPERTY_SUCCESS, tangoDB, device, name };
}

interface DeleteDevicePropertyFailedAction extends Action {
  type: typeof DELETE_DEVICE_PROPERTY_FAILED;
  tangoDB: string;
  device: string;
  name: string;
}

export function deleteDevicePropertyFailed(
  tangoDB: string,
  device,
  name
): DeleteDevicePropertyFailedAction {
  return { type: DELETE_DEVICE_PROPERTY_FAILED, tangoDB, device, name };
}

interface SetDataFormatAction extends Action {
  type: typeof SET_DATA_FORMAT;
  format;
}

export function setDataFormat(format): SetDataFormatAction {
  return { type: SET_DATA_FORMAT, format };
}

interface FetchDeviceNamesSuccessAction extends Action {
  type: typeof FETCH_DEVICE_NAMES_SUCCESS;
  names: string[];
}

export function fetchDeviceNamesSuccess(names): FetchDeviceNamesSuccessAction {
  return { type: FETCH_DEVICE_NAMES_SUCCESS, names };
}

interface FetchDeviceNamesFailedAction extends Action {
  type: typeof FETCH_DEVICE_NAMES_FAILED;
  reason;
}

export function fetchDeviceNamesFailed(reason): FetchDeviceNamesFailedAction {
  return { type: FETCH_DEVICE_NAMES_FAILED, reason };
}

interface ExecuteCommandAction extends Action {
  type: typeof EXECUTE_COMMAND;
  tangoDB: string;
  command;
  argin;
  device;
}

export function executeCommand(
  tangoDB: string,
  command,
  argin,
  device
): ExecuteCommandAction {
  return { type: EXECUTE_COMMAND, tangoDB, command, argin, device };
}

interface ExecuteCommandFailedAction extends Action {
  type: typeof EXECUTE_COMMAND_FAILED;
  tangoDB: string;
  command;
  argin;
  device;
}

export function executeCommandFailed(
  tangoDB: string,
  command,
  argin,
  device
): ExecuteCommandFailedAction {
  return { type: EXECUTE_COMMAND_FAILED, tangoDB, command, argin, device };
}

interface ExecuteCommandSuccessAction extends Action {
  type: typeof EXECUTE_COMMAND_SUCCESS;
  tangoDB: string;
  command;
  result;
  device;
}

export function executeCommandSuccess(
  tangoDB: string,
  command,
  result,
  device
): ExecuteCommandSuccessAction {
  return { type: EXECUTE_COMMAND_SUCCESS, tangoDB, command, result, device };
}

interface SetDeviceAttributeAction extends Action {
  type: typeof SET_DEVICE_ATTRIBUTE;
  tangoDB: string;
  device: string;
  name: string;
  value;
}

export function setDeviceAttribute(
  tangoDB: string,
  device: string,
  name: string,
  value
): SetDeviceAttributeAction {
  return { type: SET_DEVICE_ATTRIBUTE, tangoDB, device, name, value };
}

interface SetDeviceAttributeSuccessAction extends Action {
  type: typeof SET_DEVICE_ATTRIBUTE_SUCCESS;
  tangoDB: string;
  attribute;
}

export function setDeviceAttributeSuccess(
  tangoDB: string,
  attribute: string
): SetDeviceAttributeSuccessAction {
  return { type: SET_DEVICE_ATTRIBUTE_SUCCESS, tangoDB, attribute };
}

interface SetDeviceAttributeFailedAction extends Action {
  type: typeof SET_DEVICE_ATTRIBUTE_FAILED;
  tangoDB: string;
  device: string;
  name: string;
  value;
}

export function setDeviceAttributeFailed(
  tangoDB: string,
  device: string,
  name: string,
  value
): SetDeviceAttributeFailedAction {
  return { type: SET_DEVICE_ATTRIBUTE_FAILED, tangoDB, device, name, value };
}

interface SetDevicePropertyAction extends Action {
  type: typeof SET_DEVICE_PROPERTY;
  tangoDB: string;
  device;
  name: string;
  value;
}

export function setDeviceProperty(
  tangoDB: string,
  device: string,
  name: string,
  value
): SetDevicePropertyAction {
  return { type: SET_DEVICE_PROPERTY, tangoDB, device, name, value };
}

interface SetDevicePropertySuccessAction extends Action {
  type: typeof SET_DEVICE_PROPERTY_SUCCESS;
  tangoDB: string;
  device: string;
  name: string;
  value;
}

export function setDevicePropertySuccess(
  tangoDB: string,
  device: string,
  name: string,
  value
): SetDevicePropertySuccessAction {
  return { type: SET_DEVICE_PROPERTY_SUCCESS, tangoDB, device, name, value };
}

interface SetDevicePropertyFailedAction extends Action {
  type: typeof SET_DEVICE_PROPERTY_FAILED;
  tangoDB: string;
  device: string;
  name: string;
  value;
}

export function setDevicePropertyFailed(
  tangoDB: string,
  device: string,
  name: string,
  value
): SetDevicePropertyFailedAction {
  return { type: SET_DEVICE_PROPERTY_FAILED, tangoDB, device, name, value };
}

interface EnableDisplevelAction extends Action {
  type: typeof ENABLE_DISPLEVEL;
  displevel;
}

export function enableDisplevel(displevel): EnableDisplevelAction {
  return { type: ENABLE_DISPLEVEL, displevel };
}

interface DisableDisplevelAction extends Action {
  type: typeof DISABLE_DISPLEVEL;
  displevel;
}

export function disableDisplevel(displevel): DisableDisplevelAction {
  return { type: DISABLE_DISPLEVEL, displevel };
}

interface FetchDeviceAction extends Action {
  type: typeof FETCH_DEVICE;
  tangoDB: string;
  name: string;
}

export function fetchDevice(tangoDB, name): FetchDeviceAction {
  return { type: FETCH_DEVICE, tangoDB, name };
}

interface FetchDeviceSuccessAction extends Action {
  type: typeof FETCH_DEVICE_SUCCESS;
  tangoDB: string;
  device;
}

export function fetchDeviceSuccess(
  tangoDB: string,
  device
): FetchDeviceSuccessAction {
  return { type: FETCH_DEVICE_SUCCESS, tangoDB, device };
}

interface FetchDeviceFailedAction extends Action {
  type: typeof FETCH_DEVICE_FAILED;
  tangoDB: string;
  name: string;
}

export function fetchDeviceFailed(tangoDB, name): FetchDeviceFailedAction {
  return { type: FETCH_DEVICE_FAILED, tangoDB, name };
}

interface AttributeFrameReceivedAction extends Action {
  type: typeof ATTRIBUTE_FRAME_RECEIVED;
  frame;
}

export function attributeFrameReceived(frame): AttributeFrameReceivedAction {
  return { type: ATTRIBUTE_FRAME_RECEIVED, frame };
}

interface DeviceStateReceivedAction extends Action {
  type: typeof DEVICE_STATE_RECEIVED;
  device: string;
  state: string;
}

interface FetchLoggedActionsAction extends Action {
  type: typeof FETCH_LOGGED_ACTIONS;
  tangoDB: string;
  deviceName: string;
  limit;
}

export function fetchLoggedActions(
  tangoDB: string,
  deviceName: string,
  limit
): FetchLoggedActionsAction {
  return { type: FETCH_LOGGED_ACTIONS, tangoDB, deviceName, limit };
}

interface FetchLoggedActionsSuccessAction extends Action {
  type: typeof FETCH_LOGGED_ACTIONS_SUCCESS;
  logs;
}

export function fetchLoggedActionsSuccess(
  logs
): FetchLoggedActionsSuccessAction {
  return { type: FETCH_LOGGED_ACTIONS_SUCCESS, logs };
}

interface FetchLoggedActionsFailedAction extends Action {
  type: typeof FETCH_LOGGED_ACTIONS_FAILED;
  reason;
}

export function fetchLoggedActionsFailed(
  reason
): FetchLoggedActionsFailedAction {
  return { type: FETCH_LOGGED_ACTIONS_FAILED, reason };
}

export type TangoAction =
  | FetchDatabaseInfoAction
  | FetchDatabaseInfoSuccessAction
  | FetchDatabaseInfoFailedAction
  | FetchDeviceNamesAction
  | DeleteDevicePropertyAction
  | DeleteDevicePropertySuccessAction
  | DeleteDevicePropertyFailedAction
  | SetDataFormatAction
  | FetchDeviceNamesSuccessAction
  | FetchDeviceNamesFailedAction
  | ExecuteCommandAction
  | ExecuteCommandFailedAction
  | ExecuteCommandSuccessAction
  | SetDeviceAttributeAction
  | SetDeviceAttributeSuccessAction
  | SetDeviceAttributeFailedAction
  | SetDevicePropertyAction
  | SetDevicePropertySuccessAction
  | SetDevicePropertyFailedAction
  | EnableDisplevelAction
  | DisableDisplevelAction
  | FetchDeviceAction
  | FetchDeviceSuccessAction
  | FetchDeviceFailedAction
  | AttributeFrameReceivedAction
  | DeviceStateReceivedAction
  | FetchLoggedActionsAction
  | FetchLoggedActionsSuccessAction
  | FetchLoggedActionsFailedAction;
