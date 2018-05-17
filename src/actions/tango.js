import * as types from './actionTypes';

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

export function setDevices(data) {
  return {type: types.SET_DEVICES, list: data};
}


export function setHighlightedDevice(name, data) {
  return {type: types.SET_HIGHLIGHTED_DEVICE, name: name, info: data};
}


export function getDevices() {
    var query = `query{
       devices{
          name
        }
      }`;
  return dispatch => callServiceGraphQL(query)
    .then(json => dispatch(setDevices(json.data.devices)));
}

export function getDeviceInfo(name){
  var query = `query{
      devices(pattern: "${name}" ){
        name
        attributes{
          name
        }
        properties{
          name
        }
      }}`;
  return dispatch => callServiceGraphQL(query)
    .then(json => dispatch(setHighlightedDevice(name, json.data.devices[0])));

}