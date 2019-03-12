import { SET_SEARCH_FILTER, SET_DATA_FORMAT } from "./actionTypes";

export function setDeviceFilter(filter) {
  return { type: SET_SEARCH_FILTER, filter };
}
