import { Action } from "redux";
import {
<<<<<<< HEAD
  UNDO,
  REDO,
=======
>>>>>>> origin/master
  ADD_WIDGET,
  MOVE_WIDGETS,
  SELECT_WIDGETS,
  DELETE_WIDGET,
  DELETE_INPUT,
  ADD_INPUT,
  SET_INPUT,
  RESIZE_WIDGET,
  SELECT_CANVAS,
  TOGGLE_MODE,
  DASHBOARD_LOADED,
  DASHBOARDS_LOADED,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_CLONED,
  DASHBOARD_SAVED,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
<<<<<<< HEAD
  REORDER_WIDGETS,
  SAVE_DASHBOARD,
  RENAME_DASHBOARD,
  CLONE_DASHBOARD,
  DUPLICATE_WIDGET,
  SHARE_DASHBOARD,
  DASHBOARD_SHARED,
  DASHBOARD_EDITED,
} from "./actionTypes";

import { IndexPath, Widget, Dashboard, Notification } from "../types";
import { SelectedDashboardState } from "./reducers/selectedDashboard";

export interface UndoAction extends Action {
  type: typeof UNDO;
}

export interface RedoAction extends Action {
  type: typeof REDO;
}

export interface DuplicateWidgetAction extends Action {
  type: typeof DUPLICATE_WIDGET;
}
=======
  SAVE_DASHBOARD,
} from "./actionTypes";

import { IndexPath, Widget, Dashboard, Notification } from "../types";
>>>>>>> origin/master

export interface AddWidgetAction extends Action {
  type: typeof ADD_WIDGET;
  x: number;
  y: number;
  widgetType: string;
  canvas: string;
}

export interface MoveWidgetsAction extends Action {
  type: typeof MOVE_WIDGETS;
  dx: number;
  dy: number;
  ids: string[];
}

export interface ResizeWidgetAction extends Action {
  type: typeof RESIZE_WIDGET;
  mx: number;
  my: number;
  dx: number;
  dy: number;
  id: string;
}

export interface SelectWidgetsAction extends Action {
  type: typeof SELECT_WIDGETS;
  ids: string[];
}

export interface DeleteWidgetAction extends Action {
  type: typeof DELETE_WIDGET;
}

export interface SetInputAction extends Action {
  type: typeof SET_INPUT;
  path: IndexPath;
  value: any;
}

export interface AddInputAction extends Action {
  type: typeof ADD_INPUT;
  path: IndexPath;
}

export interface DeleteInputAction extends Action {
  type: typeof DELETE_INPUT;
  path: IndexPath;
}

export interface SelectCanvasAction extends Action {
  type: typeof SELECT_CANVAS;
  id: string;
}

export interface ToggleModeAction extends Action {
  type: typeof TOGGLE_MODE;
}

export interface PreloadDashboardAction extends Action {
  type: typeof DASHBOARD_LOADED;
  id: string;
  widgets: Widget[];
  name: string;
  user: string;
}

export interface DashboardsLoadedAction extends Action {
  type: typeof DASHBOARDS_LOADED;
  dashboards: Dashboard[];
}

<<<<<<< HEAD
export interface RenameDashboardAction extends Action {
  type: typeof RENAME_DASHBOARD;
  id: string;
  name: string;
}

export interface DashboardRenamedAction extends Action {
  type: typeof DASHBOARD_RENAMED;
  id: string;
  name: string;
}

export interface DashboardDeletedAction extends Action {
=======
export interface DashboardRenamedAction extends Action{
  type: typeof DASHBOARD_RENAMED;
  id: string
  name: string;
}

export interface DashboardDeletedAction extends Action{
>>>>>>> origin/master
  type: typeof DASHBOARD_DELETED;
  id: string;
}

<<<<<<< HEAD
export interface CloneDashboardAction extends Action {
  type: typeof CLONE_DASHBOARD;
  id: string;
  newUser: string;
}
export interface DashboardClonedAction extends Action {
  type: typeof DASHBOARD_CLONED;
  id: string;
}
export interface ShareDashboardAction extends Action{
  type: typeof SHARE_DASHBOARD;
  id: string;
  group: string;
}

export interface DashboardSharedAction extends Action{
  type: typeof DASHBOARD_SHARED;
  id: string;
  group: string;
}

export interface DashboardLoadedAction extends Action {
=======
export interface DashboardClonedAction extends Action{
  type: typeof DASHBOARD_CLONED;
  id: string;
}

export interface DashboardLoadedAction extends Action{
>>>>>>> origin/master
  type: typeof DASHBOARD_LOADED;
  dashboard: Dashboard;
  widgets: Widget[];
}
<<<<<<< HEAD
export interface ReorderWidgetsAction extends Action{
  type: typeof REORDER_WIDGETS;
  widgets: Widget[];
}
=======

>>>>>>> origin/master
export interface SaveDashboardAction extends Action {
  type: typeof SAVE_DASHBOARD;
  id: string;
  name: string;
  widgets: Widget[];
}

<<<<<<< HEAD
export interface DashboardSavedAction extends Action {
=======
export interface DashboardSavedAction extends Action{
>>>>>>> origin/master
  type: typeof DASHBOARD_SAVED;
  id: string;
  created: boolean;
  name: string;
}

<<<<<<< HEAD
export interface ShowNotificationAction extends Action {
=======
export interface ShowNotificationAction extends Action{
>>>>>>> origin/master
  type: typeof SHOW_NOTIFICATION;
  notification: Notification;
}

<<<<<<< HEAD
export interface HideNotificationAction extends Action {
=======
export interface HideNotificationAction extends Action{
>>>>>>> origin/master
  type: typeof HIDE_NOTIFICATION;
  notification: Notification;
}

<<<<<<< HEAD
export interface dashboardEditedAction extends Action {
  type: typeof DASHBOARD_EDITED;
  dashboard: SelectedDashboardState

}

export type DashboardAction =
  | UndoAction
  | RedoAction
  | DuplicateWidgetAction
=======
export type DashboardAction =
>>>>>>> origin/master
  | AddWidgetAction
  | MoveWidgetsAction
  | ResizeWidgetAction
  | SelectWidgetsAction
  | DeleteWidgetAction
  | SetInputAction
  | AddInputAction
  | DeleteInputAction
  | SelectCanvasAction
  | ToggleModeAction
  | DashboardLoadedAction
  | DashboardsLoadedAction
<<<<<<< HEAD
  | RenameDashboardAction
  | DashboardRenamedAction
  | DashboardDeletedAction
  | DashboardClonedAction
  | ShareDashboardAction
  | DashboardSharedAction
  | DashboardSavedAction
  | ShowNotificationAction
  | HideNotificationAction
  | CloneDashboardAction
  | DashboardClonedAction
  | dashboardEditedAction;
=======
  | DashboardRenamedAction
  | DashboardDeletedAction
  | DashboardClonedAction
  | DashboardSavedAction
  | ShowNotificationAction
  | HideNotificationAction;
>>>>>>> origin/master
