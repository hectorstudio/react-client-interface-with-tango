import { InputMapping, InputDefinitionMapping } from "../../../types";

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
