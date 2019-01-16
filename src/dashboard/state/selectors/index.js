import { createSelector } from "reselect";

function getCanvasesState(state) {
  return state.canvases;
}

export const getSelectedWidget = createSelector(
  getCanvasesState,
  state => {
    return null;
  }
);
