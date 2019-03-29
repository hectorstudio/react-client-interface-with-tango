import {
  ADD_WIDGET,
  MOVE_WIDGETS,
  RESIZE_WIDGET,
  DELETE_WIDGET,
  SELECT_CANVAS,
  TOGGLE_MODE,
  SELECT_WIDGETS,
  PRELOAD_DASHBOARD,
  DASHBOARDS_LOADED,
} from "./actionTypes";

import {
  AddWidgetAction,
  MoveWidgetsAction,
  ResizeWidgetAction,
  DeleteWidgetAction,
  SelectCanvasAction,
  ToggleModeAction,
  SelectWidgetsAction,
  PreloadDashboardAction
} from "./actions";
import { Widget, Dashboards } from "../types";

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

export function preloadDashboard(
  id: string,
  widgets: Widget[]
): PreloadDashboardAction {
  return { type: PRELOAD_DASHBOARD, id, widgets };
}
