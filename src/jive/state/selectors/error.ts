import { IRootState } from "../reducers/rootReducer";

export function getError(state: IRootState) {
  return state.error;
}

export function hasError(state: IRootState) {
  return state.error && state.error !== "";
}
