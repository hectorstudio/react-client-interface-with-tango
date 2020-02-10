<<<<<<< HEAD
import { Widget, Dashboard, DashboardEditHistory } from "../../../types";

import {
  SELECT_WIDGETS,
  DASHBOARD_LOADED,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
  DASHBOARD_SHARED,
  DASHBOARD_EDITED
} from "../../actionTypes";

import { DashboardAction } from "../../actions";
import { validate } from "./lib";

import { definitionForWidget } from "../../../widgets";
=======
import { Widget, Dashboard } from "../../../types";

import {
  ADD_WIDGET,
  DELETE_WIDGET,
  SET_INPUT,
  DELETE_INPUT,
  ADD_INPUT,
  RESIZE_WIDGET,
  SELECT_WIDGETS,
  MOVE_WIDGETS,
  DASHBOARD_LOADED,
  DASHBOARD_RENAMED,
  DASHBOARD_DELETED,
} from "../../actionTypes";

import { DashboardAction } from "../../actions";
import {
  move,
  setInput,
  deleteInput,
  addInput,
  defaultDimensions,
  nestedDefault,
  validate,
  resize,
  nextId
} from "./lib";

import { definitionForType, definitionForWidget } from "../../../widgets";
import { defaultInputs } from "../../../utils";
>>>>>>> origin/master

export interface SelectedDashboardState extends Dashboard {
  widgets: Record<string, Widget>;
  selectedIds: string[];
<<<<<<< HEAD
  history: DashboardEditHistory;
=======
>>>>>>> origin/master
}

const initialState = {
  selectedId: null,
  selectedIds: [],
  widgets: {},
  id: "",
  name: "Untitled dashboard",
  user: "",
<<<<<<< HEAD
  group: "",
  lastUpdatedBy: "",
  insertTime: null,
  updateTime: null,
  history: {
    undoActions: [],
    redoActions: [],
    undoIndex: 0,
    redoIndex: 0,
    undoLength: 0,
    redoLength: 0
  }
=======
  redirect: false,
  insertTime: null,
  updateTime: null,
>>>>>>> origin/master
};

export default function canvases(
  state: SelectedDashboardState = initialState,
  action: DashboardAction
): SelectedDashboardState {
  switch (action.type) {
<<<<<<< HEAD
=======
    case ADD_WIDGET: {
      const { x, y, canvas, widgetType: type } = action;
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
        valid: false
      });

      return {
        ...state,
        widgets: { ...state.widgets, [id]: widget },
        selectedIds: [id]
      };
    }
    case MOVE_WIDGETS: {
      const { dx, dy, ids } = action;

      const moved = ids
        .map(id => state.widgets[id])
        .map(widget => move(widget, dx, dy))
        .reduce((accum, widget) => {
          return { ...accum, [widget.id]: widget };
        }, {});

      const widgets = { ...state.widgets, ...moved };
      return { ...state, widgets };
    }
    case RESIZE_WIDGET: {
      const { dx, dy, mx, my, id } = action;
      const newWidget = resize(state.widgets[id], mx, my, dx, dy);
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
>>>>>>> origin/master
    case SELECT_WIDGETS: {
      const { ids } = action;
      return { ...state, selectedIds: ids };
    }
<<<<<<< HEAD

    case DASHBOARD_EDITED: {
      const { dashboard } = action;
      return { ...dashboard };
    }
    case DASHBOARD_SHARED: {
      const { id, group } = action;
      if (id === state.id) {
        return {
          ...state,
          group
        };
      } else {
        return state;
      }
    }
    case DASHBOARD_LOADED: {
      const { widgets, dashboard } = action;
      const {
        id,
        name,
        user,
        insertTime,
        updateTime,
        group,
        lastUpdatedBy
      } = dashboard;

      //in case the widget is missing fields present in its definition, add those with their default values
      widgets.forEach(widget => {
        const definition = definitionForWidget(widget);
        for (const key of Object.keys(definition.inputs)) {
          if (!(key in widget.inputs) && "default" in definition.inputs[key]) {
            widget.inputs[key] = definition.inputs[key].default;
          }
        }
      });

=======
    case DELETE_WIDGET: {
      const widgets = Object.keys(state.widgets)
        .filter(id => state.selectedIds.indexOf(id) === -1)
        .reduce((accum, id) => {
          return { ...accum, [id]: state.widgets[id] };
        }, {});
      return { ...state, widgets, selectedIds: [] };
    }
    case SET_INPUT: {
      const { path, value } = action;
      const id = state.selectedIds[0];
      if (id == null) {
        return state;
      }
      const newWidget = validate(setInput(state.widgets[id], path, value));
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case ADD_INPUT: {
      const { path } = action;
      const id = state.selectedIds[0];
      if (id == null) {
        return state;
      }
      const oldWidget = state.widgets[id];
      const definition = definitionForWidget(oldWidget);
      const value = nestedDefault(definition, path);
      const newWidget = validate(
        addInput(state.widgets[id], [...path, -1], value)
      );
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case DELETE_INPUT: {
      const { path } = action;
      const id = state.selectedIds[0];
      if (id == null) {
        return state;
      }
      const newWidget = validate(deleteInput(state.widgets[id], path));
      const widgets = { ...state.widgets, [id]: newWidget };
      return { ...state, widgets };
    }
    case DASHBOARD_LOADED: {
      const { widgets, dashboard} = action;
      const {id, name, user, redirect, insertTime, updateTime} = dashboard;
>>>>>>> origin/master
      const newWidgets = widgets.reduce((accum, widget) => {
        return { ...accum, [widget.id]: validate(widget) };
      }, {});

<<<<<<< HEAD
      return {
        ...state,
        widgets: newWidgets,
        id,
        name,
        user,
        insertTime,
        updateTime,
        group,
        lastUpdatedBy,
        selectedIds: []
      };
    }
    case DASHBOARD_RENAMED: {
      const { name } = action;
      return { ...state, name };
    }
    case DASHBOARD_DELETED: {
      const { id } = action;
      if (id === state.id) {
        // Clear the selectedDashboard state if we deleted the selected dashboard
        return {
          ...state,
          id: "",
          name: "",
          widgets: {},
          selectedIds: [],
        };
      } else {
=======
      return { ...state, widgets: newWidgets, id, name, user, redirect, insertTime, updateTime };
    }
    case DASHBOARD_RENAMED:{
      const { name } = action;
      return { ...state, name };
    }
    case DASHBOARD_DELETED:{
      const {id} = action;
      if (id === state.id){
        // Clear the selectedDashboard state if we deleted the selected dashboard
        return {...state, id: "", name: "", widgets:{}, selectedIds: [], redirect: true}
      }else{
>>>>>>> origin/master
        return state;
      }
    }
    default:
      return state;
  }
}
