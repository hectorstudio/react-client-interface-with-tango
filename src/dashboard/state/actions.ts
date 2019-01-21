import { Action } from "redux";
import { ADD_WIDGET, MOVE_WIDGET, SELECT_WIDGET } from "./actionTypes";
import { IWidgetDefinition } from "../types";

export interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  definition: IWidgetDefinition;
}

export interface IMoveWidgetAction extends Action {
  type: typeof MOVE_WIDGET;
  index: number;
  dx: number;
  dy: number;
}

export interface ISelectWidgetAction extends Action {
  type: typeof SELECT_WIDGET;
  index: number;
}

export type DashboardAction = IAddWidgetAction | IMoveWidgetAction | ISelectWidgetAction;
