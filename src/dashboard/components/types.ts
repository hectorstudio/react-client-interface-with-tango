import React from "react";

export interface IBaseInputDefinition<T> {
  label: string;
  repeat: boolean;
  default?: T;
}

interface IBooleanInputDefinition extends IBaseInputDefinition<boolean> {
  type: "boolean";
}

interface INumberInputDefinition extends IBaseInputDefinition<number> {
  type: "number";
}

interface IStringInputDefinition extends IBaseInputDefinition<string> {
  type: "string";
}

interface IComplexInputDefinition extends IBaseInputDefinition<null> {
  type: "complex";
  inputs: IInputDefinitionMapping;
}

interface ISelectInputDefinition extends IBaseInputDefinition<string> {
  type: "select";
  options: Array<{
    name: string;
    value: any;
  }>;
}

interface IAttributeInputDefinition
  extends IBaseInputDefinition<{
    device: null;
    attribute: null;
  }> {
  type: "attribute";
  dataFormat?: "scalar" | "spectrum" | "image";
  dataType?: "numeric";
}

export type IInputDefinition =
  | IBooleanInputDefinition
  | INumberInputDefinition
  | IStringInputDefinition
  | IComplexInputDefinition
  | IAttributeInputDefinition
  | ISelectInputDefinition;

export interface IInputDefinitionMapping {
  [name: string]: IInputDefinition;
}

export interface IWidget {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  [input: string]: any;
}

export interface IInputMapping {
  [name: string]: any;
}

export interface IWidgetDefinition {
  type: string;
  name: string;
  inputs: IInputDefinitionMapping;
}

export interface IWidgetBundle {
  definition: IWidgetDefinition;
  component: React.Component;
}
