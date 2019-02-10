import { createSelector } from "reselect";
import { RootState } from "../reducers";

function getWidgetState(state: RootState) {
  return state.widgets;
}

function getUIState(state: RootState) {
  return state.ui;
}

function getCanvasState(state: RootState) {
  return state.canvases;
}

export const getMode = createSelector(
  getUIState,
  ui => ui.mode
);

export const getWidgets = createSelector(
  getWidgetState,
  state => Object.keys(state.widgets).map(key => state.widgets[key])
);

export const getSelectedWidgets = createSelector(
  getWidgetState,
  ({ selectedIds, widgets }) => selectedIds.map(id => widgets[id])
);

export const getCurrentCanvasWidgets = createSelector(
  getUIState,
  getWidgets,
  (ui, widgets) => widgets.filter(widget => widget.canvas === ui.selectedCanvas)
);

export const getCanvases = createSelector(
  getCanvasState,
  state => Object.keys(state).map(id => state[id])
);

export const getSelectedCanvas = createSelector(
  getUIState,
  getCanvasState,
  (ui, canvas) => canvas[ui.selectedCanvas]
);
