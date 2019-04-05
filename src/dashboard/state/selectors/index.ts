import { createSelector } from "reselect";
import { RootState } from "../reducers";

function getSelectedDashboardState(state: RootState) {
  return state.selectedDashboard;
}

function getUIState(state: RootState) {
  return state.ui;
}

function getCanvasState(state: RootState) {
  return state.canvases;
}

function getDashboardsState(state: RootState) {
  return state.dashboards;
}

function getUserState(state: RootState){
  return state.user;
}
function getNotificationsState(state: RootState){
  return state.notifications;
}
export const getNotification = createSelector(
  getNotificationsState,
  state => state.notification 
)
export const getRedirectRequest = createSelector(
  getSelectedDashboardState,
  state => state.redirectRequest
)
export const getUserName = createSelector(
  getUserState,
  state => state.username
)
export const getDashboards = createSelector(
  getDashboardsState,
  state => state.dashboards
);

export const getSelectedDashboard = createSelector(
  getSelectedDashboardState,
  state => ({id: state.id, name: state.name, user: state.user})
)
const getWidgetsObject = createSelector(
  getSelectedDashboardState,
  state => state.widgets
);

export const getMode = createSelector(
  getUIState,
  ui => ui.mode
);

export const getWidgets = createSelector(
  getWidgetsObject,
  widgetsObject => Object.keys(widgetsObject).map(key => widgetsObject[key])
);

export const getSelectedWidgets = createSelector(
  getSelectedDashboardState,
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
