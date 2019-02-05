import { createSelector } from "reselect";
import { IRootState } from "../reducers";

function getWidgetState(state: IRootState) {
  return state.widgets;
}

function getUIState(state: IRootState) {
  return state.ui;
}

export const getMode = createSelector(
  getUIState,
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
