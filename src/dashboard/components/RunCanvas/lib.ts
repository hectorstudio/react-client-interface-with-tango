import {
  InputDefinitionMapping,
  InputMapping,
  Widget,
  InputDefinition,
  AttributeInputDefinition
} from "src/dashboard/types";
import { definitionForWidget } from "src/dashboard/widgets";

function resolveDevice(
  published: PublishedDevices,
  inputDevice: string,
  definitionDevice?: string
) {
  return definitionDevice && published.hasOwnProperty(definitionDevice)
    ? published[definitionDevice]
    : inputDevice;
}

interface AttributeValues {
  value: any;
  writeValue: any;
}

export type AttributeLookup = Record<string, AttributeValues>;
export type CommandLookup = Record<string, any>;

type OnWrite = (device: string, attribute: string, value: any) => Promise<boolean>;
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
  attributeLookup: AttributeLookup,
  commandLookup: CommandLookup,
  published: { [variable: string]: string },
  onWrite: OnWrite,
  onExecute: OnExecute
) {
  if (definition.repeat) {
    return input.map(entry =>
      enrichedInput(
        entry,
        { ...definition, repeat: false },
        attributeLookup,
        commandLookup,
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

    if (attributeLookup.hasOwnProperty(fullName)) {
      const { value, writeValue } = attributeLookup[fullName];
      return {
        ...input,
        value,
        writeValue,
        write: (param: any) => onWrite(resolvedDevice, attribute, param)
      };
    }
  }

  if (definition.type === "complex") {
    return enrichedInputs(
      input,
      definition.inputs,
      attributeLookup,
      commandLookup,
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
    const output = commandLookup[fullName];

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
  attributeLookup: AttributeLookup,
  commandLookup: CommandLookup,
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
      attributeLookup,
      commandLookup,
      published,
      onWrite,
      onExecute
    );
    return { ...accum, [name]: value };
  }, {});
}
