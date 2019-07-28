import React from "react";

export interface BaseInputDefinition<T> {
  label?: string;
  repeat?: boolean;
  default?: T;
  required?: boolean;
}

export interface Notification {
  level: string;
  sourceAction: string;
  msg: string;
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
  placeholder?: string;
}

export interface ComplexInputDefinition extends BaseInputDefinition<null> {
  type: "complex";
  inputs: InputDefinitionMapping;
}

interface SelectInputDefinitionOption {
  name: string;
  value: any; // ?
}

export interface SelectInputDefinition extends BaseInputDefinition<string> {
  type: "select";
  options: SelectInputDefinitionOption[];
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
  invalidates?: string[];
}

export interface ColorInputDefinition extends BaseInputDefinition<string> {
  type: "color";
}

export interface DeviceInputDefinition extends BaseInputDefinition<null> {
  type: "device";
  publish?: string;
}

export interface CommandInputDefinition extends BaseInputDefinition<null> {
  type: "command";
  device?: string;
  command?: string;
  intype?: string;
  invalidates?: string[];
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

export interface Dashboard {
  id: string;
  name: string;
  user: string;
  redirect: boolean;
  insertTime: Date | null;
  updateTime: Date | null;
}

export interface InputMapping {
  [name: string]: any;
}

export interface WidgetDefinition<T = InputDefinitionMapping> {
  type: string;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  inputs: T;
}

export interface WidgetBundle {
  definition: WidgetDefinition;
  component: React.ElementType;
}

export type IndexPath = Array<string | number>;

interface AttributeValue<ValueT> {
  value: ValueT;
  writeValue: ValueT;
  timestamp: number;
}

export interface AttributeInput<ValueT = any> extends AttributeValue<ValueT> {
  device: string;
  attribute: string;
  history: Array<AttributeValue<ValueT>>;
  dataType: string;
  dataFormat: string;
  isNumeric: boolean;
  unit: string;
  write: (value: ValueT) => void;
}

export interface CommandInput<OutputT = any> {
  device: string;
  command: string;
  output: OutputT;
  execute: () => void;
}

export interface CommandInputWithParameter<OutputT = any> {
  device: string;
  command: string;
  parameter: string;
  dataType: string;
  output: OutputT;
  execute: (value: OutputT) => void;
}

export interface Canvas {
  id: string;
  name: string;
}
