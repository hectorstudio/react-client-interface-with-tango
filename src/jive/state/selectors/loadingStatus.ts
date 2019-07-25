import { createSelector } from "reselect";
import { IRootState } from "../reducers/rootReducer";

function getLoadingStatusState(state: IRootState) {
  return state.loadingStatus;
}

export const getDeviceIsLoading = createSelector(
  getLoadingStatusState,
  state => state.loadingDevice
);

export const getDeviceNamesAreLoading = createSelector(
  getLoadingStatusState,
  state => state.loadingNames
);

export const getCommandOutputsLoading = createSelector(
  getLoadingStatusState,
  state => state.loadingOutput
);
