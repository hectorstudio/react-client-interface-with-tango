import { displayError } from './error';
import {uri} from '../constants/websocket';

import { setTab } from './deviceList';
import { queryExistsDevice, queryDeviceWithName } from '../selectors/queries';
import { getCurrentDeviceName } from '../selectors/currentDevice';

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

const client = require('graphql-client')({
  url: `/db`
})

function callServiceGraphQL(query, variables) {
  return client.query(query, variables || {}, function(req, res) {
    if(res.status === 401) {
      throw new Error('Not authorized')
    }
  });
}

export function fetchDeviceNames() {
  return dispatch => {
    dispatch({type: FETCH_DEVICE_NAMES});
    callServiceGraphQL(`
      query {
        devices {
          name
        }
      }
    `)
    .then(({data}) => data.devices.map(device => device.name))
    .then(names => dispatch({type: FETCH_DEVICE_NAMES_SUCCESS, names}))
    .catch(err => dispatch(displayError(err.toString())))
  };
}

export function executeCommand(command, argin, device) {
  return (dispatch) => {
    const params = argin ? {command, argin, device} : {command, device};
    dispatch({type: EXECUTE_COMMAND, ...params});
    callServiceGraphQL(`
    mutation ExecuteCommand($command: String!, $device: String!, $argin: ScalarTypes) {
      executeCommand(command: $command, device: $device, argin: $argin) {
        ok
        message
        output
      }
    }
    `, params)
    .then(({data}) => data.executeCommand.output)
    .then(result => dispatch( {type: EXECUTE_COMMAND_COMPLETE, command, result, device}))
    .catch(err => dispatch(displayError(err.toString()))) 
  };
}


export function setDeviceAttribute(device, name, value) {
  return (dispatch) => {
    dispatch({type: SET_DEVICE_ATTRIBUTE, device, name, value});
    return callServiceGraphQL(`
      mutation SetDeviceAttribute($device: String!, $name: String!, $value: ScalarTypes!) {
        setAttributeValue(device: $device, name: $name, value: $value) {
          ok
          message
        }
      }
    `, {device, name, value})
    .then(({data}) => data.setAttributeValue.ok)
    .then(result => dispatch({type: SET_DEVICE_PROPERTY_SUCCESS, device, name, value, result}))
    .catch(err => dispatch(displayError(err.toString()))) 
  }; 
}

export function setDeviceProperty(device, name, value) {
  return (dispatch) => {
    dispatch({type: SET_DEVICE_PROPERTY, device, name, value});
    return callServiceGraphQL(`
      mutation PutDeviceProperty($device: String!, $name: String!, $value: [String]) {
        putDeviceProperty(device: $device, name: $name, value: $value) {
          ok
          message
        }
      }
    `, {device, name, value})
    .then(() => dispatch({type: SET_DEVICE_PROPERTY_SUCCESS, device, name, value}))
    .catch(err => dispatch(displayError(err.toString()))) 
  }; 
}

export function deleteDeviceProperty(device, name) {
  return (dispatch) => {
    dispatch( {type: DELETE_DEVICE_PROPERTY, device, name});
    return callServiceGraphQL(`
      mutation DeleteDeviceProperty($device: String!, $name: String!) {
        deleteDeviceProperty(device: $device, name: $name) {
          ok
          message
        }
      }
    `, {device, name})
    .then(res => res.deleteDeviceProperty.message[0])
    .then(message => message === "Success"
      ? dispatch({type: DELETE_DEVICE_PROPERTY_SUCCESS, device, name})
      : dispatch({type: DELETE_DEVICE_PROPERTY_FAILED, device, name, message})
    )
    .catch(err => dispatch(displayError(err.toString()))) 
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
  return dispatch => dispatch({type: ENABLE_DISPLEVEL, displevel})
}

export function disableDisplevel(displevel) {
  return dispatch => dispatch({type: DISABLE_DISPLEVEL, displevel})
}

export function fetchDeviceSuccess(device) {
  return (dispatch, getState, {emit}) => {
    subscribeDevice(device, emit);
    return dispatch({type: FETCH_DEVICE_SUCCESS, device});
  }
}

export function selectDevice(name) {
  return (dispatch, getState) => {
    dispatch({type: SELECT_DEVICE, name});
    
    const device = queryDeviceWithName(getState(), name);
    if (device) {
      return dispatch(selectDeviceSuccess(device));
    }

    dispatch(fetchDevice(name)).then(action => {
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

export function fetchDevice(name){
  return ( dispatch, getState, {emit}) => {
    const name = getCurrentDeviceName(getState());
    unSubscribeDevice(name, emit);
    dispatch({type: FETCH_DEVICE, name});
    return callServiceGraphQL(`
      query FetchDevice($name: String!) {
        device(name: $name) {
          name
          state
          server {
            id
            host
          }
          attributes {
            name
            dataformat
            datatype
            value
            quality
            writable
            description
          }
          properties{
            name
            value
          }
          commands{
            name
            tag 
            displevel 
            intype 
            intypedesc 
            outtype 
            outtypedesc 
          }
        }
      }
    `, {name})
    .then(({data, errors}) => {
      if (errors) {
        // dispatch(displayError(errors.map(error => error.message).join('\n\n')));
      }

      const {device} = data;
      return dispatch(device ? fetchDeviceSuccess(device) : {type: FETCH_DEVICE_FAILED, name});
    })
    .catch(err => dispatch(displayError(err.toString())));
  }
}
