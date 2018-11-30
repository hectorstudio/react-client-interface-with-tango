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
  EXECUTE_COMMAND_COMPLETE,

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
} from './actionTypes';

export function fetchDeviceNames(tangoDB) {
  return async dispatch => {
    dispatch({ type: FETCH_DEVICE_NAMES });
    try {
      const names = await TangoAPI.fetchDeviceNames(tangoDB);
      dispatch({ type: FETCH_DEVICE_NAMES_SUCCESS, names });
    } catch (err) {
      dispatch(displayError(err.toString()));
    }
  };
}

export function executeCommand(command, argin, device) {
  return async dispatch => {
    dispatch({ type: EXECUTE_COMMAND, command, argin, device });
    try {
      const result = await TangoAPI.executeCommand(command, argin, device);
      dispatch({ type: EXECUTE_COMMAND_COMPLETE, command, result, device });
    } catch (err) {
      dispatch(displayError(err.toString()));
    }
  };
}

export function setDeviceAttribute(device, name, value) {
  return async dispatch => {
    dispatch({ type: SET_DEVICE_ATTRIBUTE, device, name, value });
    try {
      const ok = await TangoAPI.setDeviceAttribute(device, name, value);
      dispatch(
        ok
          ? { type: SET_DEVICE_ATTRIBUTE_SUCCESS, device, name, value }
          : { type: SET_DEVICE_ATTRIBUTE_FAILED, device, name, value }
      );
    } catch (err) {
      dispatch(displayError(err.toString()));
    }
  };
}

export function setDeviceProperty(device, name, value) {
  return async dispatch => {
    try {
      dispatch({ type: SET_DEVICE_PROPERTY, device, name, value });
      const ok = await TangoAPI.setDeviceProperty(device, name, value);
      dispatch(
        ok
          ? { type: SET_DEVICE_PROPERTY_SUCCESS, device, name, value }
          : { type: SET_DEVICE_PROPERTY_FAILED, device, name, value }
      );
    } catch (err) {
      dispatch(displayError(err.toString()));
    }
  };
}

export function deleteDeviceProperty(device, name) {
  return async dispatch => {
    try {
      dispatch({ type: DELETE_DEVICE_PROPERTY, device, name });
      const ok = await TangoAPI.deleteDeviceProperty(device, name);
      dispatch(
        ok
          ? { type: DELETE_DEVICE_PROPERTY_SUCCESS, device, name }
          : {
              type: DELETE_DEVICE_PROPERTY_FAILED,
              device,
              name
            }
      );
    } catch (err) {
      dispatch(displayError(err.toString()));
    }
  };
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

export function selectDevice(tangoDB, name) {
  return (dispatch, getState) => {
    dispatch({type: SELECT_DEVICE, tangoDB, name});
    
    const device = queryDeviceWithName(getState(), name);
    if (device) {
      return dispatch(selectDeviceSuccess(device));
    }

    dispatch(fetchDevice(tangoDB, name)).then(action => {
      if (action.type === FETCH_DEVICE_SUCCESS) {
        const newDevice = action.device;
        return dispatch(selectDeviceSuccess(newDevice));
      }
    })
  }
}

function selectDeviceSuccess(device) {
  return {type: SELECT_DEVICE_SUCCESS, device};
}

export function fetchDevice(tangoDB, name) {
  return async (dispatch, getState, { emit }) => {
    const name = getCurrentDeviceName(getState());
    unSubscribeDevice(name, emit);
    dispatch({type: FETCH_DEVICE, name});
    
    try {
      const device = await TangoAPI.fetchDevice(tangoDB, name);
      return dispatch(device ? fetchDeviceSuccess(device) : displayError("The device " + name + " was not found"));
    } catch (err) {
      return dispatch(displayError(err.toString()));
    }
  }
}
