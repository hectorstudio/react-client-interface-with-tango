import { ADD_WIDGET, MOVE_WIDGET, SELECT_WIDGET } from "./actionTypes";
import { IWidgetDefinition } from "../types";

import {
  IAddWidgetAction,
  IMoveWidgetAction,
  ISelectWidgetAction
} from "./actions";

export function addWidget(
  x: number,
  y: number,
  definition: IWidgetDefinition
): IAddWidgetAction {
  return { type: ADD_WIDGET, x, y, definition };
}

export function moveWidget(
  dx: number,
  dy: number,
  index: number
): IMoveWidgetAction {
  return { type: MOVE_WIDGET, dx, dy, index };
}

export function selectWidget(index: number): ISelectWidgetAction {
  return { type: SELECT_WIDGET, index };
}
