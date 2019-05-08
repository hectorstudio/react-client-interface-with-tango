import {
  InputDefinitionMapping,
  InputMapping,
  InputDefinition
} from "../types";
import { publishedDevices, resolveDevice } from "./utils";

const numericTypes = [
  "DevDouble",
  "DevFloat",
  "DevLong",
  "DevLong64",
  "DevShort",
  "DevUChar",
  "DevULong",
  "DevULong64",
  "DevUShort"
];

export interface AttributeValue {
  readonly value?: any;
  readonly writeValue?: any;
  readonly timestamp?: number;
}

export interface AttributeMetadata {
  readonly dataFormat?: string;
  readonly dataType?: string;
  readonly unit?: string;
}

export interface DeviceMetadata {
  readonly alias?: string;
}

type LookupFunction<T> = (name: string) => T;

export type AttributeMetadataLookup = LookupFunction<AttributeMetadata>;
export type AttributeValueLookup = LookupFunction<AttributeValue>;
export type AttributeHistoryLookup = LookupFunction<AttributeValue[]>;
export type CommandOutputLookup = LookupFunction<any>;
export type DeviceMetadataLookup = LookupFunction<DeviceMetadata>;

type OnWrite = (
  device: string,
  attribute: string,
  value: any
) => Promise<boolean>;

type OnExecute = (
  device: string,
  command: string,
  argin: any
) => Promise<boolean>;

export interface ExecutionContext {
  readonly deviceMetadataLookup: DeviceMetadataLookup;
  readonly attributeMetadataLookup: AttributeMetadataLookup;
  readonly attributeValuesLookup: AttributeValueLookup;
  readonly attributeHistoryLookup: AttributeHistoryLookup;
  readonly commandOutputLookup: CommandOutputLookup;
  readonly onWrite: OnWrite;
  readonly onExecute: OnExecute;
}

function enrichedInput(
  input: any,
  definition: InputDefinition,
  published: { [variable: string]: string },
  context: ExecutionContext
) {
  if (definition.repeat) {
    return input.map(entry =>
      enrichedInput(entry, { ...definition, repeat: false }, published, context)
    );
  }

  if (definition.type === "attribute") {
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      definition.device
    );

    const attribute = input.attribute || definition.attribute;
    const fullName = `${resolvedDevice}/${attribute}`;
    const { dataType, dataFormat, unit } = context.attributeMetadataLookup(
      fullName
    );
    const isNumeric = dataType != null && numericTypes.indexOf(dataType) !== -1;

    const history = context.attributeHistoryLookup(fullName);
    const values = context.attributeValuesLookup(fullName);

    return {
      ...input,
      ...values,
      history,
      dataType,
      dataFormat,
      isNumeric,
      unit,
      write: (param: any) => context.onWrite(resolvedDevice, attribute, param)
    };
  }

  if (definition.type === "complex") {
    return enrichedInputs(input, definition.inputs, context);
  }

  if (definition.type === "command") {
    const command = input.command || definition.command;
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      definition.device
    );

    const fullName = `${resolvedDevice}/${command}`;
    const output = context.commandOutputLookup(fullName);

    return {
      ...input,
      execute: argin => context.onExecute(resolvedDevice, command, argin),
      output
    };
  }

  if (definition.type === "device") {
    const metadata = context.deviceMetadataLookup(input);
    return { name: input, ...metadata };
  }

  return input;
}

const defaultContext: ExecutionContext = {
  deviceMetadataLookup() {
    return {};
  },
  attributeMetadataLookup() {
    return {};
  },
  attributeValuesLookup() {
    return {};
  },
  attributeHistoryLookup() {
    return [];
  },
  commandOutputLookup() {
    return null;
  },
  async onWrite() {
    return false;
  },
  async onExecute() {
    return false;
  }
};

export function enrichedInputs(
  inputs: InputMapping,
  definitions: InputDefinitionMapping,
  context: Partial<ExecutionContext> = {}
) {
  const contextWithDefaults = { ...defaultContext, ...context };
  const published = publishedDevices(inputs, definitions);
  const names = Object.keys(inputs);

  return names.reduce((accum, name) => {
    const subInput = inputs[name];
    const subDefinition = definitions[name];

    const value = enrichedInput(
      subInput,
      subDefinition,
      published,
      contextWithDefaults
    );

    return { ...accum, [name]: value };
  }, {});
}
