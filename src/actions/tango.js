import * as types from './actionTypes';
import { displayError } from './ui';

const client = require('graphql-client')({
  url: '/db'
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

export function fetchDeviceSuccess(device, dispatch, emit) {
  let models = [];
  device.attributes.map(prop => {
    if(prop.dataformat === "SCALAR"){
      models.push(device.name + "/" + prop.name )
    }
  })
  emit(models);
  return dispatch({type: types.FETCH_DEVICE_SUCCESS, device});
}

export function fetchDevice(name){
  return ( dispatch, getState, {emit}) => {
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
