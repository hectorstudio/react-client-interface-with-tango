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
    const payload = yield take([
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
    const { type } = payload;
    if (type === DASHBOARD_DELETED) {
      yield put(
        showNotification("INFO", DASHBOARD_DELETED, "Dashboard deleted")
      );
      yield delay();
      yield put(hideNotification());
    } else if (type === DASHBOARD_CLONED) {
      yield put(showNotification("INFO", DASHBOARD_CLONED, "Dashboard cloned"));
      yield delay();
      yield put(hideNotification());
    } else if (type === DASHBOARD_SAVED) {
      const { created, reassigned } = payload;
      if (created) {
        yield put(
          showNotification("INFO", DASHBOARD_CREATED, "Dashboard created")
        );
        yield delay();
        yield put(hideNotification());
      }
      if (reassigned) {
        yield put(
          showNotification("INFO", DASHBOARD_CREATED, "Dashboard reassigned")
        );
        yield delay();
        yield put(hideNotification());
      }
    }
  }
}

function* renameDashboard() {
  while (true) {
    const { dashboard } = yield take(RENAME_DASHBOARD);
    console.log("REASSIGN DASHBOARD");
    console.log(dashboard);
    const { id, name } = yield call(
      API.renameDashboard,
      dashboard.id,
      dashboard.name
    );
    yield put(dashboardRenamed({ id, name }));
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
  }
}

function* cloneDashboard() {
  while (true) {
    const { id } = yield take(CLONE_DASHBOARD);
    const { id: newId, created } = yield call(API.cloneDashboard, id);
    yield put(dashboardCloned(newId));
  }
}
function* loadDashboard() {
  while (true) {
    const { id, type } = yield take([
      LOAD_DASHBOARD,
      DASHBOARD_CLONED,
      DASHBOARD_SAVED
    ]);
    try {
      const { widgets, name, user, created, reassigned } = yield call(
        API.load,
        id
      );
      //We want to redirect the dashboard component to the url with the dashboard id if the
      //dashboard was just created
      const redirect =
        type === DASHBOARD_CLONED || (type === DASHBOARD_SAVED && created);
      yield put(dashboardLoaded(id, widgets, name, user, redirect));
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
      const { id: newId, created, reassigned } = yield call(
        API.save,
        id,
        widgets,
        name
      );
      //we only notify about saved dashboard if it was either also created or reassigned
      if (created || reassigned) {
        yield put(dashboardSaved(newId, created, reassigned));
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
