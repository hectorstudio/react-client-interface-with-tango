import { createSelector } from "reselect";
import { IRootState } from "../reducers/rootReducer";

function getDeviceViewState(state: IRootState) {
  return state.deviceDetail;
}

export const getActiveDataFormat = createSelector(
  getDeviceViewState,
  state => state.activeDataFormat
);

export const getDisabledDisplevels = createSelector(
  getDeviceViewState,
  state => state.disabledDisplevels
);
