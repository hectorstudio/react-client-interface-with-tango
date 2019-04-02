import { take, fork, put, call } from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga";
import * as API from "../dashboardRepo";
import { dashboardsLoaded, dashboardRenamed, dashboardDeleted, dashboardCloned } from "./actionCreators";
import {
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS,
} from "../../shared/user/state/actionTypes";
import {
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  DASHBOARD_RENAMED,
} from "./actionTypes";
export default function* sagas() {
  yield fork(createUserSaga());
  yield fork(loadDashboards);
  yield fork(renameDashboard);
  yield fork(deleteDashboard);
  yield fork(cloneDashboard);
}

function* loadDashboards() {
  while (true) {
    yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, DASHBOARD_RENAMED]);
    const result = yield call(API.loadUserDashboards);
    yield put(dashboardsLoaded(result));
  }
}

function* renameDashboard() {
  while (true) {
    const {dashboard} = yield take(RENAME_DASHBOARD);
    const result = yield call(API.renameDashboard, dashboard.id, dashboard.name);
    yield put(dashboardRenamed(result));
  }
}
function* deleteDashboard() {//WRONG, USE RENAME AS TEMPLATE
  while (true) {
    yield take(DELETE_DASHBOARD);
    const result = yield call(API.deleteDashboard);
    yield put(dashboardDeleted(result));
  }
}

function* cloneDashboard() {//WRONG, USE RENAME AS TEMPLATE
  while (true) {
    yield take(CLONE_DASHBOARD);
    const result = yield call(API.cloneDashboard);
    yield put(dashboardCloned(result));
  }
}
