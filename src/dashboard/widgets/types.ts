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
