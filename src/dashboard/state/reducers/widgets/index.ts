import { IWidget } from "../../../types";

import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  SET_INPUT,
  DELETE_INPUT,
  ADD_INPUT
} from "../../actionTypes";

import { defaultInputs } from "src/dashboard/utils";
import { DashboardAction } from "../../actions";
import { move, replaceAt, removeAt, setInput, deleteInput } from "./lib";
import { definitionForType } from "src/dashboard/newWidgets";

interface IWidgetState {
  selectedIndex: number;
  widgets: IWidget[];
}

const initialState = {
  selectedIndex: -1,
  widgets: []
};

function defaultDimensions(definition): { width: number; height: number } {
  return { width: 100, height: 100 };
}

export default function canvases(
  state: IWidgetState = initialState,
  action: DashboardAction
): IWidgetState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, widgetType: type } = action;
      const definition = definitionForType(type);
      const inputs = defaultInputs(definition!.inputs);
      const { width, height } = defaultDimensions(definition);

      const widget = {
        x,
        y,
        width,
        height,
        type,
        inputs
      };

      return {
        ...state,
        widgets: [...state.widgets, widget],
        selectedIndex: state.widgets.length
      };
    }
    case MOVE_WIDGET: {
      const { dx, dy, index } = action;
      const newWidget = move(state.widgets[index], dx, dy);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case SELECT_WIDGET: {
      const { index } = action;
      return { ...state, selectedIndex: index };
    }
    case DELETE_WIDGET: {
      const widgets = removeAt(state.widgets, state.selectedIndex);
      return { ...state, widgets, selectedIndex: -1 };
    }
    case SET_INPUT: {
      const { path, value } = action;
      const index = state.selectedIndex;
      const newWidget = setInput(state.widgets[index], path, value);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case ADD_INPUT: {
      return state;
    }
    case DELETE_INPUT: {
      const { path } = action;
      const index = state.selectedIndex;
      const newWidget = deleteInput(state.widgets[index], path);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    default:
      return state;
  }
}
