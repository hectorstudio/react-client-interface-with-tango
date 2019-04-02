import { take, fork, put, call } from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga";
import * as API from "../dashboardRepo";
import { dashboardsLoaded, dashboardRenamed, dashboardDeleted, dashboardCloned , preloadDashboard} from "./actionCreators";
import {
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS,
} from "../../shared/user/state/actionTypes";
import {
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_CLONED,
} from "./actionTypes";
export default function* sagas() {
  yield fork(createUserSaga());
  yield fork(loadDashboards);
  yield fork(renameDashboard);
  yield fork(deleteDashboard);
  yield fork(cloneDashboard);
  yield fork(setCurrentDashboard);
}

function* loadDashboards() {
  while (true) {
    yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, DASHBOARD_RENAMED, DASHBOARD_DELETED, DASHBOARD_CLONED]);
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
function* deleteDashboard() {
  while (true) {
    const {id} = yield take(DELETE_DASHBOARD);
    const result = yield call(API.deleteDashboard, id);
    yield put(dashboardDeleted(result));
  }
}

function* cloneDashboard() {
  while (true) {
    const {id, newUser} = yield take(CLONE_DASHBOARD);
    const result = yield call(API.cloneDashboard, id, newUser);
    yield put(dashboardCloned(result));

  }
}
function* setCurrentDashboard(){
  while (true) {
    const {id} = yield take(DASHBOARD_CLONED);
    const { widgets, name, user } = yield call(API.load, id);
    yield put(preloadDashboard(id, widgets, (name || "Untitled Dashboard"), user));
  }
}
