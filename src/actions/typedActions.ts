import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_FAILED,
  LOGOUT_SUCCESS
} from "./actionTypes";

interface IAction<T> {
  type: T;
}

export interface ILoginAction extends IAction<typeof LOGIN> {
  username: string;
  password: string;
}

export interface ILoginSuccessAction extends IAction<typeof LOGIN_SUCCESS> {
  username: string;
}

export interface ILoginFailedAction extends IAction<typeof LOGIN_FAILED> {}

export interface ILogoutAction extends IAction<typeof LOGOUT> {}

export interface ILogoutSuccessAction extends IAction<typeof LOGOUT_SUCCESS> {}
