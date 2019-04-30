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
  value: any;
  writeValue: any;
  timestamp: number;
}

export interface AttributeMetadata {
  dataFormat: string;
  dataType: string;
  isNumeric: boolean;
}

export interface DeviceMetadata {
  alias: string;
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

function enrichedInput(
  input: any,
  definition: InputDefinition,
  deviceMetadata: DeviceMetadataLookup,
  attributeMetadata: AttributeMetadataLookup,
  attributeValues: AttributeValueLookup,
  attributeHistory: AttributeHistoryLookup,
  commandOutputs: CommandOutputLookup,
  published: { [variable: string]: string },
  onWrite: OnWrite,
  onExecute: OnExecute
) {
  if (definition.repeat) {
    return input.map(entry =>
      enrichedInput(
        entry,
        { ...definition, repeat: false },
        deviceMetadata,
        attributeMetadata,
        attributeValues,
        attributeHistory,
        commandOutputs,
        published,
        onWrite,
        onExecute
      )
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
    const { dataType, dataFormat } = attributeMetadata(fullName);
    const isNumeric = numericTypes.indexOf(dataType) !== -1;

    const history = attributeHistory(fullName);
    const values = attributeValues(fullName);

    return {
      ...input,
      ...values,
      history,
      dataType,
      dataFormat,
      isNumeric,
      write: (param: any) => onWrite(resolvedDevice, attribute, param)
    };
  }

  if (definition.type === "complex") {
    return enrichedInputs(
      input,
      definition.inputs,
      deviceMetadata,
      attributeMetadata,
      attributeValues,
      attributeHistory,
      commandOutputs,
      onWrite,
      onExecute
    );
  }

  if (definition.type === "command") {
    const command = input.command || definition.command;
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      definition.device
    );

    const fullName = `${resolvedDevice}/${command}`;
    const output = commandOutputs(fullName);

    return {
      ...input,
      execute: () => onExecute(resolvedDevice, command),
      output
    };
  }

  if (definition.type === "device") {
    const { alias } = deviceMetadata(input);
    return { name: input, alias };
  }

  return input;
}

export function enrichedInputs(
  inputs: InputMapping,
  definitions: InputDefinitionMapping,
  deviceMetadata: DeviceMetadataLookup,
  attributeMetadata: AttributeMetadataLookup,
  attributeValuesLookup: AttributeValueLookup,
  attributeHistoryLookup: AttributeHistoryLookup,
  commandLookup: CommandOutputLookup,
  onWrite: OnWrite,
  onExecute: OnExecute
) {
  const published = publishedDevices(inputs, definitions);
  const names = Object.keys(inputs);

  return names.reduce((accum, name) => {
    const subInput = inputs[name];
    const subDefinition = definitions[name];
    const value = enrichedInput(
      subInput,
      subDefinition,
      deviceMetadata,
      attributeMetadata,
      attributeValuesLookup,
      attributeHistoryLookup,
      commandLookup,
      published,
      onWrite,
      onExecute
    );
    return { ...accum, [name]: value };
  }, {});
}
