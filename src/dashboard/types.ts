import React from "react";
import { IWidgetProps } from "./widgets/types";

export interface IBaseInputDefinition<T> {
  label?: string;
  repeat?: boolean;
  default?: T;
  required?: boolean;
}

export interface IBooleanInputDefinition extends IBaseInputDefinition<boolean> {
  type: "boolean";
}

export interface INumberInputDefinition extends IBaseInputDefinition<number> {
  type: "number";
}

export interface IStringInputDefinition extends IBaseInputDefinition<string> {
  type: "string";
}

export interface IComplexInputDefinition extends IBaseInputDefinition<null> {
  type: "complex";
  inputs: IInputDefinitionMapping;
}

export interface ISelectInputDefinition extends IBaseInputDefinition<string> {
  type: "select";
  options: Array<{
    name: string;
    value: any;
  }>;
}

export interface IAttributeInputDefinition
  extends IBaseInputDefinition<{
    device: null;
    attribute: null;
  }> {
  type: "attribute";
  dataFormat?: "scalar" | "spectrum" | "image";
  dataType?: "numeric";
  device?: string;
  attribute?: string;
}

export interface IColorInputDefinition extends IBaseInputDefinition<string> {
  type: "color";
}

export interface IDeviceInputDefinition extends IBaseInputDefinition<null> {
  type: "device",
  publish?: string;
}

export interface ICommandInputDefinition extends IBaseInputDefinition<null> {
  type: "command";
  device?: string;
  command?: string;
  intype?: string;
}

export type IInputDefinition =
  | IBooleanInputDefinition
  | INumberInputDefinition
  | IStringInputDefinition
  | IComplexInputDefinition
  | IAttributeInputDefinition
  | ISelectInputDefinition
  | IColorInputDefinition
  | IDeviceInputDefinition
  | ICommandInputDefinition;

export interface IInputDefinitionMapping {
  [name: string]: IInputDefinition;
}

export interface IWidget {
  type: string;
  id: string;
  valid: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: IInputMapping;
}

export interface IInputMapping {
  [name: string]: any;
}

export interface IWidgetDefinition {
  type: string;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  inputs: IInputDefinitionMapping;
}

export interface IWidgetBundle {
  definition: IWidgetDefinition;
  component: React.Component<IWidgetProps>;
}

export type IndexPath = Array<string | number>;
