import * as types from './actionTypes';

const serviceConfig = {
  baseUrl: 'http://w-v-kitslab-cc-0:8900/',
  dbHost: 'w-v-kitslab-csdb-0',
  dbPort: 10000
};

function callService(path) {
  const {baseUrl, dbHost, dbPort} = serviceConfig;
  const url = `${baseUrl}tango/rest/rc3/hosts/${dbHost}/${dbPort}/${path}`;
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });
}


export function setDevices(data) {
  return {type: types.SET_DEVICES, list: data};
}


export function setHighlightedDevice(name, data) {
  return {type: types.SET_HIGHLIGHTED_DEVICE, name: name, info: data};
}


export function getDevices() {
  return dispatch => callService('devicenames')
    .then(response => response.json())
    .then(json => dispatch(setDevices(json)));
}


// export function getDeviceInfo(name) {
//   return dispatch => {
//     return fetch(url() + "tango/rest/rc3/hosts/w-v-kitslab-csdb-0/10000/devices/" + name, {
//       method: 'GET',
//       mode: 'cors',
//       credentials: 'include',
//       headers: {
//         'Accept': 'application/json'
//       }
//     })
//     .then(response => response.json())
//     .then(json => dispatch(setHighlightedDevice(name, json)));
//   };
// }


export function getDeviceProperties(name) {
  return dispatch => callService(`devices/${name}/properties`)
    .then(response => response.json())
    .then(json => dispatch(setHighlightedDevice(name, json)));
}
