import { definitionForWidget } from "../widgets";
import {
  Widget,
  InputDefinitionMapping,
  InputMapping,
  AttributeInputDefinition
} from "../types";
import { PublishedDevices, resolveDevice, publishedDevices } from "./utils";

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

function* extractDeviceNamesFromInputsGen(
  inputs: InputMapping,
  inputDefinitions: InputDefinitionMapping
) {
  const inputNames = Object.keys(inputs);
  for (const name of inputNames) {
    const inputDefinition = inputDefinitions[name];
    const input = inputs[name];
    const { type, repeat } = inputDefinition;

    if (type === "device" && input != null) {
      yield input;
    } else if (type === "complex") {
      if (inputDefinition.type === "complex") {
        if (repeat) {
          for (const entry of input) {
            yield* extractDeviceNamesFromInputsGen(
              entry,
              inputDefinition.inputs
            );
          }
        } else {
          yield* extractDeviceNamesFromInputsGen(
            input.inputs,
            inputDefinition.inputs
          );
        }
      } else {
        throw new Error();
      }
    }
  }
}

function* extractDeviceNamesFromWidgetsGen(widgets: Widget[]) {
  for (const widget of widgets) {
    const definition = definitionForWidget(widget);
    const inputs = widget.inputs;
    const inputDefinitions = definition!.inputs;
    yield* extractDeviceNamesFromInputsGen(inputs, inputDefinitions);
  }
}

export function extractDeviceNamesFromWidgets(widgets: Widget[]) {
  return Array.from(extractDeviceNamesFromWidgetsGen(widgets));
}
