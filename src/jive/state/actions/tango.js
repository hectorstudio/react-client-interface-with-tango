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
  FETCH_LOGGED_ACTIONS_FAILED
} from "./actionTypes";

export function fetchDatabaseInfo(tangoDB) {
  return { type: FETCH_DATABASE_INFO, tangoDB };
}

export function fetchDatabaseInfoSuccess(tangoDB, info) {
  return { type: FETCH_DATABASE_INFO_SUCCESS, tangoDB, info };
}

export function fetchDatabaseInfoFailed(tangoDB) {
  return { type: FETCH_DATABASE_INFO_FAILED, tangoDB };
}

export function fetchDeviceNames(tangoDB) {
  return { type: FETCH_DEVICE_NAMES, tangoDB };
}

export function fetchDeviceNamesSuccess(names) {
  return { type: FETCH_DEVICE_NAMES_SUCCESS, names };
}

export function fetchDeviceNamesFailed(reason) {
  return { type: FETCH_DEVICE_NAMES_FAILED, reason };
}

export function executeCommand(tangoDB, command, argin, device) {
  return { type: EXECUTE_COMMAND, tangoDB, command, argin, device };
}

export function executeCommandFailed(tangoDB, command, argin, device) {
  return { type: EXECUTE_COMMAND_FAILED, tangoDB, command, argin, device };
}

export function executeCommandSuccess(tangoDB, command, result, device) {
  return { type: EXECUTE_COMMAND_SUCCESS, tangoDB, command, result, device };
}

export function setDeviceAttribute(tangoDB, device, name, value) {
  return { type: SET_DEVICE_ATTRIBUTE, tangoDB, device, name, value };
}

export function setDeviceAttributeSuccess(tangoDB, device, name, value) {
  return { type: SET_DEVICE_ATTRIBUTE_SUCCESS, tangoDB, device, name, value };
}

export function setDeviceAttributeFailed(tangoDB, device, name, value) {
  return { type: SET_DEVICE_ATTRIBUTE_FAILED, tangoDB, device, name, value };
}

export function setDeviceProperty(tangoDB, device, name, value) {
  return { type: SET_DEVICE_PROPERTY, tangoDB, device, name, value };
}

export function setDevicePropertySuccess(tangoDB, device, name, value) {
  return { type: SET_DEVICE_PROPERTY_SUCCESS, tangoDB, device, name, value };
}

export function setDevicePropertyFailed(tangoDB, device, name, value) {
  return { type: SET_DEVICE_PROPERTY_FAILED, tangoDB, device, name, value };
}

export function deleteDeviceProperty(tangoDB, device, name) {
  return { type: DELETE_DEVICE_PROPERTY, tangoDB, device, name };
}

export function deleteDevicePropertySuccess(tangoDB, device, name) {
  return { type: DELETE_DEVICE_PROPERTY_SUCCESS, tangoDB, device, name };
}

export function deleteDevicePropertyFailed(tangoDB, device, name) {
  return { type: DELETE_DEVICE_PROPERTY_FAILED, tangoDB, device, name };
}

export function enableDisplevel(displevel) {
  return { type: ENABLE_DISPLEVEL, displevel };
}

export function disableDisplevel(displevel) {
  return { type: DISABLE_DISPLEVEL, displevel };
}

export function fetchDeviceSuccess(tangoDB, device) {
  return { type: FETCH_DEVICE_SUCCESS, tangoDB, device };
}

export function fetchDeviceFailed(tangoDB, name) {
  return { type: FETCH_DEVICE_FAILED, tangoDB, name };
}

export function fetchDevice(tangoDB, name) {
  return { type: FETCH_DEVICE, tangoDB, name };
}

export function attributeFrameReceived(frame) {
  return { type: ATTRIBUTE_FRAME_RECEIVED, frame };
}

export function fetchLoggedActions(tangoDB, deviceName, fromDate, toDate, username, category) {
  return { type: FETCH_LOGGED_ACTIONS, tangoDB, deviceName, fromDate, toDate, username, category };
}

export function fetchLoggedActionsSuccess(logs){
  return { type: FETCH_LOGGED_ACTIONS_SUCCESS, logs };
}
export function fetchLoggedActionsFailed(reason) {
  return { type: FETCH_LOGGED_ACTIONS_FAILED, reason };
}
