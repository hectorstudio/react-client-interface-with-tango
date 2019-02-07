import { createSelector } from "reselect";
import { IRootState } from "../reducers/rootReducer";

function getDatabaseState(state: IRootState) {
  return state.database;
}

export const getInfo = createSelector(
  getDatabaseState,
  state => state.info
);
