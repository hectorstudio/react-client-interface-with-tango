import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS
} from "../actions/actionTypes";

import {
  ILoginAction,
  ILoginSuccessAction,
  ILoginFailedAction,
  ILogoutAction,
  ILogoutSuccessAction
} from "../actions/typedActions";

export interface IUserState {
  username?: string;
  awaitingResponse: boolean;
  loginFailed: boolean;
}

type UserAction =
  | ILoginAction
  | ILoginSuccessAction
  | ILoginFailedAction
  | ILogoutAction
  | ILogoutSuccessAction;

export default function user(
  state: IUserState = {
    awaitingResponse: false,
    loginFailed: false
  },
  action: UserAction
) {
  switch (action.type) {
    case LOGIN:
      return { ...state, awaitingResponse: true };
    case LOGIN_FAILED:
      return { ...state, awaitingResponse: false, loginFailed: true };
    case LOGIN_SUCCESS:
      return { ...state, username: action.username, awaitingResponse: false };
    case LOGOUT_SUCCESS:
      return { ...state, username: undefined };
    default:
      return state;
  }
}
