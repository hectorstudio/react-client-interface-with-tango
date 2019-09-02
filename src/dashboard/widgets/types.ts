import {
  NumberInputDefinition,
  StringInputDefinition,
  DeviceInputDefinition,
  AttributeInputDefinition,
  CommandInputDefinition,
  SelectInputDefinition,
  ColorInputDefinition,
  ComplexInputDefinition,
  BooleanInputDefinition,
  CommandInput,
  AttributeInput,
  DeviceInput,
} from "../types";

// This type mapping makes an assumption that technically isn't in line with
// the current design/docs: that _only_ complex inputs are repeated, and that
// _all_ complex inputs are repeated. However, I think this makes sense for
// almost all scenarios, and that it should be the general behaviour.

type TypedInputs<T> = {
  [K in keyof T]: T[K] extends NumberInputDefinition
    ? number
    : T[K] extends StringInputDefinition
    ? string
    : T[K] extends BooleanInputDefinition
    ? boolean
    : T[K] extends DeviceInputDefinition
    ? DeviceInput
    : T[K] extends AttributeInputDefinition
    ? AttributeInput
    : T[K] extends CommandInputDefinition
    ? CommandInput
    : T[K] extends SelectInputDefinition<infer U>
    ? U
    : T[K] extends ColorInputDefinition
    ? string
    : T[K] extends ComplexInputDefinition<infer U>
    ? Array<TypedInputs<U>> // Assumes that complex inputs are always repeated
    : never
};

export type WidgetProps<T> = {
  inputs: TypedInputs<T>;
  t0: number;
  mode: "run" | "edit" | "library";
  actualWidth: number;
  actualHeight: number;
};
