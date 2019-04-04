import { take, fork, put, call } from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga";
import * as API from "../dashboardRepo";
import { dashboardsLoaded, dashboardRenamed, dashboardDeleted, dashboardCloned , dashboardLoaded, dashboardSaved} from "./actionCreators";
import {
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS,
} from "../../shared/user/state/actionTypes";
import {
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  LOAD_DASHBOARD,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_CLONED,
  SAVE_DASHBOARD,
  DASHBOARD_SAVED,
} from "./actionTypes";
export default function* sagas() {
  yield fork(createUserSaga());
  yield fork(loadDashboards);
  yield fork(renameDashboard);
  yield fork(deleteDashboard);
  yield fork(cloneDashboard);
  yield fork(loadDashboard);
  yield fork(saveDashboard);
}

function* loadDashboards() {
  while (true) {
    yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, DASHBOARD_RENAMED, DASHBOARD_DELETED, DASHBOARD_CLONED, DASHBOARD_SAVED]);
    const result = yield call(API.loadUserDashboards);
    yield put(dashboardsLoaded(result));
  }
}

function* renameDashboard() {
  while (true) {
    const {dashboard} = yield take(RENAME_DASHBOARD);
    const {id, name, renamed} = yield call(API.renameDashboard, dashboard.id, dashboard.name);
    yield put(dashboardRenamed({id, name}));
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
    const {id} = yield take(CLONE_DASHBOARD);
    const {id:newId, created} = yield call(API.cloneDashboard, id);
    yield put(dashboardCloned(newId));

  }
}
function* loadDashboard(){
  while (true) {
    const {id, type} = yield take([LOAD_DASHBOARD, DASHBOARD_CLONED, DASHBOARD_SAVED]);
    const { widgets, name, user } = yield call(API.load, id);
    const redirectRequest = type === DASHBOARD_CLONED || type === DASHBOARD_SAVED;
    yield put(dashboardLoaded(id, widgets, name, user, redirectRequest));
  }
}

function* saveDashboard(){
  while (true) {
    const {id, widgets, name} = yield take(SAVE_DASHBOARD);
    const { id:newId, created } = yield call(API.save, id, widgets, name);
    if (created){
      yield put(dashboardSaved(newId, created));
    }
    
  }
}