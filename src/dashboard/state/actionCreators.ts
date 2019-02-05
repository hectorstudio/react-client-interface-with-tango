import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  RESIZE_WIDGET,
  DELETE_WIDGET
} from "./actionTypes";

import {
  AddWidgetAction,
  MoveWidgetAction,
  SelectWidgetAction,
  ResizeWidgetAction,
  DeleteWidgetAction
} from "./actions";

export function addWidget(
  x: number,
  y: number,
  widgetType: string,
  canvas: number
): AddWidgetAction {
  return { type: ADD_WIDGET, x, y, widgetType, canvas };
}

export function moveWidget(
  id: string,
  dx: number,
  dy: number
): MoveWidgetAction {
  return { type: MOVE_WIDGET, dx, dy, id };
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

export function selectWidget(id: string): SelectWidgetAction {
  return { type: SELECT_WIDGET, id };
}

export function deleteWidget(id: string): DeleteWidgetAction {
  return { type: DELETE_WIDGET, id };
}