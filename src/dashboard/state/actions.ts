import { Action } from "redux";
import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  DELETE_INPUT,
  ADD_INPUT,
  SET_INPUT,
  RESIZE_WIDGET
} from "./actionTypes";
import { IndexPath } from "../types";

export interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  widgetType: string;
  canvas: number;
}

export interface IMoveWidgetAction extends Action {
  type: typeof MOVE_WIDGET;
  dx: number;
  dy: number;
  id: string;
}

export interface IResizeWidgetAction extends Action {
  type: typeof RESIZE_WIDGET;
  mx: number;
  my: number;
  dx: number;
  dy: number;
  id: string;
}

export interface ISelectWidgetAction extends Action {
  type: typeof SELECT_WIDGET;
  id: string;
}

export interface IDeleteWidgetAction extends Action {
  type: typeof DELETE_WIDGET;
  id: string;
}

export interface ISetInputAction extends Action {
  type: typeof SET_INPUT;
  path: IndexPath;
  value: any;
}

export interface IAddInputAction extends Action {
  type: typeof ADD_INPUT;
  path: IndexPath;
}

export interface IDeleteInputAction extends Action {
  type: typeof DELETE_INPUT;
  path: IndexPath;
}

export type DashboardAction =
  | IAddWidgetAction
  | IMoveWidgetAction
  | IResizeWidgetAction
  | ISelectWidgetAction
  | IDeleteWidgetAction
  | ISetInputAction
  | IAddInputAction
  | IDeleteInputAction;
