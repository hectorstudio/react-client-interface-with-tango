import { DASHBOARDS_LOADED, DASHBOARD_RENAMED } from "../actionTypes";
import { DashboardAction } from "../actions";
import { Dashboards, Dashboard } from "../../types";

export interface DashboardsState {
  dashboards: Dashboards;
}

const initialState: DashboardsState = {
  dashboards: [],
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
