import { IWidget, IndexPath } from "src/dashboard/types";

export function replaceAt<T>(arr: T[], index: number, repl: T) {
  const copy = arr.concat();
  copy.splice(index, 1, repl);
  return copy;
}

export function removeAt<T>(arr: T[], index: number) {
  const copy = arr.concat();
  copy.splice(index, 1);
  return copy;
}

export function move(widget: IWidget, dx: number, dy: number) {
  const { x, y } = widget;
  return { ...widget, x: x + dx, y: y + dy };
}

export function setInput(widget: IWidget, path: IndexPath, value: any) {
  const oldInputs = widget.inputs;
  const newInputs = setWithIndexPath(oldInputs, path, value, REPLACE);
  return { ...widget, inputs: newInputs };
}

export function deleteInput(widget: IWidget, path: IndexPath) {
  const oldInputs = widget.inputs;
  const newInputs = setWithIndexPath(oldInputs, path, null, DELETE);
  return { ...widget, inputs: newInputs };
}

export function addInput(widget: IWidget, path: IndexPath, value: any) {
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
  const replacement = tail.length > 0
      ? setWithIndexPath(obj[head], tail, value, mode)
      : value;
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
        copy.splice(head, 0, replacement);
      }
    }
    return copy;
  } else {
    return { ...obj, [head]: replacement };
  }
}
