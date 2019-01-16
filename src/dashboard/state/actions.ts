import { Action } from "redux";
import { ADD_WIDGET, SELECT_WIDGET, SELECT_CANVAS } from "./actionTypes";

export interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
}

export interface ISelectWidgetAction extends Action {
  type: typeof SELECT_WIDGET;
}

export interface ISelectCanvasAction extends Action {
  type: typeof SELECT_CANVAS;
}

export type IDashboardAction =
  | IAddWidgetAction
  | ISelectCanvasAction
  | ISelectWidgetAction;
