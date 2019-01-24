import { SELECT_WIDGET, SELECT_CANVAS, TOGGLE_MODE } from "../actionTypes";

export interface IUIState {
  mode: "edit" | "run";
  selectedWidget: number;
  selectedCanvas: number;
}

const initialState: IUIState = {
  mode: "edit",
  selectedWidget: -1,
  selectedCanvas: 0
};

export default function ui(state: IUIState = initialState, action) {
  switch (action.type) {
    case SELECT_WIDGET:
      return { ...state, selectedWidget: action.index };
    case SELECT_CANVAS:
      return { ...state, selectedCanvas: action.index };
    case TOGGLE_MODE:
      return { ...state, mode: state.mode === "edit" ? "run" : "edit" };
    default:
      return state;
  }
}
