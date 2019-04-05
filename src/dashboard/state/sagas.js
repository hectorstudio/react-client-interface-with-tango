import { take, fork, put, call, throttle } from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga";
import * as API from "../dashboardRepo";
import {
  dashboardsLoaded,
  dashboardRenamed,
  dashboardDeleted,
  dashboardCloned,
  dashboardLoaded,
  dashboardSaved,
  showNotification,
  hideNotification
} from "./actionCreators";
import {
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS
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
  DASHBOARD_CREATED
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
    yield take([
      PRELOAD_USER_SUCCESS,
      LOGIN_SUCCESS,
      DASHBOARD_RENAMED,
      DASHBOARD_DELETED,
      DASHBOARD_CLONED,
      DASHBOARD_SAVED
    ]);
    try {
      const result = yield call(API.loadUserDashboards);
      yield put(dashboardsLoaded(result));
    } catch (exception) {
      console.log(exception);
    }
  }
}

function* renameDashboard() {
  while (true) {
    const { dashboard } = yield take(RENAME_DASHBOARD);
    const { id } = yield call(
      API.renameDashboard,
      dashboard.id,
      dashboard.name
    );
    yield put(dashboardRenamed({ id, name: dashboard.name }));
    yield put(showNotification("INFO", DASHBOARD_RENAMED, "Dashboard renamed"));
    yield delay();
    yield put(hideNotification());
  }
}
function* deleteDashboard() {
  while (true) {
    const { id } = yield take(DELETE_DASHBOARD);
    const result = yield call(API.deleteDashboard, id);
    yield put(dashboardDeleted(result.id));
    yield put(showNotification("INFO", DASHBOARD_DELETED, "Dashboard deleted"));
    yield delay();
    yield put(hideNotification());
  }
}

function* cloneDashboard() {
  while (true) {
    const { id } = yield take(CLONE_DASHBOARD);
    const { id: newId, created } = yield call(API.cloneDashboard, id);
    yield put(dashboardCloned(newId));
    yield put(showNotification("INFO", DASHBOARD_CLONED, "Dashboard cloned"));
    yield delay();
    yield put(hideNotification());
  }
}
function* loadDashboard() {
  while (true) {
    const  payload  = yield take([
      LOAD_DASHBOARD,
      DASHBOARD_CLONED,
      DASHBOARD_SAVED
    ]);
    const { id, type } = payload;
    try {
      const { widgets, name, user, insertTime, updateTime } = yield call(
        API.load,
        id
      );
      //We want to redirect the dashboard component to the url with the dashboard id if the
      //dashboard was just created
      let created = false;
      if (type === DASHBOARD_SAVED){
        created = payload.created;
      }
      const redirect =
        type === DASHBOARD_CLONED || (type === DASHBOARD_SAVED && created);
      yield put(dashboardLoaded({id, name, user, redirect, insertTime, updateTime}, widgets));
    } catch (exception) {
      yield put(
        showNotification("ERROR", LOAD_DASHBOARD, "Dashboard not found")
      );
      yield delay();
      yield put(hideNotification());
    }
  }
}

function* saveDashboard() {
  while (true) {
    const { id, widgets, name } = yield take(SAVE_DASHBOARD);

    try {
      const { id: newId, created } = yield call(API.save, id, widgets, name || "");
      yield put(dashboardSaved(newId, created));
      if (created){
        yield put(
          showNotification("INFO", DASHBOARD_CREATED, "Dashboard created")
        );
        yield delay();
        yield put(hideNotification());
      }

    } catch (exception) {
      yield put(
        showNotification(
          "ERROR",
          SAVE_DASHBOARD,
          "You cannot edit this dashboad"
        )
      );
      yield delay();
      yield put(hideNotification());
    }
  }
}

function delay() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000);
  });
}
