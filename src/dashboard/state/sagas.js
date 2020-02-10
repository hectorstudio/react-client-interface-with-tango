<<<<<<< HEAD
import { take, fork, put, call, select, race, delay } from "redux-saga/effects";
=======
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
>>>>>>> origin/master

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
<<<<<<< HEAD
  dashboardShared,
  saveDashboard as saveDashboardAction,
  dashboardEdited
=======
  saveDashboard as saveDashboardAction
>>>>>>> origin/master
} from "./actionCreators";
import {
  PRELOAD_USER_SUCCESS,
  LOGIN_SUCCESS
} from "../../shared/user/state/actionTypes";
import {
<<<<<<< HEAD
  move,
  setInput,
  deleteInput,
  addInput,
  defaultDimensions,
  nestedDefault,
  validate,
  resize,
  nextId,
  pushToHistory,
  undo,
  redo,
  nextOrderIndex,
  reorderIndex
} from "./reducers/selectedDashboard/lib.ts";
import {
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  SHARE_DASHBOARD,
  LOAD_DASHBOARD,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_SHARED,
=======
  RENAME_DASHBOARD,
  DELETE_DASHBOARD,
  CLONE_DASHBOARD,
  LOAD_DASHBOARD,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
>>>>>>> origin/master
  DASHBOARD_CLONED,
  SAVE_DASHBOARD,
  DASHBOARD_SAVED,
  DASHBOARD_CREATED,
<<<<<<< HEAD
  SHOW_NOTIFICATION,
  ADD_WIDGET,
  MOVE_WIDGETS,
  RESIZE_WIDGET,
  DELETE_WIDGET,
  UNDO,
  REDO,
  DUPLICATE_WIDGET,
  SET_INPUT,
  DELETE_INPUT,
  ADD_INPUT,
  REORDER_WIDGETS
} from "./actionTypes";
import { getWidgets, getSelectedDashboard } from "./selectors";
import { definitionForType, definitionForWidget } from "../widgets";
import { defaultInputs } from "../utils";
=======
  SHOW_NOTIFICATION
} from "./actionTypes";
import { getWidgets } from "./selectors";
>>>>>>> origin/master

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
<<<<<<< HEAD
  yield fork(notifyOnShare);
  yield fork(hideNotificationAfterDelay);
  yield fork(shareDashboard);
  yield fork(editWidget);
}

function* editWidget() {
  while (true) {
    const { type, ...payload } = yield take([
      ADD_WIDGET,
      MOVE_WIDGETS,
      RESIZE_WIDGET,
      DELETE_WIDGET,
      UNDO,
      REDO,
      DUPLICATE_WIDGET,
      SET_INPUT,
      DELETE_INPUT,
      REORDER_WIDGETS,
      ADD_INPUT
    ]);
    const state = yield select(getSelectedDashboard);
    let newState = {};
    switch (type) {
      case UNDO:
        {
          const { history: oldHistory, widgets: oldWidgets } = state;
          const { history, widgets } = undo(oldHistory, oldWidgets);
          newState = {
            ...state,
            widgets,
            history,
            selectedIds: []
          };
        }
        break;
      case REDO: {
        const { history: oldHistory, widgets: oldWidgets } = state;
        const { history, widgets } = redo(oldHistory, oldWidgets);
        newState = {
          ...state,
          widgets,
          history,
          selectedIds: []
        };
        break;
      }
      case ADD_WIDGET: {
        const { x, y, canvas, widgetType: type } = payload;
        const definition = definitionForType(type);
        const inputs = defaultInputs(definition.inputs);
        const { width, height } = defaultDimensions(definition);
        const id = nextId(state.widgets);

        const widget = validate({
          id,
          x,
          y,
          canvas,
          width,
          height,
          type,
          inputs,
          valid: false,
          order: nextOrderIndex(state.widgets)
        });
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = {
          ...state,
          widgets: { ...state.widgets, [id]: widget },
          selectedIds: [id],
          history
        };
        break;
      }
      case MOVE_WIDGETS: {
        const { dx, dy, ids } = payload;

        const moved = ids
          .map(id => state.widgets[id])
          .map(widget => move(widget, dx, dy))
          .reduce((accum, widget) => {
            return { ...accum, [widget.id]: widget };
          }, {});

        const widgets = { ...state.widgets, ...moved };
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };
        break;
      }
      case RESIZE_WIDGET: {
        const { dx, dy, mx, my, id } = payload;
        const newWidget = resize(state.widgets[id], mx, my, dx, dy);
        const widgets = { ...state.widgets, [id]: newWidget };
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };
        break;
      }
      case DUPLICATE_WIDGET: {
        let newId = parseInt(nextId(state.widgets));
        let newOrderIndex = nextOrderIndex(state.widgets);
        const newWidgets = Object.assign({}, state.widgets);
        const newIds = [];
        state.selectedIds.forEach(id => {
          const newWidget = Object.assign({}, state.widgets[id]);
          newWidget.x += 1;
          newWidget.y += 1;
          newWidget.id = newId.toString();
          newWidget.order = newOrderIndex;
          newWidgets[newId.toString()] = newWidget;
          newIds.push(newId.toString());
          newId++;
          newOrderIndex++;
        });
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = {
          ...state,
          widgets: newWidgets,
          selectedIds: newIds,
          history
        };
        break;
      }
      case DELETE_WIDGET: {
        const widgets = Object.keys(state.widgets)
          .filter(id => state.selectedIds.indexOf(id) === -1)
          .reduce((accum, id) => {
            return { ...accum, [id]: state.widgets[id] };
          }, {});
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = {
          ...state,
          widgets: reorderIndex(widgets),
          selectedIds: [],
          history
        };
        break;
      }
      case SET_INPUT: {
        const { path, value } = payload;
        newState = state;
        const newWidgets = {};
        state.selectedIds.forEach(id => {
          const newWidget = validate(setInput(state.widgets[id], path, value));
          newWidgets[id] = newWidget;
        });
        const widgets = { ...state.widgets, ...newWidgets };
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };
        break;
      }
      case ADD_INPUT: {
        newState = state;
        const { path } = payload;
        const newWidgets = {};
        state.selectedIds.forEach(id => {
          const oldWidget = state.widgets[id];
          const definition = definitionForWidget(oldWidget);
          const value = nestedDefault(definition, path);
          const newWidget = validate(addInput(state.widgets[id], [...path, -1], value));
          newWidgets[id] = newWidget;
        });
        const widgets = { ...state.widgets, ...newWidgets };
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };
        break;
      }
      case DELETE_INPUT: {
        newState = state;
        const { path } = payload;
        const newWidgets = {};
        state.selectedIds.forEach(id => {
            const newWidget = validate(deleteInput(state.widgets[id], path));
            newWidgets[id] = newWidget;
        });
        const widgets = { ...state.widgets, ...newWidgets };
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };
        break;
      }
      case REORDER_WIDGETS: {
        const { widgets } = payload;
        const { history: oldHistory, widgets: oldWidgets } = state;
        const history = pushToHistory(oldHistory, oldWidgets);
        newState = { ...state, widgets, history };

        newState = state;
        break;
      }
      default: {
        newState = state;
      }
    }
    yield put(dashboardEdited(newState));
    const widgetArray = Object.keys(newState.widgets).map(
      key => newState.widgets[key]
    );
    yield put(saveDashboardAction(newState.id, newState.name, widgetArray));
  }
=======
  yield fork(hideNotificationAfterDelay);
>>>>>>> origin/master
}

function* loadDashboards() {
  while (true) {
<<<<<<< HEAD
    const payload = yield take([
=======
    yield take([
>>>>>>> origin/master
      PRELOAD_USER_SUCCESS,
      LOGIN_SUCCESS,
      DASHBOARD_RENAMED,
      DASHBOARD_DELETED,
      DASHBOARD_CLONED,
      DASHBOARD_SAVED
    ]);
<<<<<<< HEAD
    //in the case of DASHBOARD_SAVED, only load the dashboard from the db if it was created.
    //Loading the dashboard on every save becomes very sluggish, e.g. when trying to type text
    //in a widget label
    if (payload.type !== DASHBOARD_SAVED || payload.created) {
      try {
        const result = yield call(API.loadUserDashboards);
        yield put(dashboardsLoaded(result));
      } catch (exception) {
        console.log(exception);
      }
=======
    try {
      const result = yield call(API.loadUserDashboards);
      yield put(dashboardsLoaded(result));
    } catch (exception) {
      console.log(exception);
>>>>>>> origin/master
    }
  }
}

<<<<<<< HEAD
function* shareDashboard() {
  while (true) {
    const { id, group } = yield take(SHARE_DASHBOARD);
    yield call(API.shareDashboard, id, group);
    yield put(dashboardShared(id, group));
  }
}

=======
>>>>>>> origin/master
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
<<<<<<< HEAD
    //In the case of dashboard_saved, only load dashboard if the dashboard was just created (we need the ID)
    let created = false;
    if (type === DASHBOARD_SAVED) {
      created = payload.created;
    }
    if (!(type === DASHBOARD_SAVED && !created)) {
      try {
        const {
          widgets,
          name,
          user,
          insertTime,
          updateTime,
          group,
          lastUpdatedBy
        } = yield call(API.load, id);
        yield put(
          dashboardLoaded(
            {
              id,
              name,
              user,
              insertTime,
              updateTime,
              group,
              lastUpdatedBy
            },
            widgets
          )
        );
      } catch (exception) {
        yield put(
          showNotification("ERROR", LOAD_DASHBOARD, "Dashboard not found")
        );
      }
=======
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
>>>>>>> origin/master
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
<<<<<<< HEAD
      yield put(dashboardSaved(newId, created, name));
    } catch (exception) {
=======
      yield put(dashboardSaved(newId, created, name)); // Should take name from response, but API doesn't support it at time of writing
    } catch (exception) {
      // Replace with failure action and write saga that reacts on it and puts a notification action
>>>>>>> origin/master
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

<<<<<<< HEAD
function* notifyOnShare() {
  while (true) {
    const { group } = yield take(DASHBOARD_SHARED);
    const msg = group ? "Dashboard shared with " + group : "Dashboard unshared";
    yield put(showNotification("INFO", DASHBOARD_SHARED, msg));
  }
}

=======
>>>>>>> origin/master
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
<<<<<<< HEAD

=======
    
>>>>>>> origin/master
    yield put(hideNotification());
  }
}
