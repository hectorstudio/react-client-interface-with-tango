import * as types from './actionTypes';

function url() {
  return 'http://w-v-kitslab-cc-0:8900/';
}

export function setDevices(data) {
  return {type: types.SET_DEVICES, list: data};
}


export function setHighlightedDevice(name, data) {
  return {type: types.SET_HIGHLIGHTED_DEVICE, name: name, info: data};
}


export function getDevices() {
  return dispatch => {
    return fetch(url() + "tango/rest/rc3/hosts/w-v-kitslab-csdb-0/10000/devicenames", {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(setDevices(json)));
  };
}


export function getDeviceInfo(name) {
  console.log("hello");
  return dispatch => {
    return fetch(url() + "tango/rest/rc3/hosts/w-v-kitslab-csdb-0/10000/devices/" + name, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(setHighlightedDevice(name, json)));
  };
}