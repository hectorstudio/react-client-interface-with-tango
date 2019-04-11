import {
  InputDefinitionMapping,
  InputMapping,
  Widget,
  InputDefinition,
  AttributeInputDefinition
} from "../../types";
import { definitionForWidget } from "../../widgets";

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

function resolveDevice(
  published: PublishedDevices,
  inputDevice: string,
  definitionDevice?: string
) {
  return definitionDevice && published.hasOwnProperty(definitionDevice)
    ? published[definitionDevice]
    : inputDevice;
}

interface AttributeValue {
  value: any;
  writeValue: any;
  timestamp: number;
}

interface AttributeMetadata {
  dataFormat: string;
  dataType: string;
  isNumeric: boolean;
}

export type AttributeMetadataLookup = Record<string, AttributeMetadata>;
export type AttributeValueLookup = Record<string, AttributeValue>;
export type AttributeHistoryLookup = Record<string, AttributeValue[]>;
export type CommandOutputLookup = Record<string, any>;

type OnWrite = (
  device: string,
  attribute: string,
  value: any
) => Promise<boolean>;
type OnExecute = (device: string, command: string) => Promise<any>;

function* extractFullNamesFromInputsGen(
  inputs: InputMapping,
  inputDefinitions: InputDefinitionMapping,
  published: PublishedDevices
) {
  const inputNames = Object.keys(inputs);
  for (const name of inputNames) {
    const inputDefinition = inputDefinitions[name];
    const input = inputs[name];
    const { type, repeat } = inputDefinition;

    if (type === "attribute") {
      const {
        device: definitionDevice,
        attribute: definitionAttribute
      } = inputDefinition as AttributeInputDefinition;

      const { device: inputDevice, attribute: inputAttribute } = input;
      const attribute = definitionAttribute || inputAttribute;
      const resolvedDevice = resolveDevice(
        published,
        inputDevice,
        definitionDevice
      );

      if (resolvedDevice != null && attribute != null) {
        yield `${resolvedDevice}/${attribute}`;
      }
    } else if (type === "complex") {
      if (inputDefinition.type === "complex") {
        if (repeat) {
          for (const entry of input) {
            yield* extractFullNamesFromInputsGen(
              entry,
              inputDefinition.inputs,
              published
            );
          }
        } else {
          yield* extractFullNamesFromInputsGen(
            input.inputs,
            inputDefinition.inputs,
            published
          );
        }
      } else {
        throw new Error();
      }
    }
  }
}

function* extractFullNamesFromWidgetsGen(widgets: Widget[]) {
  for (const widget of widgets) {
    const definition = definitionForWidget(widget);
    const inputs = widget.inputs;
    const inputDefinitions = definition!.inputs;
    const published = publishedDevices(inputs, inputDefinitions);
    yield* extractFullNamesFromInputsGen(inputs, inputDefinitions, published);
  }
}

export function extractFullNamesFromWidgets(widgets: Widget[]) {
  return Array.from(extractFullNamesFromWidgetsGen(widgets));
}

function enrichedInput(
  input: any,
  definition: InputDefinition,
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
    const { dataType, dataFormat } = attributeMetadata[fullName];
    const isNumeric = numericTypes.indexOf(dataType) !== -1;

    const history = attributeHistory.hasOwnProperty(fullName)
      ? attributeHistory[fullName]
      : [];
    const values = attributeValues.hasOwnProperty(fullName)
      ? attributeValues[fullName]
      : {};

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
    const output = commandOutputs[fullName];

    return {
      ...input,
      execute: () => onExecute(resolvedDevice, command),
      output
    };
  }

  return input;
}

interface PublishedDevices {
  [variable: string]: string;
}

export function publishedDevices(
  inputs: InputMapping,
  definitions: InputDefinitionMapping
): PublishedDevices {
  const inputNames = Object.keys(inputs);
  return inputNames.reduce((accum, name) => {
    const definition = definitions[name];
    if (definition.type === "device") {
      const { publish } = definition;
      if (publish) {
        const input = inputs[name];
        return { ...accum, [publish]: input };
      }
    }
    return accum;
  }, {});
}

export function enrichedInputs(
  inputs: InputMapping,
  definitions: InputDefinitionMapping,
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
