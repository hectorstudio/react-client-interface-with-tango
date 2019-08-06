import {
  UNDO,
  REDO,
  ADD_WIDGET,
  MOVE_WIDGETS,
  RESIZE_WIDGET,
  DELETE_WIDGET,
  SELECT_CANVAS,
  TOGGLE_MODE,
  SELECT_WIDGETS,
  DASHBOARD_LOADED,
  DASHBOARDS_LOADED,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_CLONED,
  LOAD_DASHBOARD,
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  SAVE_DASHBOARD,
  DASHBOARD_SAVED,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from "./actionTypes";

import {
  UndoAction,
  RedoAction,
  AddWidgetAction,
  MoveWidgetsAction,
  ResizeWidgetAction,
  DeleteWidgetAction,
  SelectCanvasAction,
  ToggleModeAction,
  SelectWidgetsAction,
  DashboardLoadedAction,
  DashboardRenamedAction,
  SaveDashboardAction,
  DashboardSavedAction,
  RenameDashboardAction,
  CloneDashboardAction
} from "./actions";

import { Widget, Dashboard } from "../types";

export function undo(): UndoAction{
  return {type: UNDO}
}

export function redo(): RedoAction{
  return {type: REDO}
}

export function addWidget(
  x: number,
  y: number,
  widgetType: string,
  canvas: string
): AddWidgetAction {
  return { type: ADD_WIDGET, x, y, widgetType, canvas };
}

export function moveWidgets(
  ids: string[],
  dx: number,
  dy: number
): MoveWidgetsAction {
  return { type: MOVE_WIDGETS, dx, dy, ids };
}

export function resizeWidget(
  id: string,
  mx: number,
  my: number,
  dx: number,
  dy: number
): ResizeWidgetAction {
  return { type: RESIZE_WIDGET, mx, my, dx, dy, id };
}

export function selectWidgets(ids: string[]): SelectWidgetsAction {
  return { type: SELECT_WIDGETS, ids };
}

export function deleteWidget(): DeleteWidgetAction {
  return { type: DELETE_WIDGET };
}

export function selectCanvas(id: string): SelectCanvasAction {
  return { type: SELECT_CANVAS, id };
}

export function toggleMode(): ToggleModeAction {
  return { type: TOGGLE_MODE };
}

export function dashboardsLoaded(dashboards: Dashboard[]) {
  return { type: DASHBOARDS_LOADED, dashboards };
}

export function renameDashboard(
  id: string,
  name: string
): RenameDashboardAction {
  return { type: RENAME_DASHBOARD, id, name };
}
export function dashboardRenamed(
  id: string,
  name: string
): DashboardRenamedAction {
  return { type: DASHBOARD_RENAMED, id, name };
}
export function deleteDashboard(id: string) {
  return { type: DELETE_DASHBOARD, id };
}
export function dashboardDeleted(id: string) {
  return { type: DASHBOARD_DELETED, id };
}
export function cloneDashboard(
  id: string,
  newUser: string
): CloneDashboardAction {
  return { type: CLONE_DASHBOARD, id, newUser };
}
export function dashboardCloned(id: string) {
  return { type: DASHBOARD_CLONED, id };
}
export function loadDashboard(id: string) {
  return { type: LOAD_DASHBOARD, id };
}
export function dashboardLoaded(
  dashboard: Dashboard,
  widgets: Widget[]
): DashboardLoadedAction {
  return { type: DASHBOARD_LOADED, dashboard, widgets };
}
export function dashboardSaved(
  id: string,
  created: boolean,
  name: string
): DashboardSavedAction {
  return { type: DASHBOARD_SAVED, id, created, name };
}

export function saveDashboard(
  id: string,
  name: string,
  widgets: Widget[]
): SaveDashboardAction {
  return { type: SAVE_DASHBOARD, id, name, widgets };
}

export function showNotification(level: string, action: string, msg: string) {
  return { type: SHOW_NOTIFICATION, notification: { level, action, msg } };
}
export function hideNotification() {
  return { type: HIDE_NOTIFICATION };
}
