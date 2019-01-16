import { SELECT_WIDGET, SELECT_CANVAS } from "../actionTypes";

interface IUIState {
  selectedWidget: number;
  selectedCanvas: number;
}

const initialState = {
  selectedWidget: -1,
  selectedCanvas: 0
};

export default function ui(state: IUIState = initialState, action) {
  switch (action.type) {
    case SELECT_WIDGET:
      return { ...state, selectedWidget: action.index };
    case SELECT_CANVAS:
      return { ...state, selectedCanvas: action.index };
    default:
      return state;
  }
}
