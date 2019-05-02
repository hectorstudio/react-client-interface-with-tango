import { InputMapping, InputDefinitionMapping } from "../types";

export function resolveDevice(
  published: PublishedDevices,
  inputDevice: string,
  definitionDevice?: string
) {
  return definitionDevice && published.hasOwnProperty(definitionDevice)
    ? published[definitionDevice]
    : inputDevice;
}

export interface PublishedDevices {
  [variable: string]: string;
}

export function publishedDevices(
  inputs: InputMapping,
  definitions: InputDefinitionMapping
): PublishedDevices {
  const inputNames = Object.keys(inputs);
  const result = {};

  for (const name of inputNames) {
    const definition = definitions[name];
    if (definition.type === "device") {
      const { publish } = definition;

      if (publish == null) {
        continue;
      }

      if (publish[0] !== "$") {
        throw new Error("published names must begin with $");
      }

      const input = inputs[name];
      result[publish] = input;
    }
  }

  return result;
}
