import { Widget } from "../../../types";

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
  DASHBOARD_SAVED,
  DASHBOARD_CLONED,
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

import { definitionForType, definitionForWidget } from "src/dashboard/widgets";
import { defaultInputs } from "src/dashboard/utils";

export interface SelectedDashboardState {
  selectedIds: string[];
  widgets: Record<string, Widget>;
  id: string;
  name: string;
  user: string;
  redirect: boolean;
  insertTime: Date | null,
  updateTime: Date | null,
}

const initialState = {
  selectedId: null,
  selectedIds: [],
  widgets: {},
  id: "",
  name: "Untitled dashboard",
  user: "",
  redirect: false,
  insertTime: null,
  updateTime: null,
};

export default function canvases(
  state: SelectedDashboardState = initialState,
  action: DashboardAction
): SelectedDashboardState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, canvas, widgetType: type } = action;
      const definition = definitionForType(type)!;
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
    case SELECT_WIDGETS: {
      const { ids } = action;
      return { ...state, selectedIds: ids };
    }
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
      const definition = definitionForWidget(oldWidget)!;
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
      const newWidgets = widgets.reduce((accum, widget) => {
        return { ...accum, [widget.id]: validate(widget) };
      }, {});

      return { ...state, widgets: newWidgets, id, name, user, redirect, insertTime, updateTime };
    }
    case DASHBOARD_RENAMED:{
      const {dashboard} = action;
      return {...state, name: dashboard.name}
    }
    case DASHBOARD_DELETED:{
      const {id} = action;
      if (id === state.id){
        // Clear the selectedDashboard state if we deleted the selected dashboard
        return {...state, id: "", name: "", widgets:{}, selectedIds: [], redirect: true}
      }else{
        return state;
      }
    }
    default:
      return state;
  }
}