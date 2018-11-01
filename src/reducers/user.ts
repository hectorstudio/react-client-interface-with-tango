import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  PRELOAD_USER_SUCCESS,
  PRELOAD_USER_FAILED,
  LOGOUT
} from "../actions/actionTypes";

import {
  ILoginAction,
  ILoginSuccessAction,
  ILoginFailedAction,
  ILogoutAction,
  ILogoutSuccessAction,
  IPreloadUserSuccessAction,
  IPreloadUserFailedAction
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
  | ILogoutSuccessAction
  | IPreloadUserSuccessAction
  | IPreloadUserFailedAction;

const initialState = {
  awaitingResponse: true,
  loginFailed: false
};

export default function user(
  state: IUserState = initialState,
  action: UserAction
) {
  switch (action.type) {
    case LOGIN:
      return { ...state, awaitingResponse: true };
    case LOGIN_FAILED:
      return { ...state, awaitingResponse: false, loginFailed: true };
    case LOGIN_SUCCESS:
    case PRELOAD_USER_SUCCESS:
      return { ...state, username: action.username, awaitingResponse: false };
    case PRELOAD_USER_FAILED:
      return { ...state, awaitingResponse: false };
    case LOGOUT:
      return { ...state, awaitingResponse: true };
    case LOGOUT_SUCCESS:
      return { ...initialState, awaitingResponse: false };
    default:
      return state;
  }
}
