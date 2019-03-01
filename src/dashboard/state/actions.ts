import { Action } from "redux";
import {
  ADD_WIDGET,
  MOVE_WIDGETS,
  SELECT_WIDGETS,
  DELETE_WIDGET,
  DELETE_INPUT,
  ADD_INPUT,
  SET_INPUT,
  RESIZE_WIDGET,
  SELECT_CANVAS,
  TOGGLE_MODE,
  PRELOAD_DASHBOARD
} from "./actionTypes";
import { IndexPath, Widget } from "../types";

export interface AddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  widgetType: string;
  canvas: string;
}

export interface MoveWidgetsAction extends Action {
  type: typeof MOVE_WIDGETS;
  dx: number;
  dy: number;
  ids: string[];
}

export interface ResizeWidgetAction extends Action {
  type: typeof RESIZE_WIDGET;
  mx: number;
  my: number;
  dx: number;
  dy: number;
  id: string;
}

export interface SelectWidgetsAction extends Action {
  type: typeof SELECT_WIDGETS;
  ids: string[];
}

export interface DeleteWidgetAction extends Action {
  type: typeof DELETE_WIDGET;
  id: string;
}

export interface SetInputAction extends Action {
  type: typeof SET_INPUT;
  path: IndexPath;
  value: any;
}

export interface AddInputAction extends Action {
  type: typeof ADD_INPUT;
  path: IndexPath;
}

export interface DeleteInputAction extends Action {
  type: typeof DELETE_INPUT;
  path: IndexPath;
}

export interface SelectCanvasAction extends Action {
  type: typeof SELECT_CANVAS;
  id: string;
}

export interface ToggleModeAction extends Action {
  type: typeof TOGGLE_MODE;
}

export interface PreloadDashboardAction extends Action {
  type: typeof PRELOAD_DASHBOARD;
  id: string;
  widgets: Widget[];
}

export type DashboardAction =
  | AddWidgetAction
  | MoveWidgetsAction
  | ResizeWidgetAction
  | SelectWidgetsAction
  | DeleteWidgetAction
  | SetInputAction
  | AddInputAction
  | DeleteInputAction
  | SelectCanvasAction
  | ToggleModeAction
  | PreloadDashboardAction;
