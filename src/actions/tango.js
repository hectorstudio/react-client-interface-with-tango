import { displayError } from './error';
import {uri} from '../constants/websocket';

import { setTab } from './deviceList';
import { queryExistsDevice, queryDeviceWithName } from '../selectors/queries';
import { getCurrentDeviceName } from '../selectors/currentDevice';

import TangoAPI from './api/tango';

import {
  FETCH_DEVICE,
  FETCH_DEVICE_SUCCESS,
  FETCH_DEVICE_FAILED,

  FETCH_DEVICE_NAMES,
  FETCH_DEVICE_NAMES_SUCCESS,
  
  EXECUTE_COMMAND,
  EXECUTE_COMMAND_SUCCESS,
  EXECUTE_COMMAND_FAILED,

  SELECT_DEVICE,
  SELECT_DEVICE_SUCCESS,

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
} from './actionTypes';

export function preloadDevice(tangoDB, device) {
  return { type: "PRELOAD_DEVICE", tangoDB, device };
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

export function unSubscribeDevice(device, emit){
  if (device && device.attributes) {
    const models = device.attributes
      .map(({name}) => `${device.name}/${name}`);
    const query =`
    subscription newChangeEvent($models:[String]){
      unsubChangeEvent(models:$models)
    }`
    const variables = {"models":models}   
    emit("start", {query,variables});
  }
}

export function subscribeDevice(device, emit){
  if (device && device.attributes) {
    const models = device.attributes
      .map(({name}) => `${device.name}/${name}`);
    const query = `
    subscription newChangeEvent($models:[String]){
      changeEvent(models:$models){
        eventType,
        device,
        name,
        data {
          value
        }
      }
    }`;
    const variables = {"models":models};
    emit("start", {query,variables});
  }
}

export function enableDisplevel(displevel) {
  return { type: ENABLE_DISPLEVEL, displevel };
}

export function disableDisplevel(displevel) {
  return { type: DISABLE_DISPLEVEL, displevel };
}

export function fetchDeviceSuccess(device) {
  return (dispatch, getState, {emit}) => {
    subscribeDevice(device, emit);
    return dispatch({type: FETCH_DEVICE_SUCCESS, device});
  }
}

export function fetchDeviceFailed(name) {
  return { type: FETCH_DEVICE_FAILED, name };
}

export function selectDevice(tangoDB, name) {
  return { type: SELECT_DEVICE, tangoDB, name };
}

export function fetchDevice(tangoDB, name) {
  return async (dispatch, getState, { emit }) => {
    const name = getCurrentDeviceName(getState());
    unSubscribeDevice(name, emit);
    dispatch({type: FETCH_DEVICE, name});
    
    const device = await TangoAPI.fetchDevice(tangoDB, name);
    const action = device ? fetchDeviceSuccess(device) : fetchDeviceFailed(name);
    return dispatch(action);
  }
}
