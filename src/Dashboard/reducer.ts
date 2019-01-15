import { createStore, combineReducers } from "redux";

interface IWidget {}

interface ICanvas {
  id: number;
  name: string;
  widgets: IWidget[];
}

interface ICanvasState {
  [id: number]: ICanvas;
}

interface IRootState {
  canvases: ICanvasState;
  ui: IUIState;
}

interface IUIState {
  mode: "edit" | "run";
  selectedCanvasIndex: number; // rename, also -> string?
  selectedWidgetIndex: number; // rename, also -> string?
}

function ui(state: IUIState, action: any) {
  return state;
}

function canvases(state: ICanvasState, action: any) {
  return state;
}

const rootReducer = combineReducers<IRootState>({
  ui,
  canvases
});

export const store = createStore(rootReducer);
