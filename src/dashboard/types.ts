import React from "react";
<<<<<<< HEAD
=======
//import { WidgetProps } from "./widgets/types";
>>>>>>> origin/master

export interface BaseInputDefinition<T> {
  label?: string;
  repeat?: boolean;
  default?: T;
  required?: boolean;
}

<<<<<<< HEAD
export interface Notification {
  level: string;
  sourceAction: string;
  msg: string;
=======
export interface Notification{
  level:string;
  sourceAction:string;
  msg:string;
>>>>>>> origin/master
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
<<<<<<< HEAD
export interface ComplexInputDefinition<T = any>
  extends BaseInputDefinition<null> {
  type: "complex";
  inputs: T;
}

interface SelectInputDefinitionOption<T> {
  name: string;
  value: T; // ?
}

export interface SelectInputDefinition<T = string>
  extends BaseInputDefinition<string> {
  type: "select";
  options: SelectInputDefinitionOption<T>[];
=======

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
>>>>>>> origin/master
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
<<<<<<< HEAD
  parameter?: string;
}

export interface CommandInputWithParameterDefinition extends BaseInputDefinition<null> {
  type: "command";
  device?: string;
  command?: string;
  intype?: string;
  invalidates?: string[];
  parameter?: string;
=======
>>>>>>> origin/master
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
<<<<<<< HEAD
  order: number;
}

//meta information about available group dashboards, with count and whether it has been loade for each group
export interface AvailableGroupDashboards{
  [group: string]: {
    count: number,
    loaded: boolean,
  }
}
export interface SharedDashboards{
  dashboards: Dashboard[];
  availableGroupDashboards: AvailableGroupDashboards;
}
export interface DashboardEditHistory{
  undoActions: Record<string, Widget>[],
  redoActions: Record<string, Widget>[],
  undoIndex: number,
  redoIndex: number,
  undoLength: number,
  redoLength: number,
=======
>>>>>>> origin/master
}

export interface Dashboard {
  id: string;
  name: string;
  user: string;
<<<<<<< HEAD
  insertTime: Date | null;
  updateTime: Date | null;
  group: string | null;
  lastUpdatedBy: string | null;
  selectedIds: string[];
  history: DashboardEditHistory;
=======
  redirect: boolean;
  insertTime: Date | null;
  updateTime: Date | null;
>>>>>>> origin/master
}

export interface InputMapping {
  [name: string]: any;
}

<<<<<<< HEAD
export interface WidgetDefinition<T extends InputDefinitionMapping> {
=======
export interface WidgetDefinition {
>>>>>>> origin/master
  type: string;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
<<<<<<< HEAD
  inputs: T;
}

export interface WidgetBundle<T extends InputDefinitionMapping> {
  definition: WidgetDefinition<T>;
=======
  inputs: InputDefinitionMapping;
}

export interface WidgetBundle {
  definition: WidgetDefinition;
>>>>>>> origin/master
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
<<<<<<< HEAD
  enumlabels: Array<string>;
=======
>>>>>>> origin/master
  isNumeric: boolean;
  unit: string;
  write: (value: ValueT) => void;
}

export interface CommandInput<OutputT = any> {
  device: string;
  command: string;
<<<<<<< HEAD
  parameter?: string;
  dataType?: string;
  output: OutputT;
  execute: (argin?: any) => void;
}

export interface DeviceInput {
  name: string;
  alias: string;
}


export interface CommandInputWithParameter<OutputT = any> {
  device: string;
  command: string;
  parameter?: string;
  dataType?: string;
  output: OutputT;
  execute: (value: OutputT) => void;
}

export type ComplexInput<T> = any;

=======
  output: OutputT;
  execute: () => void;
}

>>>>>>> origin/master
export interface Canvas {
  id: string;
  name: string;
}
