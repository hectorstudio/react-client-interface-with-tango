import { combineReducers } from "redux";

import user, { IUserState as UserState } from "../../../shared/user/state/reducer";
import ui, { UIState } from "./ui";
import widgets, { WidgetsState } from "./widgets";
import canvases, { CanvasesState } from "./canvases";
import dashboards, { DashboardsState } from "./dashboards";

export interface RootState {
  ui: UIState;
  canvases: CanvasesState;
  widgets: WidgetsState;
  user: UserState;
  dashboards: DashboardsState;
}

export default combineReducers<RootState>({
  ui,
  canvases,
  widgets,
  user,
  dashboards
});
