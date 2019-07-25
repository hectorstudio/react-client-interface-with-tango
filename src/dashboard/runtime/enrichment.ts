import {
  InputDefinitionMapping,
  InputMapping,
  InputDefinition
} from "../types";
import { publishedDevices, resolveDevice, PublishedDevices } from "./utils";

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

type OnWrite = (device: string, attribute: string, value: any) => Promise<void>;

type OnExecute = (device: string, command: string, argin: any) => Promise<void>;

type OnInvalidate = (attributes: string[]) => void;

// TODO (?) make as many as possible of the members optional
export interface ExecutionContext {
  readonly deviceMetadataLookup: DeviceMetadataLookup;
  readonly attributeMetadataLookup: AttributeMetadataLookup;
  readonly attributeValuesLookup: AttributeValueLookup;
  readonly attributeHistoryLookup: AttributeHistoryLookup;
  readonly commandOutputLookup: CommandOutputLookup;
  readonly onWrite?: OnWrite;
  readonly onExecute?: OnExecute;
  readonly onInvalidate?: OnInvalidate;
}

function enrichedInput(
  input: any,
  inputDefinition: InputDefinition,
  published: { [variable: string]: string },
  context: ExecutionContext,
  onInvalidate: (inputNames?: string[]) => void
) {
  if (inputDefinition.repeat) {
    return input.map(entry =>
      enrichedInput(
        entry,
        { ...inputDefinition, repeat: false },
        published,
        context,
        onInvalidate
      )
    );
  }

  if (inputDefinition.type === "attribute") {
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      inputDefinition.device
    );

    const attribute = input.attribute || inputDefinition.attribute;
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
      write: async (param: any) => {
        if (context.onWrite) {
          await context.onWrite(resolvedDevice, attribute, param);
          onInvalidate(inputDefinition.invalidates);
        }
      }
    };
  }

  if (inputDefinition.type === "complex") {
    return enrichedInputs(input, inputDefinition.inputs, context);
  }

  if (inputDefinition.type === "command") {
    const command = input.command || inputDefinition.command;
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      inputDefinition.device
    );

    const fullName = `${resolvedDevice}/${command}`;
    const output = context.commandOutputLookup(fullName);

    return {
      ...input,
      execute: async argin => {
        if (context.onExecute) {
          await context.onExecute(resolvedDevice, command, argin);
          onInvalidate(inputDefinition.invalidates);
        }
      },
      output
    };
  }

  if (inputDefinition.type === "device") {
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
  }
};

function invalidatedAttributes(
  inputNames: string[],
  inputDefinitions: InputDefinitionMapping,
  published: PublishedDevices
) {
  function* inner(
    inputNames: string[],
    inputDefinitions: InputDefinitionMapping,
    published: PublishedDevices
  ) {
    for (const name of inputNames) {
      const inputDefinition = inputDefinitions[name];
      if (inputDefinition.type === "attribute") {
        const { device, attribute } = inputDefinition;

        if (device == null || attribute == null) {
          continue;
        }

        const resolvedDevice = published[device] || device;
        yield `${resolvedDevice}/${attribute}`;
      }
    }
  }

  return Array.from(inner(inputNames, inputDefinitions, published));
}

export function enrichedInputs(
  inputs: InputMapping,
  inputDefinitions: InputDefinitionMapping,
  context: Partial<ExecutionContext> = {}
) {
  const contextWithDefaults = { ...defaultContext, ...context };
  const published = publishedDevices(inputs, inputDefinitions);
  const names = Object.keys(inputs);

  function onInvalidate(inputNames?: string[]) {
    // No need to proceed if the context doesn't handle invalidation
    if (context.onInvalidate == null) {
      return;
    }

    // Not all inputs invalidate, so inputNames can be undefined
    if (inputNames == null) {
      return;
    }

    const invalidated = invalidatedAttributes(
      inputNames,
      inputDefinitions,
      published
    );

    if (invalidated.length > 0) {
      context.onInvalidate(invalidated);
    }
  }

  return names.reduce((accum, name) => {
    const subInput = inputs[name];
    const subDefinition = inputDefinitions[name];

    const value = enrichedInput(
      subInput,
      subDefinition,
      published,
      contextWithDefaults,
      onInvalidate
    );

    return { ...accum, [name]: value };
  }, {});
}
