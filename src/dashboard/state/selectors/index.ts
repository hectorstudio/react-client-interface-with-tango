import { createSelector } from "reselect";
import { RootState } from "../reducers";
<<<<<<< HEAD
import { SelectedDashboardState } from "../reducers/selectedDashboard";

function getSelectedDashboardState(state: RootState):SelectedDashboardState {
=======

function getSelectedDashboardState(state: RootState) {
>>>>>>> origin/master
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

function getUserState(state: RootState) {
  return state.user;
}
function getNotificationsState(state: RootState) {
  return state.notifications;
}
export const getNotification = createSelector(
  getNotificationsState,
  state => state.notification
);
<<<<<<< HEAD
export const hasSelectedWidgets = createSelector(
  getSelectedDashboardState,
  state => state.selectedIds.length > 0
=======
export const getRedirect = createSelector(
  getSelectedDashboardState,
  state => state.redirect
>>>>>>> origin/master
);
export const getUserName = createSelector(
  getUserState,
  state => state.username
);
export const getDashboards = createSelector(
  getDashboardsState,
  state => state.dashboards
);

export const getSelectedDashboard = createSelector(
  getSelectedDashboardState,
  state => {
<<<<<<< HEAD
    return state;
  }
);
export const getUserGroups = createSelector(
  getUserState,
  state => state.userGroups || []
)
=======
    const { selectedIds, widgets, ...dashboard } = state;
    return dashboard;
  }
);
>>>>>>> origin/master

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
