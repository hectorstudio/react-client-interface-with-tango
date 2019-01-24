import { IInputDefinitionMapping, IInputMapping, IWidget, IInputDefinition } from "src/dashboard/types";
import { definitionForWidget } from "src/dashboard/newWidgets";

function* extractModelsFromInputsGen(
  inputs: IInputMapping,
  inputDefinitions: IInputDefinitionMapping
) {
  const inputNames = Object.keys(inputs);
  for (const name of inputNames) {
    const inputDefinition = inputDefinitions[name];
    const input = inputs[name];
    const { type, repeat } = inputDefinition;

    if (type === "attribute") {
      const { device, attribute } = input;
      if (device != null && attribute != null) {
        yield `${device}/${attribute}`;
      }
    } else if (type === "complex") {
      if (inputDefinition.type === "complex") {
        if (repeat) {
          for (const entry of input) {
            yield* extractModelsFromInputsGen(entry, inputDefinition.inputs);
          }
        } else {
          yield* extractModelsFromInputsGen(
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

function* extractModelsFromWidgetsGen(widgets: IWidget[]) {
  for (const widget of widgets) {
    const definition = definitionForWidget(widget);
    const inputs = widget.inputs;
    const inputDefinitions = definition!.inputs;
    yield* extractModelsFromInputsGen(inputs, inputDefinitions);
  }
}

export function extractModelsFromWidgets(widgets: IWidget[]) {
  return Array.from(extractModelsFromWidgetsGen(widgets));
}

function enrichedInput(input: any, definition: IInputDefinition, lookup: object) {
  if (definition.repeat) {
    return input.map(entry => enrichedInput(entry, {...definition, repeat: false}, lookup));
  }
  
  if (definition.type === "attribute") {
    const {device, attribute} = input;
    const model = `${device}/${attribute}`;
    
    if (lookup.hasOwnProperty(model)) {
      const value = lookup[model];
      return {...input, value };
    }
  }

  if (definition.type === "complex") {
    return enrichedInputs(input, definition.inputs, lookup);
  }

  return input;
}

export function enrichedInputs(inputs: IInputMapping, definitions: IInputDefinitionMapping, lookup: object) {
  const names = Object.keys(inputs);
  return names.reduce((accum, name) => {
    const subInput = inputs[name];
    const subDefinition = definitions[name];
    const value = enrichedInput(subInput, subDefinition, lookup);
    return {...accum, [name]: value};
  }, {});
}