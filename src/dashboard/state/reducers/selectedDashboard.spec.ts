import reducer from "./selectedDashboard";
import {
  selectWidgets,
  deleteWidget,
  dashboardRenamed
} from "../actionCreators";
import { getWidgets } from "../selectors";
import { RootState } from ".";
//import { Dashboard } from "../../types";

const basicState = {
  widgets: {},
  selectedIds: [],
  id: "",
  name: "",
  user: "",
  group: "",
  lastUpdatedBy: "",
  redirect: false,
  insertTime: null,
  updateTime: null,
  history: {
    undoActions: [],
    redoActions: [],
    undoIndex: 0,
    redoIndex: 0,
    undoLength: 0,
    redoLength: 0,
  }
};

const savedState = {
  ...basicState,
  id: "5cb49ad146f4c024ece1cea5",
  insertTime: new Date("1990"),
  updateTime: new Date("2000")
};

test("SELECT_WIDGETS", () => {
  const ids = ["2", "3", "5"];
  const action = selectWidgets(ids);

  const state = reducer(basicState, action);
  expect(state.selectedIds).toEqual(ids);
});

test("DASHBOARD_RENAMED", () => {
  const newName = "new name";
  const action = dashboardRenamed(savedState.id, newName);

  const state = reducer(savedState, action);
  expect(state.name).toEqual(newName);
});
