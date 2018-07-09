import * as types from './actionTypes';
import { displayError } from './ui';
import {uri} from '../constants/websocket.js';

const client = require('graphql-client')({
  url: `/db`
})

function callServiceGraphQL(query) {
  return client.query(query, function(req, res) {
    if(res.status === 401) {
      throw new Error('Not authorized')
    }
  })
  .then(function(body) {
    return body;
  })
  .catch(function(err) {
    console.log(err.message)
  })
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
    .then(json => json.data.devices.map(device => device.name))
    .then(names => dispatch({type: types.FETCH_DEVICE_NAMES_SUCCESS, names}))
    .catch(err => dispatch(displayError(err.toString())))
  };
}

export function unSubscribeDevice(device, emit){
  if(device){
    let models = [];
    device.attributes.forEach(prop => {
      if(prop.dataformat === "SCALAR"){
        models.push(device.name + "/" + prop.name )
      }
    })
    emit("UNSUBSCRIBE", models);
  }
}

export function subscribeDevice(device, emit){
  let models = [];
  device.attributes.forEach(prop => {
    if(prop.dataformat === "SCALAR"){
      models.push(device.name + "/" + prop.name )
    }
  })
  emit("SUBSCRIBE", models);
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
        }
      }
    `)
    .then(json => fetchDeviceSuccess(json.data.devices[0], dispatch, emit))
    .catch(err => dispatch(displayError(err.toString())));
  }
}
