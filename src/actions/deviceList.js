import * as types from './actionTypes';

export function setDeviceFilter(filter) {
  return {type: types.SET_SEARCH_FILTER, filter: filter};
}

export function setDataFormat(format) {
  return {type: types.SET_DATA_FORMAT, format};
}

export function setTab(tab) {
  return {type: types.SET_TAB, tab};
}