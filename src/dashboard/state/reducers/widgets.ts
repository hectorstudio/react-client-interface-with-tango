import { IWidget } from "../../components/types";
import { ADD_WIDGET } from "../actionTypes";

export default function canvases(state: IWidget[] = [], action) {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, definition } = action;
      const widget = {
        x,
        y
      };
      return [...state, widget];
    }
    default:
      return state;
  }
}
