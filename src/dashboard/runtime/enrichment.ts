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
  value?: any;
  writeValue?: any;
  timestamp?: number;
}

export interface AttributeMetadata {
  dataFormat?: string;
  dataType?: string;
  isNumeric?: boolean;
}

export interface DeviceMetadata {
  alias?: string;
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
type OnExecute = (device: string, command: string) => Promise<any>;

export interface ExecutionContext {
  deviceMetadataLookup: DeviceMetadataLookup;
  attributeMetadataLookup: AttributeMetadataLookup;
  attributeValuesLookup: AttributeValueLookup;
  attributeHistoryLookup: AttributeHistoryLookup;
  commandOutputLookup: CommandOutputLookup;
  onWrite: OnWrite;
  onExecute: OnExecute;
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
    const { dataType, dataFormat } = context.attributeMetadataLookup(fullName);
    const isNumeric = dataType && numericTypes.indexOf(dataType) !== -1;

    const history = context.attributeHistoryLookup(fullName);
    const values = context.attributeValuesLookup(fullName);

    return {
      ...input,
      ...values,
      history,
      dataType,
      dataFormat,
      isNumeric,
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
      execute: () => context.onExecute(resolvedDevice, command),
      output
    };
  }

  if (definition.type === "device") {
    const metadata = context.deviceMetadataLookup(input);
    return { name: input, ...metadata };
  }

  return input;
}

function defaultDeviceMetadataLookup() {
  return {};
}

function defaultAttributeMetadataLookup() {
  return {};
}

function defaultAttributeValuesLookup() {
  return {};
}

function defaultAttributeHistoryLookup() {
  return [];
}

function defaultCommandOutputLookup() {
  return null;
}

async function defaultActionHandler() {
  return false;
}

const defaultContext: ExecutionContext = {
  deviceMetadataLookup: defaultDeviceMetadataLookup,
  attributeMetadataLookup: defaultAttributeMetadataLookup,
  attributeValuesLookup: defaultAttributeValuesLookup,
  attributeHistoryLookup: defaultAttributeHistoryLookup,
  commandOutputLookup: defaultCommandOutputLookup,
  onWrite: defaultActionHandler,
  onExecute: defaultActionHandler
};

export function enrichedInputs(
  inputs: InputMapping,
  definitions: InputDefinitionMapping,
  context: Partial<ExecutionContext>
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
