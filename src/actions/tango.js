import * as types from './actionTypes';
import { displayError } from './ui';
import {uri} from '../constants/websocket.js';

import { setTab } from './deviceList';

const client = require('graphql-client')({
  url: `/db`
})

function callServiceGraphQL(query) {
  return client.query(query, function(req, res) {
    if(res.status === 401) {
      throw new Error('Not authorized')
    }
  })
  .then(json => json.data)
  .catch(err => console.log(err.message))
}

export function fetchDeviceNames() {
  return dispatch => {
    dispatch({type: types.FETCH_DEVICE_NAMES});
    callServiceGraphQL(`
      query {
        devices {
          name
        }
      }
    `)
    .then(data => data.devices.map(device => device.name))
    .then(names => dispatch({type: types.FETCH_DEVICE_NAMES_SUCCESS, names}))
    .catch(err => dispatch(displayError(err.toString())))
  };
}

export function submitCommand(command, argin, device) {
  return (dispatch) => {
    callServiceGraphQL(`
    mutation {
      executeCommand(command:"${command}" device:"${device}" argin: ${argin}) {
        ok,
        message,
        output
     }
    }
    `)
    .then(data => data.executeCommand.output)
    .then(result => dispatch( {type: types.EXECUTE_COMMAND_COMPLETE, command, result}))
    .catch(err => dispatch(displayError(err.toString()))) 
  };
}

export function unSubscribeDevice(device, emit){
  if (device && device.attributes) {
    const models = device.attributes
      .filter(({dataformat}) => dataformat === 'SCALAR')
      .map(({name}) => `${device.name}/${name}`);

    emit("UNSUBSCRIBE", models);
  }
}

export function subscribeDevice(device, emit){
  if (device && device.attributes) {
    const models = device.attributes
      .filter(({dataformat}) => dataformat === 'SCALAR')
      .map(({name}) => `${device.name}/${name}`);
    
    emit("SUBSCRIBE", models);
  }
}

export function enableDisplevel(displevel){
  return dispatch => dispatch({type: types.ENABLE_DISPLEVEL, displevel})
}

export function disableDisplevel(displevel){
  return dispatch => dispatch({type: types.DISABLE_DISPLEVEL, displevel})
}

export function enableAllDisplevel(){
  return dispatch => dispatch({type: types.ENABLE_ALL_DISPLEVEL})
}

export function fetchDeviceSuccess(device, dispatch, emit) {
  // Here we subscribe to the scalar values
  subscribeDevice(device, emit);
  return dispatch({type: types.FETCH_DEVICE_SUCCESS, device});
}

export function fetchDevice(name){
  return ( dispatch, getState, {emit}) => {
    unSubscribeDevice(getState().devices.current, emit);
    dispatch({type: 'FETCH_DEVICE', name});
    callServiceGraphQL(`
      query {
        devices(pattern: "${name}") {
          name
          state
          attributes {
            name
            dataformat
            datatype
            value
            quality
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
    `)
    .then(data => {
      const device = data.devices[0];
      const firstTab = device.properties.length > 0 ? 'properties' : device.attributes.length ? 'attributes' : 'commands';
      dispatch(setTab(firstTab));
      dispatch(fetchDeviceSuccess(device, dispatch, emit));
    })
    .catch(err => dispatch(displayError(err.toString())));
  }
}
