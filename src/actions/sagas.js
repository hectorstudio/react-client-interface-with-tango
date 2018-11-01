import { take, fork, call, put } from "redux-saga/effects";

import {
  preloadUserSuccess,
  preloadUserFailed,
  logoutSuccess,
  loginSuccess,
  loginFailed
} from "./typedActionCreators";

import { PRELOAD_USER, LOGIN, LOGOUT } from "./actionTypes";
import UserAPI from './api/user';

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
    const {username, password} = yield take(LOGIN);
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

export default function* root() {
  yield fork(preloadUser);
  yield fork(login);
  yield fork(logout);
}
