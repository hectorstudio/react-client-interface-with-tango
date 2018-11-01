import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  PRELOAD_USER_SUCCESS,
  PRELOAD_USER_FAILED,
  PRELOAD_USER
} from "./actionTypes";

import { Action } from "redux";

export interface ILoginAction extends Action {
  type: typeof LOGIN;
  username: string;
  password: string;
}

export interface ILoginSuccessAction extends Action {
  type: typeof LOGIN_SUCCESS;
  username: string;
}

export interface ILogoutAction extends Action {
  type: typeof LOGOUT;
}

export interface ILogoutSuccessAction extends Action {
  type: typeof LOGOUT_SUCCESS;
}

export interface ILoginFailedAction extends Action {
  type: typeof LOGIN_FAILED;
}

export interface IPreloadUserAction extends Action {
  type: typeof PRELOAD_USER;
}

export interface IPreloadUserSuccessAction extends Action {
  type: typeof PRELOAD_USER_SUCCESS;
  username: string;
}

export interface IPreloadUserFailedAction extends Action {
  type: typeof PRELOAD_USER_FAILED;
}
