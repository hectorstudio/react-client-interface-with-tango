import {
  Widget,
  IndexPath,
  WidgetDefinition,
  InputDefinitionMapping,
  InputMapping,
  InputDefinition
} from "src/dashboard/types";
import { defaultInputs } from "src/dashboard/utils";
import { definitionForWidget } from "src/dashboard/widgets";

export function move(widget: Widget, dx: number, dy: number) {
  const { x, y } = widget;
  const targetX = Math.max(0, x + dx);
  const targetY = Math.max(0, y + dy);
  return { ...widget, x: targetX, y: targetY };
}

export function resize(
  widget: Widget,
  mx: number,
  my: number,
  dx: number,
  dy: number
) {
  const moved = move(widget, mx, my);
  const { width, height } = moved;
  return {
    ...moved,
    width: Math.max(2, width + dx),
    height: Math.max(2, height + dy)
  };
}

export function validate(widget: Widget) {
  const definition = definitionForWidget(widget);
  const valid = inputsAreValid(definition!.inputs, widget.inputs);
  return { ...widget, valid };
}

export function setInput(widget: Widget, path: IndexPath, value: any) {
  const oldInputs = widget.inputs;
  const newInputs = setWithIndexPath(oldInputs, path, value, REPLACE);
  return { ...widget, inputs: newInputs };
}

export function deleteInput(widget: Widget, path: IndexPath) {
  const oldInputs = widget.inputs;
  const newInputs = setWithIndexPath(oldInputs, path, null, DELETE);
  return { ...widget, inputs: newInputs };
}

export function addInput(widget: Widget, path: IndexPath, value: any) {
  const oldInputs = widget.inputs;
  const newInputs = setWithIndexPath(oldInputs, path, value, ADD);
  return { ...widget, inputs: newInputs };
}

const DELETE = Symbol("DELETE");
const ADD = Symbol("ADD");
const REPLACE = Symbol("REPLACE");

type Mode = typeof DELETE | typeof ADD | typeof REPLACE;

export function setWithIndexPath(
  obj: object,
  path: IndexPath,
  value: any,
  mode: Mode
) {
  const [head, ...tail] = path;
  const replacement =
    tail.length > 0 ? setWithIndexPath(obj[head], tail, value, mode) : value;
  if (Array.isArray(obj)) {
    const copy = obj.concat();
    if (typeof head !== "number") {
      throw new Error("head must be an integer when obj is an array");
    } else {
      if (mode === DELETE) {
        copy.splice(head, 1);
      } else if (mode === REPLACE) {
        copy.splice(head, 1, replacement);
      } else if (mode === ADD) {
        // Some logic to support both negative and positive indices. Needs to be tested more thorougly
        const length = copy.length;
        const norm = length > 0 ? (length + head) % length : 0;
        const index = norm + (head < 0 ? 1 : 0);
        copy.splice(index, 0, replacement);
      }
    }
    return copy;
  } else {
    return { ...obj, [head]: replacement };
  }
}

export function defaultDimensions(
  definition: WidgetDefinition
): { width: number; height: number } {
  const { defaultWidth: width, defaultHeight: height } = definition;
  return { width, height };
}

export function nestedDefault(definition: WidgetDefinition, path: IndexPath) {
  const leaf = path.reduce((accum, segment): {
    inputs: InputDefinitionMapping;
  } => {
    const input = accum.inputs[segment];
    if (typeof segment === "number") {
      return accum;
    } else if (input.type === "complex") {
      return input;
    } else {
      throw new Error("only complex inputs can be traversed");
    }
  }, definition);
  return defaultInputs(leaf.inputs);
}

// TODO: cover more validation cases
function inputIsValid(definition: InputDefinition, value: any): boolean {
  if (definition.type === "complex") {
    if (definition.repeat) {
      return value
        .map(input => inputIsValid({ ...definition, repeat: false }, input))
        .reduce((prev, curr) => prev && curr, true);
    } else {
      const inputNames = Object.keys(definition.inputs);
      return inputNames
        .map(name => inputIsValid(definition.inputs[name], value[name]))
        .reduce((prev, curr) => prev && curr, true);
    }
  }

  if (definition.required !== true) {
    return true;
  }

  if (definition.type === "attribute") {
    const { device, attribute } = value;
    return device != null && attribute != null;
  }

  if (definition.type === "command") {
    const { device, command } = value;
    return device != null && command != null;
  }

  if (definition.type === "number") {
    if (isNaN(value)) {
      return false;
    }
  }

  return true;
}

export function inputsAreValid(
  definition: InputDefinitionMapping,
  inputs: InputMapping
): boolean {
  const inputNames = Object.keys(definition);
  const results = inputNames.map(name => {
    const inputDefinition = definition[name];
    const input = inputs[name];
    return inputIsValid(inputDefinition, input);
  });

  return results.reduce((prev, curr) => prev && curr, true);
}

export function nextId(widgets: Record<string, Widget>): string {
  const ids = Object.keys(widgets).map(key => parseInt(key, 10));
  const highest = ids.reduce((max, id) => Math.max(max, id), 0);
  return String(1 + highest);
}
