import {
  IPreloadUserAction,
  IPreloadUserSuccessAction,
  IPreloadUserFailedAction,
  ILogoutAction,
  ILogoutSuccessAction,
  ILoginSuccessAction,
  ILoginFailedAction,
  IExtendLoginAction,
  IExtendLoginSuccessAction,
  IExtendLoginFailedAction
} from "./typedActions";

import {
  PRELOAD_USER,
  PRELOAD_USER_FAILED,
  PRELOAD_USER_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  EXTEND_LOGIN,
  EXTEND_LOGIN_SUCCESS,
  EXTEND_LOGIN_FAILED
} from "./actionTypes";

interface IUser {
  username: string;
}

export function preloadUserSuccess(user: IUser): IPreloadUserSuccessAction {
  const username = user.username;
  return { type: PRELOAD_USER_SUCCESS, username };
}

export function login(username: string, password: string) {
  return { type: LOGIN, username, password };
}

export function loginSuccess(user: IUser): ILoginSuccessAction {
  const username = user.username;
  return { type: LOGIN_SUCCESS, username };
}

export function loginFailed(): ILoginFailedAction {
  return { type: LOGIN_FAILED };
}

export function preloadUser(): IPreloadUserAction {
  return { type: PRELOAD_USER };
}

export function preloadUserFailed(): IPreloadUserFailedAction {
  return { type: PRELOAD_USER_FAILED };
}

export function logout(): ILogoutAction {
  return { type: LOGOUT };
}

export function logoutSuccess(): ILogoutSuccessAction {
  return { type: LOGOUT_SUCCESS };
}

export function extendLogin(): IExtendLoginAction {
  return { type: EXTEND_LOGIN };
}

export function extendLoginSuccess(): IExtendLoginSuccessAction {
  return { type: EXTEND_LOGIN_SUCCESS };
}

export function extendLoginFailed(): IExtendLoginFailedAction {
  return { type: EXTEND_LOGIN_FAILED };
}
