import { IWidget, IWidgetDefinition } from "../../types";
import { ADD_WIDGET, MOVE_WIDGET } from "../actionTypes";
import { defaultInputs } from "src/dashboard/utils";
import { Action } from "redux";

interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  definition: IWidgetDefinition;
}

interface IMoveWidgetAction extends Action {
  type: typeof MOVE_WIDGET;
  index: number;
  dx: number;
  dy: number;
}

type DashboardAction = IAddWidgetAction | IMoveWidgetAction;

function withReplacementAt(arr, index, repl) {
  const copy = arr.concat();
  copy.splice(index, 1, repl);
  return copy;
}

export default function canvases(
  state: IWidget[] = [],
  action: DashboardAction
) {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, definition } = action;
      const { type } = definition;
      const inputs = defaultInputs(definition.inputs);
      const widget = {
        x,
        y,
        type,
        inputs
      };
      return [...state, widget];
    }
    case MOVE_WIDGET: {
      const { index, dx, dy } = action;
      const oldWidget = state[index];
      const x = oldWidget.x + dx;
      const y = oldWidget.y + dy;
      const newWidget = { ...oldWidget, x, y };
      return withReplacementAt(state, index, newWidget);
    }
    default:
      return state;
  }
}
