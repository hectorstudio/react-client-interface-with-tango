export interface IBaseInputDefinition {
  label: string;
  repeat: boolean;
}

interface IBooleanInputDefinition extends IBaseInputDefinition {
  type: "boolean";
  default: boolean;
}

interface INumberInputDefinition extends IBaseInputDefinition {
  type: "number";
  default: number;
}

interface IStringInputDefinition extends IBaseInputDefinition {
  type: "string";
  default: string;
}

interface IComplexInputDefinition extends IBaseInputDefinition {
  type: "complex";
  inputs: IInputDefinitionMapping;
  default: object;
}

interface ISelectInputDefinition extends IBaseInputDefinition {
  type: "select";
  default: string;
  options: Array<{
    name: string;
    value: any;
  }>;
}

interface IAttributeInputDefinition extends IBaseInputDefinition {
  type: "attribute";
  default: null;
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

export interface INewDefinition {
  inputs: IInputDefinitionMapping;
}

export interface IWidget {
  type: string;
  [input: string]: any;
}

export interface IInputMapping {
  [name: string]: any;
}
