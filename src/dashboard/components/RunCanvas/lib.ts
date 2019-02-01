import {
  IInputDefinitionMapping,
  IInputMapping,
  IWidget,
  IInputDefinition,
  IAttributeInputDefinition
} from "src/dashboard/types";
import { definitionForWidget } from "src/dashboard/newWidgets";

function resolveDevice(
  published: IPublishedDevices,
  inputDevice: string,
  definitionDevice?: string
) {
  return definitionDevice && published.hasOwnProperty(definitionDevice)
    ? published[definitionDevice]
    : inputDevice;
}

function* extractModelsFromInputsGen(
  inputs: IInputMapping,
  inputDefinitions: IInputDefinitionMapping,
  published: IPublishedDevices
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
      } = inputDefinition as IAttributeInputDefinition;

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
            yield* extractModelsFromInputsGen(
              entry,
              inputDefinition.inputs,
              published
            );
          }
        } else {
          yield* extractModelsFromInputsGen(
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

function* extractModelsFromWidgetsGen(widgets: IWidget[]) {
  for (const widget of widgets) {
    const definition = definitionForWidget(widget);
    const inputs = widget.inputs;
    const inputDefinitions = definition!.inputs;
    const published = publishedDevices(inputs, inputDefinitions);
    yield* extractModelsFromInputsGen(inputs, inputDefinitions, published);
  }
}

export function extractModelsFromWidgets(widgets: IWidget[]) {
  return Array.from(extractModelsFromWidgetsGen(widgets));
}

function enrichedInput(
  input: any,
  definition: IInputDefinition,
  lookup: object,
  published: { [variable: string]: string }
) {
  if (definition.repeat) {
    return input.map(entry =>
      enrichedInput(entry, { ...definition, repeat: false }, lookup, published)
    );
  }

  if (definition.type === "attribute") {
    const resolvedDevice = resolveDevice(
      published,
      input.device,
      definition.device
    );
    const model = `${resolvedDevice}/${input.attribute || definition.attribute}`;

    if (lookup.hasOwnProperty(model)) {
      const value = lookup[model];
      return { ...input, value };
    }
  }

  if (definition.type === "complex") {
    return enrichedInputs(input, definition.inputs, lookup);
  }

  return input;
}

interface IPublishedDevices {
  [variable: string]: string;
}

export function publishedDevices(
  inputs: IInputMapping,
  definitions: IInputDefinitionMapping
): IPublishedDevices {
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
  inputs: IInputMapping,
  definitions: IInputDefinitionMapping,
  lookup: object
) {
  const published = publishedDevices(inputs, definitions);
  const names = Object.keys(inputs);

  return names.reduce((accum, name) => {
    const subInput = inputs[name];
    const subDefinition = definitions[name];
    const value = enrichedInput(subInput, subDefinition, lookup, published);
    return { ...accum, [name]: value };
  }, {});
}
