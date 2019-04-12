import { SET_SEARCH_FILTER } from "./actionTypes";

export function setDeviceFilter(filter) {
  return { type: SET_SEARCH_FILTER, filter };
}
