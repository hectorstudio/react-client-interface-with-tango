import React from "react";
import { WidgetProps } from "./widgets/types";

export interface BaseInputDefinition<T> {
  label?: string;
  repeat?: boolean;
  default?: T;
  required?: boolean;
}

export interface BooleanInputDefinition extends BaseInputDefinition<boolean> {
  type: "boolean";
}

export interface NumberInputDefinition extends BaseInputDefinition<number> {
  type: "number";
  nonNegative?: boolean;
}

export interface StringInputDefinition extends BaseInputDefinition<string> {
  type: "string";
}

export interface ComplexInputDefinition extends BaseInputDefinition<null> {
  type: "complex";
  inputs: InputDefinitionMapping;
}

export interface SelectInputDefinition extends BaseInputDefinition<string> {
  type: "select";
  options: Array<{
    name: string;
    value: any;
  }>;
}

export interface AttributeInputDefinition
  extends BaseInputDefinition<{
    device: null;
    attribute: null;
  }> {
  type: "attribute";
  dataFormat?: "scalar" | "spectrum" | "image";
  dataType?: "numeric";
  device?: string;
  attribute?: string;
}

export interface ColorInputDefinition extends BaseInputDefinition<string> {
  type: "color";
}

export interface DeviceInputDefinition extends BaseInputDefinition<null> {
  type: "device",
  publish?: string;
}

export interface CommandInputDefinition extends BaseInputDefinition<null> {
  type: "command";
  device?: string;
  command?: string;
  intype?: string;
}

export type InputDefinition =
  | BooleanInputDefinition
  | NumberInputDefinition
  | StringInputDefinition
  | ComplexInputDefinition
  | AttributeInputDefinition
  | SelectInputDefinition
  | ColorInputDefinition
  | DeviceInputDefinition
  | CommandInputDefinition;

export interface InputDefinitionMapping {
  [name: string]: InputDefinition;
}

export interface Widget {
  type: string;
  id: string;
  valid: boolean;
  canvas: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: InputMapping;
}

export interface InputMapping {
  [name: string]: any;
}

export interface WidgetDefinition {
  type: string;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  inputs: InputDefinitionMapping;
}

export interface WidgetBundle {
  definition: WidgetDefinition;
  component: React.Component<WidgetProps>;
}

export type IndexPath = Array<string | number>;

export interface AttributeInput<ValueT = any> {
  device: string;
  attribute: string;
  value: ValueT;
  writeValue: ValueT;
}

export interface CommandInput<OutputT = any> {
  device: string;
  command: string;
  output: OutputT;
  execute: () => void;
}

export interface Canvas {
  id: string;
  name: string;
}
