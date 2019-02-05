import { Widget } from "../../../types";

import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  SET_INPUT,
  DELETE_INPUT,
  ADD_INPUT,
  RESIZE_WIDGET
} from "../../actionTypes";

import { DashboardAction } from "../../actions";
import {
  move,
  removeAt,
  setInput,
  deleteInput,
  addInput,
  defaultDimensions,
  nestedDefault,
  validate,
  resize,
  nextId
} from "./lib";

import { definitionForType, definitionForWidget } from "src/dashboard/widgets";

import { defaultInputs } from "src/dashboard/utils";

export interface WidgetsState {
  selectedId: string | null;
  widgets: Record<string, Widget>;
}

const initialState = {
  selectedId: null,
  widgets: {}
};

export default function canvases(
  state: WidgetsState = initialState,
  action: DashboardAction
): WidgetsState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, canvas, widgetType: type } = action;
      const definition = definitionForType(type)!;
      const inputs = defaultInputs(definition.inputs);
      const { width, height } = defaultDimensions(definition);
      const id = nextId(state.widgets);

      const widget = validate({
        id,
        x,
        y,
        canvas,
        width,
        height,
        type,
        inputs,
        valid: false
      });

      return {
        ...state,
        widgets: { ...state.widgets, [id]: widget },
        selectedId: id
      };
    }
    case MOVE_WIDGET: {
      const { dx, dy, id } = action;
      const newWidget = move(state.widgets[id], dx, dy);
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case RESIZE_WIDGET: {
      const { dx, dy, mx, my, id } = action;
      const newWidget = resize(state.widgets[id], mx, my, dx, dy);
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case SELECT_WIDGET: {
      const { id } = action;
      return { ...state, selectedId: id };
    }
    case DELETE_WIDGET: {
      if (state.selectedId != null) {
        const widgets = removeAt(state.widgets, state.selectedId);
        return { ...state, widgets, selectedId: null };
      } else {
        return state;
      }
    }
    case SET_INPUT: {
      const { path, value } = action;
      const id = state.selectedId;
      if (id == null) {
        return state;
      }
      const newWidget = validate(setInput(state.widgets[id], path, value));
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case ADD_INPUT: {
      const { path } = action;
      const id = state.selectedId;
      if (id == null) {
        return state;
      }
      const oldWidget = state.widgets[id];
      const definition = definitionForWidget(oldWidget)!;
      const value = nestedDefault(definition, path);
      const newWidget = validate(
        addInput(state.widgets[id], [...path, -1], value)
      );
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case DELETE_INPUT: {
      const { path } = action;
      const id = state.selectedId;
      if (id == null) {
        return state;
      }
      const newWidget = validate(deleteInput(state.widgets[id], path));
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    default:
      return state;
  }
}
