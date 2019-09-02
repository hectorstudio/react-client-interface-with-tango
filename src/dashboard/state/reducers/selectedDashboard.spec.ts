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

test("DELETE_WIDGETS", () => {
  const ids = ["1", "2", "3", "4", "5"];
  const widgets = ids.reduce((accum, id) => {
    return {
      ...accum,
      [id]: {
        id,
        type: "",
        valid: true,
        x: 0,
        y: 0,
        canvas: "",
        width: 0,
        height: 0,
        inputs: []
      }
    };
  }, {});

  const withWidgets = { ...basicState, widgets };
  const withSelection = reducer(withWidgets, selectWidgets(["2", "3", "4"]));
  const state = reducer(withSelection, deleteWidget());
  const widgetsAfter = getWidgets({ selectedDashboard: state } as RootState);
  const idsAfter = widgetsAfter.map(({ id }) => id);

  expect(idsAfter).toEqual(["1", "5"]);
  expect(state.selectedIds).toEqual([]);
});

test("DASHBOARD_RENAMED", () => {
  const newName = "new name";
  const action = dashboardRenamed(savedState.id, newName);

  const state = reducer(savedState, action);
  expect(state.name).toEqual(newName);
});
