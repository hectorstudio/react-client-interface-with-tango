import {
  NumberInputDefinition,
  StringInputDefinition,
  DeviceInputDefinition,
  AttributeInputDefinition,
  CommandInputDefinition,
  SelectInputDefinition,
  ColorInputDefinition,
  CommandInput,
  AttributeInput
} from "../types";

export type WidgetProps<T> = {
  inputs: {
    [K in keyof T]: T[K] extends NumberInputDefinition
      ? number
      : T[K] extends StringInputDefinition
      ? string
      : T[K] extends DeviceInputDefinition
      ? {
          name: string;
          alias: string;
        }
      : T[K] extends AttributeInputDefinition
      ? AttributeInput
      : T[K] extends CommandInputDefinition
      ? CommandInput
      : T[K] extends SelectInputDefinition // TODO: infer U if possible
      ? any
      : T[K] extends ColorInputDefinition
      ? string
      : never
  };
  t0: number;
  mode: "run" | "edit" | "library";
  actualWidth: number;
  actualHeight: number;
};
