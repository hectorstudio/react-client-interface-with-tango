import { SELECT_CANVAS, TOGGLE_MODE } from "../actionTypes";
import { DashboardAction } from "../actions";

export interface UIState {
  mode: "edit" | "run";
  selectedCanvas: string;
}

const initialState: UIState = {
  mode: "edit",
  selectedCanvas: "0"
};

export default function ui(
  state: UIState = initialState,
  action: DashboardAction
): UIState {
  switch (action.type) {
    case SELECT_CANVAS:
      return { ...state, selectedCanvas: action.id };
    case TOGGLE_MODE:
      return { ...state, mode: state.mode === "edit" ? "run" : "edit" };
    default:
      return state;
  }
}
