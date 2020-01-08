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

export interface SelectedDashboardState extends Dashboard {
  widgets: Record<string, Widget>;
  selectedIds: string[];
  history: DashboardEditHistory;
}

const initialState = {
  selectedId: null,
  selectedIds: [],
  widgets: {},
  id: "",
  name: "Untitled dashboard",
  user: "",
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
};

export default function canvases(
  state: SelectedDashboardState = initialState,
  action: DashboardAction
): SelectedDashboardState {
  switch (action.type) {
    case SELECT_WIDGETS: {
      const { ids } = action;
      return { ...state, selectedIds: ids };
    }

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

      const newWidgets = widgets.reduce((accum, widget) => {
        return { ...accum, [widget.id]: validate(widget) };
      }, {});

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
        return state;
      }
    }
    default:
      return state;
  }
}
