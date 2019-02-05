import { Action } from "redux";
import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  DELETE_INPUT,
  ADD_INPUT,
  SET_INPUT,
  RESIZE_WIDGET,
  SELECT_CANVAS,
  TOGGLE_MODE
} from "./actionTypes";
import { IndexPath } from "../types";

export interface AddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  widgetType: string;
  canvas: string;
}

export interface MoveWidgetAction extends Action {
  type: typeof MOVE_WIDGET;
  dx: number;
  dy: number;
  id: string;
}

export interface ResizeWidgetAction extends Action {
  type: typeof RESIZE_WIDGET;
  mx: number;
  my: number;
  dx: number;
  dy: number;
  id: string;
}

export interface SelectWidgetAction extends Action {
  type: typeof SELECT_WIDGET;
  id: string;
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

export type DashboardAction =
  | AddWidgetAction
  | MoveWidgetAction
  | ResizeWidgetAction
  | SelectWidgetAction
  | DeleteWidgetAction
  | SetInputAction
  | AddInputAction
  | DeleteInputAction
  | SelectCanvasAction
  | ToggleModeAction;
