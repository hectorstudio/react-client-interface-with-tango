import { take, fork, call, put, race } from "redux-saga/effects";
import { delay } from "redux-saga";

import {
  preloadUserSuccess,
  preloadUserFailed,
  logoutSuccess,
  loginSuccess,
  loginFailed,
  extendLogin as extendLoginAction,
  extendLoginSuccess,
  extendLoginFailed
} from "../typedActionCreators";

import {
  PRELOAD_USER,
  LOGIN,
  LOGOUT,
  EXTEND_LOGIN,
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS
} from "../actionTypes";
import UserAPI from "../api/user";

function* preloadUser() {
  while (true) {
    yield take(PRELOAD_USER);
    const user = yield call(UserAPI.preloadUser);
    const action = user ? preloadUserSuccess(user) : preloadUserFailed();
    yield put(action);
  }
}

function* login() {
  while (true) {
    const { username, password } = yield take(LOGIN);
    const result = yield call(UserAPI.login, username, password);
    const action = result ? loginSuccess({ username }) : loginFailed();
    yield put(action);
  }
}

function* logout() {
  while (true) {
    yield take(LOGOUT);
    yield call(UserAPI.logout);
    yield put(logoutSuccess());
  }
}

function* extendLogin() {
  while (true) {
    yield take(EXTEND_LOGIN);
    const result = yield call(UserAPI.extendLogin);
    const action = result ? extendLoginSuccess() : extendLoginFailed();
    yield put(action);
  }
}

function* periodicallyExtendLogin() {
  const interval = 60 * 1000; // One minute

  while (true) {
    yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS]);

    while (true) {
      const { wait, logout } = yield race({
        wait: call(delay, interval),
        logout: take(LOGOUT_SUCCESS)
      });

      if (logout) {
        break;
      }

      yield put(extendLoginAction());
    }
  }
}

export default function* user() {
  yield fork(preloadUser);
  yield fork(login);
  yield fork(logout);
  yield fork(extendLogin);
  yield fork(periodicallyExtendLogin);
}
