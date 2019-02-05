import { SELECT_WIDGET, SELECT_CANVAS, TOGGLE_MODE } from "../actionTypes";
import { DashboardAction } from "../actions";

export interface UIState {
  mode: "edit" | "run";
  selectedWidget: string | null;
  selectedCanvas: string;
}

const initialState: UIState = {
  mode: "edit",
  selectedWidget: null,
  selectedCanvas: "0"
};

export default function ui(
  state: UIState = initialState,
  action: DashboardAction
) {
  switch (action.type) {
    case SELECT_WIDGET:
      return { ...state, selectedWidget: action.id };
    case SELECT_CANVAS:
      return { ...state, selectedCanvas: action.id };
    case TOGGLE_MODE:
      return { ...state, mode: state.mode === "edit" ? "run" : "edit" };
    default:
      return state;
  }
}
