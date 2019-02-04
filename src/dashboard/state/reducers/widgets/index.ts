import { IWidget } from "../../../types";

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
  replaceAt,
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

import {
  definitionForType,
  definitionForWidget
} from "src/dashboard/widgets";

import { defaultInputs } from "src/dashboard/utils";

export interface IWidgetsState {
  selectedId: string | null;
  widgets: { [id: string]: IWidget };
}

const initialState = {
  selectedId: null,
  widgets: {}
};

export default function canvases(
  state: IWidgetsState = initialState,
  action: DashboardAction
): IWidgetsState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, widgetType: type } = action;
      const definition = definitionForType(type)!;
      const inputs = defaultInputs(definition.inputs);
      const { width, height } = defaultDimensions(definition);
      const id = nextId(state.widgets);

      const widget = validate({
        id,
        x,
        y,
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
      const widgets = replaceAt(state.widgets, id, newWidget);
      return { ...state, widgets };
    }
    case RESIZE_WIDGET: {
      const { dx, dy, mx, my, index } = action;
      const newWidget = resize(state.widgets[index], mx, my, dx, dy);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case SELECT_WIDGET: {
      const { index } = action;
      return { ...state, selectedIndex: index };
    }
    case DELETE_WIDGET: {
      if (state.selectedIndex !== -1) {
        const widgets = removeAt(state.widgets, state.selectedIndex);
        return { ...state, widgets, selectedIndex: -1 };
      } else {
        return state;
      }
    }
    case SET_INPUT: {
      const { path, value } = action;
      const index = state.selectedIndex;
      const newWidget = validate(setInput(state.widgets[index], path, value));
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case ADD_INPUT: {
      const { path } = action;
      const index = state.selectedIndex;
      const oldWidget = state.widgets[index];
      const definition = definitionForWidget(oldWidget)!;
      const value = nestedDefault(definition, path);
      const newWidget = validate(
        addInput(state.widgets[index], [...path, -1], value)
      );
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case DELETE_INPUT: {
      const { path } = action;
      const index = state.selectedIndex;
      const newWidget = validate(deleteInput(state.widgets[index], path));
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    default:
      return state;
  }
}
