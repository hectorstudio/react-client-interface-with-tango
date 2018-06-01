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

export function fetchDeviceSuccess(device) {
  return {type: types.FETCH_DEVICE_SUCCESS, device};
}

export function fetchDevice(name){
  return dispatch => {
    dispatch({type: 'FETCH_DEVICE', name});
    callServiceGraphQL(`
      query {
        devices(pattern: "${name}") {
          name
          attributes {
            name
            dataformat
            value
          }
          properties{
            name
            value
          }
        }
      }
    `)
    .then(json => dispatch(fetchDeviceSuccess(json.data.devices[0])))
    .catch(err => dispatch(displayError(err.toString())));
  }
}
