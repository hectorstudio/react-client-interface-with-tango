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

export function toggleExpandDomain(domain) {
  return {type: types.TOGGLE_EXPAND_DOMAIN, domain};
}

export function toggleExpandFamily(domain, family) {
  return {type: types.TOGGLE_EXPAND_FAMILY, domain, family};
}
