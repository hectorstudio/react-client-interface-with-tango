import { IWidget } from "../../types";
import { ADD_WIDGET, MOVE_WIDGET, SELECT_WIDGET } from "../actionTypes";
import { defaultInputs } from "src/dashboard/utils";
import { DashboardAction } from "../actions";

function replaceAt<T>(arr: T[], index: number, repl: T) {
  const copy = arr.concat();
  copy.splice(index, 1, repl);
  return copy;
}

function move(widget: IWidget, dx: number, dy: number) {
  const { x, y } = widget;
  return { ...widget, x: x + dx, y: y + dy };
}

interface IWidgetState {
  selectedIndex: number;
  widgets: IWidget[];
}

const initialState = {
  selectedIndex: -1,
  widgets: []
};

export default function canvases(
  state: IWidgetState = initialState,
  action: DashboardAction
): IWidgetState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, definition } = action;
      const { type } = definition;
      const inputs = defaultInputs(definition.inputs);
      const widget = {
        x,
        y,
        width: 100, // ??
        height: 100, // ??
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
      const { index, dx, dy } = action;
      const oldWidget = state.widgets[index];
      const newWidget = move(oldWidget, dx, dy);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case SELECT_WIDGET: {
      const { index } = action;
      return { ...state, selectedIndex: index };
    }
    default:
      return state;
  }
}
