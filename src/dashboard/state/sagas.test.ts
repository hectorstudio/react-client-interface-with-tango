import { deleteWidget } from "./actionCreators";
import sagas from "./sagas";
import { runSaga, stdChannel } from "redux-saga";
import { RootState } from ".";

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

test("DELETE_WIDGETS", async () => {
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

  const withSelection = {
    ...basicState,
    widgets,
    selectedIds: ["1", "2", "3"]
  };
  const dpActions = [];
  const channel = stdChannel();
  const fakeStore = {
    dispatch: (action) => dpActions.push(action),
    getState: () => ({ selectedDashboard: withSelection } as RootState),
    channel,
  };
  runSaga(fakeStore, sagas, deleteWidget());
  channel.put(deleteWidget());
  channel.close();
  const dashboardEditedAction = dpActions.find(function(a) {
    return a.type == "DASHBOARD_EDITED"
  });
  const idsAfter = Object.keys(dashboardEditedAction.dashboard.widgets);

  expect(idsAfter).toEqual(["4", "5"]);
  expect(dashboardEditedAction.dashboard.selectedIds).toEqual([]);
});