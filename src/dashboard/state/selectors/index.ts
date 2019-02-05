import { createSelector } from "reselect";
import { RootState } from "../reducers";

function getWidgetState(state: RootState) {
  return state.widgets;
}

function getUState(state: RootState) {
  return state.ui;
}

export const getMode = createSelector(
  getUState,
  ui => ui.mode
);

export const getWidgets = createSelector(
  getWidgetState,
  state => Object.keys(state.widgets).map(key => state.widgets[key])
);

export const getSelectedWidget = createSelector(
  getWidgetState,
  ({ selectedId, widgets }) => (selectedId ? widgets[selectedId] : null)
);
