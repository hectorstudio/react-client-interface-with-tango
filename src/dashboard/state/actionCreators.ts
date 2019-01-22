import { ADD_WIDGET, MOVE_WIDGET, SELECT_WIDGET } from "./actionTypes";

import {
  IAddWidgetAction,
  IMoveWidgetAction,
  ISelectWidgetAction
} from "./actions";

export function addWidget(
  x: number,
  y: number,
  widgetType: string,
  canvas: number
): IAddWidgetAction {
  return { type: ADD_WIDGET, x, y, widgetType, canvas };
}

export function moveWidget(
  index: number,
  dx: number,
  dy: number
): IMoveWidgetAction {
  return { type: MOVE_WIDGET, dx, dy, index };
}

export function selectWidget(index: number): ISelectWidgetAction {
  return { type: SELECT_WIDGET, index };
}
