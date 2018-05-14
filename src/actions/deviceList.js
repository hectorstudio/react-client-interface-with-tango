import * as types from './actionTypes';

export function setDeviceFilter(filter) {
  return {type: types.SET_SEARCH_FILTER, filter: filter};
}