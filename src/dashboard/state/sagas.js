import {
  take,
  fork,
  put,
  call,
  select,
  race,
  delay
} from "redux-saga/effects";
// import delay from "@redux-saga/delay-p";

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
  hideNotification,
  saveDashboard as saveDashboardAction
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
  DASHBOARD_CREATED,
  SHOW_NOTIFICATION
} from "./actionTypes";
import { getWidgets } from "./selectors";

export default function* sagas() {
  yield fork(createUserSaga());
  yield fork(loadDashboards);
  yield fork(renameDashboard);
  yield fork(deleteDashboard);
  yield fork(cloneDashboard);
  yield fork(loadDashboard);
  yield fork(saveDashboard);
  yield fork(notifyOnSave);
  yield fork(notifyOnClone);
  yield fork(notifyOnDelete);
  yield fork(hideNotificationAfterDelay);
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
    const { id, name } = yield take(RENAME_DASHBOARD);

    if (id === "") {
      const widgets = yield select(getWidgets);
      yield put(saveDashboardAction(id, name, widgets));
    } else {
      try {
        yield call(API.renameDashboard, id, name);
        yield put(dashboardRenamed(id, name));
      } catch {}
    }
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
    const { id: newId } = yield call(API.cloneDashboard, id);
    yield put(dashboardCloned(newId));
  }
}

function* loadDashboard() {
  while (true) {
    const payload = yield take([
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
      if (type === DASHBOARD_SAVED) {
        created = payload.created;
      }
      const redirect =
        type === DASHBOARD_CLONED || (type === DASHBOARD_SAVED && created);
      yield put(
        dashboardLoaded(
          { id, name, user, redirect, insertTime, updateTime },
          widgets
        )
      );
    } catch (exception) {
      // Replace with failure action and write saga that reacts on it and puts a notification action
      yield put(
        showNotification("ERROR", LOAD_DASHBOARD, "Dashboard not found")
      );
    }
  }
}

function* saveDashboard() {
  while (true) {
    const { id, widgets, name } = yield take(SAVE_DASHBOARD);

    try {
      const { id: newId, created } = yield call(
        API.save,
        id,
        widgets,
        name || ""
      );
      yield put(dashboardSaved(newId, created, name)); // Should take name from response, but API doesn't support it at time of writing
    } catch (exception) {
      // Replace with failure action and write saga that reacts on it and puts a notification action
      yield put(
        showNotification(
          "ERROR",
          SAVE_DASHBOARD,
          "You cannot edit this dashboard"
        )
      );
    }
  }
}

function* notifyOnSave() {
  while (true) {
    const { created } = yield take(DASHBOARD_SAVED);
    if (created) {
      yield put(
        showNotification("INFO", DASHBOARD_CREATED, "Dashboard created")
      );
    }
  }
}

function* notifyOnClone() {
  while (true) {
    yield take(DASHBOARD_CLONED);
    yield put(showNotification("INFO", DASHBOARD_CLONED, "Dashboard cloned"));
  }
}

function* notifyOnDelete() {
  yield take(DASHBOARD_DELETED);
  yield put(showNotification("INFO", DASHBOARD_DELETED, "Dashboard deleted"));
}

// Can possibly be simplified using debounce()
function* hideNotificationAfterDelay() {
  while (true) {
    yield take(SHOW_NOTIFICATION);

    while (true) {
      const { timePassed } = yield race({
        newNotification: take(SHOW_NOTIFICATION),
        timePassed: delay(2000)
      });

      if (timePassed) {
        break;
      }
    }
    
    yield put(hideNotification());
  }
}
