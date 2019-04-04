import {
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

} from "./actionTypes";


import {
  AddWidgetAction,
  MoveWidgetsAction,
  ResizeWidgetAction,
  DeleteWidgetAction,
  SelectCanvasAction,
  ToggleModeAction,
  SelectWidgetsAction,
  DashboardLoadedAction
} from "./actions";
import { Widget, Dashboards, Dashboard } from "../types";

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

export function deleteWidget(id: string): DeleteWidgetAction {
  return { type: DELETE_WIDGET, id };
}

export function selectCanvas(id: string): SelectCanvasAction {
  return { type: SELECT_CANVAS, id };
}

export function toggleMode(): ToggleModeAction {
  return { type: TOGGLE_MODE };
}

export function dashboardsLoaded(dashboards:Dashboards){
  return {type: DASHBOARDS_LOADED, dashboards};
}

export function renameDashboard(dashboard:Dashboard){
  return {type: RENAME_DASHBOARD, dashboard}
}
export function dashboardRenamed(dashboard:Dashboard){
  return {type: DASHBOARD_RENAMED, dashboard};
}
export function deleteDashboard(id:string){
  return {type: DELETE_DASHBOARD, id}
}
export function dashboardDeleted(id:string){
  return {type: DASHBOARD_DELETED, id};
}
export function cloneDashboard(id:string, newUser:string){
  return {type: CLONE_DASHBOARD, id, newUser}
}
export function dashboardCloned(id:string){
  return {type: DASHBOARD_CLONED, id};
}
export function loadDashboard(id: string){
  return {type: LOAD_DASHBOARD, id};
}
export function dashboardLoaded(
  id: string,
  widgets: Widget[],
  name: string,
  user: string,
  redirectRequest: boolean,

): DashboardLoadedAction {
  return { type: DASHBOARD_LOADED, id, widgets, name, user , redirectRequest};
}
export function dashboardSaved(id:string, created:boolean){
  return {type: DASHBOARD_SAVED, id, created};
}

export function saveDashboard(id:string, name:string, widgets:Widget[]){
  return {type: SAVE_DASHBOARD, id, name, widgets};
}


