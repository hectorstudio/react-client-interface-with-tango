import { DASHBOARDS_LOADED, DASHBOARD_SELECTED } from "../actionTypes";
import { DashboardAction } from "../actions";
import { Dashboards, Dashboard } from "src/dashboard/types";

export interface DashboardsState {
  dashboards: Dashboards;
  selectedDashboard: Dashboard;
}

const initialState: DashboardsState = {
  dashboards: [],
  selectedDashboard:  { id: "", name: "" },
};

export default function dashboard(
  state: DashboardsState = initialState,
  action: DashboardAction
) {
  switch (action.type) {
    case DASHBOARDS_LOADED:
      return { ...state, dashboards: action.dashboards };
    default:
      return state;
  }
}
