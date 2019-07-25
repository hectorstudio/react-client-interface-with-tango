import { IRootState } from "../reducers/rootReducer";
import { createSelector } from "reselect";

export function getCommandOutputState(state: IRootState) {
  return state.commandOutput;
}

export function getCommandOutputs(device) {
  return createSelector(
    getCommandOutputState,
    outputs => outputs[device] || {}
  );
}
