import { IWidget, IWidgetDefinition } from "../../types";
import { ADD_WIDGET } from "../actionTypes";
import { defaultInputs } from "src/dashboard/utils";
import { Action } from "redux";

interface IAddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  definition: IWidgetDefinition;
}

type DashboardAction = IAddWidgetAction;

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
    default:
      return state;
  }
}
