import { IWidget, IndexPath, IInputMapping } from "../../types";
import {
  ADD_WIDGET,
  MOVE_WIDGET,
  SELECT_WIDGET,
  DELETE_WIDGET,
  SET_INPUT,
  DELETE_INPUT,
  ADD_INPUT
} from "../actionTypes";
import { defaultInputs } from "src/dashboard/utils";
import { DashboardAction } from "../actions";

function replaceAt<T>(arr: T[], index: number, repl: T) {
  const copy = arr.concat();
  copy.splice(index, 1, repl);
  return copy;
}

function removeAt<T>(arr: T[], index: number) {
  const copy = arr.concat();
  copy.splice(index, 1);
  return copy;
}

function move(widget: IWidget, dx: number, dy: number) {
  const { x, y } = widget;
  return { ...widget, x: x + dx, y: y + dy };
}

const REMOVAL_SYMBOL = Symbol("REMOVAL_SYMBOL");

function setWithIndexPath(obj: object, path: IndexPath, value: any) {
  const [head, ...tail] = path;
  const replacement =
    tail.length > 0 ? setWithIndexPath(obj[head], tail, value) : value;
  if (Array.isArray(obj)) {
    const copy = obj.concat();
    if (typeof head !== "number") {
      throw new Error("head must be an integer when obj is an array");
    } else {
      if (replacement === REMOVAL_SYMBOL) {
        copy.splice(head, 1);
      } else {
        copy[head] = replacement;
      }
    }
    return copy;
  } else {
    return { ...obj, [head]: replacement };
  }
}

interface IWidgetState {
  selectedIndex: number;
  widgets: IWidget[];
}

const initialState = {
  selectedIndex: -1,
  widgets: []
};

export default function canvases(
  state: IWidgetState = initialState,
  action: DashboardAction
): IWidgetState {
  switch (action.type) {
    case ADD_WIDGET: {
      const { x, y, definition } = action;
      const { type } = definition;
      const inputs = defaultInputs(definition.inputs);
      const widget = {
        x,
        y,
        width: 100, // ??
        height: 100, // ??
        type,
        inputs
      };
      return {
        ...state,
        widgets: [...state.widgets, widget],
        selectedIndex: state.widgets.length
      };
    }
    case MOVE_WIDGET: {
      const { dx, dy, index } = action;
      const oldWidget = state.widgets[index];
      const newWidget = move(oldWidget, dx, dy);
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    case SELECT_WIDGET: {
      const { index } = action;
      return { ...state, selectedIndex: index };
    }
    case DELETE_WIDGET: {
      const widgets = removeAt(state.widgets, state.selectedIndex);
      return { ...state, widgets };
    }
    case SET_INPUT: {
      const { path, value } = action;
      const index = state.selectedIndex;
      const oldWidget = state.widgets[index];
      const oldInputs = oldWidget.inputs;
      const newInputs = setWithIndexPath(oldInputs, path, value);
      const newWidget = { ...oldWidget, inputs: newInputs };
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    // ADD_INPUT: {
    //   const { path } = action;
    //   const index = state.selectedIndex;
    //   const oldWidget = state.widgets[index];
    //   const oldInputs = oldWidget.inputs;
    // }
    case DELETE_INPUT: {
      const { path } = action;
      const index = state.selectedIndex;
      const oldWidget = state.widgets[index];
      const oldInputs = oldWidget.inputs;
      const newInputs = setWithIndexPath(oldInputs, path, REMOVAL_SYMBOL);
      const newWidget = { ...oldWidget, inputs: newInputs };
      const widgets = replaceAt(state.widgets, index, newWidget);
      return { ...state, widgets };
    }
    default:
      return state;
  }
}
