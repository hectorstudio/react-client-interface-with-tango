import { Action } from "redux";
import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  DELETE_INPUT,
  ADD_INPUT,
  SET_INPUT
} from "./actionTypes";
import { IWidgetDefinition, IndexPath } from "../types";

export interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  definition: IWidgetDefinition;
}

export interface IMoveWidgetAction extends Action {
  type: typeof MOVE_WIDGET;
  dx: number;
  dy: number;
  index: number;
}

export interface ISelectWidgetAction extends Action {
  type: typeof SELECT_WIDGET;
  index: number;
}

export interface IDeleteWidgetAction extends Action {
  type: typeof DELETE_WIDGET;
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
  | ISelectWidgetAction
  | IDeleteWidgetAction
  | ISetInputAction
  | IAddInputAction
  | IDeleteInputAction;
