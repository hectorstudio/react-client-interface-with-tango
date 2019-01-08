import {
  SET_SEARCH_FILTER,
  SET_DATA_FORMAT,
  SET_TAB,
  TOGGLE_EXPAND_DOMAIN,
  TOGGLE_EXPAND_FAMILY
} from "./actionTypes";

export function setDeviceFilter(filter) {
  return { type: SET_SEARCH_FILTER, filter };
}

export function setDataFormat(format) {
  return { type: SET_DATA_FORMAT, format };
}

export function setTab(tab) {
  return { type: SET_TAB, tab };
}

export function toggleExpandDomain(domain) {
  return { type: TOGGLE_EXPAND_DOMAIN, domain };
}

export function toggleExpandFamily(domain, family) {
  return { type: TOGGLE_EXPAND_FAMILY, domain, family };
}
