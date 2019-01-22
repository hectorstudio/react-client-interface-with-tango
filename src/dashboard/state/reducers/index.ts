import { combineReducers } from "redux";

import user, { IUserState } from "../../../shared/user/state/reducer";
import ui, { IUIState } from "./ui";
import widgets, { IWidgetsState } from "./widgets";
import canvases, { ICanvasesState } from "./canvases";

export interface IRootState {
  ui: IUIState;
  canvases: ICanvasesState;
  widgets: IWidgetsState;
  user: IUserState;
}

export default combineReducers<IRootState>({
  ui,
  canvases,
  widgets,
  user
});
