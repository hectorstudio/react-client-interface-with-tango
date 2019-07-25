import { DASHBOARDS_LOADED } from "../actionTypes";
import { DashboardAction } from "../actions";
import { Dashboard } from "../../types";

export interface DashboardsState {
  dashboards: Dashboard[];
}

const initialState: DashboardsState = {
  dashboards: []
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
