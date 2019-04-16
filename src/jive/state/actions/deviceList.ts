import { Action } from "redux";
import { SET_SEARCH_FILTER } from "./actionTypes";

interface SetDeviceFilterAction extends Action {
  type: typeof SET_SEARCH_FILTER;
  filter: string;
}

export function setDeviceFilter(filter: string): SetDeviceFilterAction {
  return { type: SET_SEARCH_FILTER, filter };
}

export type DeviceListAction = SetDeviceFilterAction;
