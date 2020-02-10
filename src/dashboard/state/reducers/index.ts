import { combineReducers } from "redux";

<<<<<<< HEAD
import user, {
  IUserState as UserState
} from "../../../shared/user/state/reducer";
import ui, { UIState } from "./ui";
import selectedDashboard, {
  SelectedDashboardState
} from "./selectedDashboard/index";
=======
import user, { IUserState as UserState } from "../../../shared/user/state/reducer";
import ui, { UIState } from "./ui";
import selectedDashboard, { SelectedDashboardState } from "./selectedDashboard/index";
>>>>>>> origin/master
import canvases, { CanvasesState } from "./canvases";
import dashboards, { DashboardsState } from "./dashboards";
import notifications, { NotificationsState } from "./notifications";

<<<<<<< HEAD
=======

>>>>>>> origin/master
export interface RootState {
  ui: UIState;
  canvases: CanvasesState;
  selectedDashboard: SelectedDashboardState;
  user: UserState;
  dashboards: DashboardsState;
  notifications: NotificationsState;
}

export default combineReducers<RootState>({
  ui,
  canvases,
  selectedDashboard,
  user,
  dashboards,
  notifications
});
