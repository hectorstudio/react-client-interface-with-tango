import { InputDefinition, InputDefinitionMapping } from "./types";

function defaultInput(input: InputDefinition) {
  if (input.type === "attribute") {
    return { device: null, attribute: null };
  } else if (input.type === "command") {
    return { device: null, command: null };
  } else if (input.type === "device") {
    return null;
  } else if (input.type === "complex") {
    if (input.repeat) {
      return [];
    } else {
      return defaultInputs(input.inputs);
    }
  } else {
    return input.default;
  }
}

export function defaultInputs(inputs: InputDefinitionMapping) {
  const inputNames = Object.keys(inputs);
  return inputNames.reduce((accum, name) => {
    const input = inputs[name];
    const value = defaultInput(input);
    return { ...accum, [name]: value };
  }, {});
}
