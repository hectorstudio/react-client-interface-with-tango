import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  PRELOAD_USER_SUCCESS,
  PRELOAD_USER_FAILED,
  LOGOUT,
  OPEN_LOGIN_DIALOG,
  CLOSE_LOGIN_DIALOG
} from "./actionTypes";

import {
  ILoginAction,
  ILoginSuccessAction,
  ILoginFailedAction,
  ILogoutAction,
  ILogoutSuccessAction,
  IPreloadUserSuccessAction,
  IPreloadUserFailedAction,
  IOpenLoginDialogAction,
  ICloseLoginDialogAction
} from "./actions";

export interface IUserState {
  username?: string;
  awaitingResponse: boolean;
  loginFailed: boolean;
  loginDialogVisible: boolean;
}

type UserAction =
  | ILoginAction
  | ILoginSuccessAction
  | ILoginFailedAction
  | ILogoutAction
  | ILogoutSuccessAction
  | IPreloadUserSuccessAction
  | IPreloadUserFailedAction
  | IOpenLoginDialogAction
  | ICloseLoginDialogAction;

const initialState = {
  awaitingResponse: false,
  loginFailed: false,
  loginDialogVisible: false
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
      return {
        ...state,
        username: action.username,
        loginDialogVisible: false,
        awaitingResponse: false
      };
    case PRELOAD_USER_SUCCESS:
      return { ...state, username: action.username, awaitingResponse: false };
    case PRELOAD_USER_FAILED:
      return { ...state, awaitingResponse: false };
    case LOGOUT:
      return { ...state, awaitingResponse: true };
    case LOGOUT_SUCCESS:
      return { ...initialState, awaitingResponse: false };
    case OPEN_LOGIN_DIALOG:
      return { ...initialState, loginDialogVisible: true };
    case CLOSE_LOGIN_DIALOG:
      return { ...initialState, loginDialogVisible: false };
    default:
      return state;
  }
}
