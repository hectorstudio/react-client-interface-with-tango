import attributeDisplayWidget from "./AttributeDisplay";
import attributePlot from "./AttributePlot";
import label from "./Label";
import spectrum from "./Spectrum";
import simpleMotor from "./SimpleMotor";

import {
  IWidget,
  IWidgetDefinition,
  IndexPath,
  IInputDefinition,
  IInputDefinitionMapping,
  IComplexInputDefinition
} from "../types";

export const bundles = [
  label,
  attributeDisplayWidget,
  attributePlot,
  spectrum,
  simpleMotor
];

function bundleForType(type: string) {
  return bundles.find(bundle => bundle.definition.type === type);
}

export function definitionForType(type: string): IWidgetDefinition {
  const bundle = bundleForType(type)!;
  return bundle.definition;
}

export function componentForType(type: string) {
  const bundle = bundleForType(type)!;
  return bundle.component;
}

export function bundleForWidget(widget: IWidget) {
  return bundleForType(widget.type);
}

export function definitionForWidget(widget: IWidget) {
  return definitionForType(widget.type);
}

export function componentForWidget(widget: IWidget) {
  return componentForType(widget.type);
}
