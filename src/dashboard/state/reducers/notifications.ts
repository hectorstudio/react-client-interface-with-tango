import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "../actionTypes";
import { Notification } from "../../types";
import { DashboardAction } from "../actions";

export interface NotificationsState {
  notification: Notification;
}

const initialState: NotificationsState = {
  notification: { level: "", sourceAction: "", msg: "" }
};

export default function notifications(
  state: NotificationsState = initialState,
  action: DashboardAction
): NotificationsState {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...state, notification: action.notification };
    case HIDE_NOTIFICATION:
      return {
        ...state,
        notification: { level: "", sourceAction: "", msg: "" }
      };
    default:
      return state;
  }
}
