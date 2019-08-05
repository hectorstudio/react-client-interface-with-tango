import {
  NumberInputDefinition,
  StringInputDefinition,
  DeviceInputDefinition,
  AttributeInputDefinition,
  CommandInputDefinition,
  SelectInputDefinition,
  ColorInputDefinition,
  CommandInput,
  AttributeInput,
  ComplexInputDefinition,
  BooleanInputDefinition
} from "../types";

type XYZ<T> = {
  [K in keyof T]: T[K] extends NumberInputDefinition
    ? number
    : T[K] extends StringInputDefinition
    ? string
    : T[K] extends BooleanInputDefinition
    ? boolean
    : T[K] extends DeviceInputDefinition
    ? {
        name: string;
        alias: string;
      }
    : T[K] extends AttributeInputDefinition
    ? AttributeInput
    : T[K] extends CommandInputDefinition
    ? CommandInput
    : T[K] extends SelectInputDefinition<infer U>
    ? U
    : T[K] extends ColorInputDefinition
    ? string
    : T[K] extends ComplexInputDefinition<infer U>
    ? Array<XYZ<U>>
    : never
};

export type WidgetProps<T> = {
  inputs: XYZ<T>;
  t0: number;
  mode: "run" | "edit" | "library";
  actualWidth: number;
  actualHeight: number;
};
