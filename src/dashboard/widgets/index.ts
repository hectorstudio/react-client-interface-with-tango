import attributeDisplay from "./AttributeDisplay";
import attributeWriter from "./AttributeWriter";
import attributePlot from "./AttributePlot";
import AttributeScatter from "./AttributeScatter";
import label from "./Label";
import spectrum from "./Spectrum";
import commandExecutor from "./CommandExecutor";
import attributeDial from "./AttributeDial";
import sardanaMotor from "./sardanaMotor/SardanaMotor";

import { Widget, WidgetDefinition, WidgetBundle } from "../types";

export const bundles: WidgetBundle[] = [
  label,
  attributeDisplay,
  attributeWriter,
  attributePlot,
  AttributeScatter,
  spectrum,
  commandExecutor,
  attributeDial,
  sardanaMotor
];

function bundleForType(type: string) {
  const bundle = bundles.find(bundle => bundle.definition.type === type);

  if (bundle == null) {
    throw new Error(`No bundle for type ${type}`);
  }

  return bundle;
}

export function definitionForType(type: string): WidgetDefinition {
  const bundle = bundleForType(type);
  return bundle.definition;
}

export function componentForType(type: string) {
  const bundle = bundleForType(type);
  return bundle.component;
}

export function bundleForWidget(widget: Widget) {
  return bundleForType(widget.type);
}

export function definitionForWidget(widget: Widget) {
  return definitionForType(widget.type);
}

export function componentForWidget(widget: Widget) {
  return componentForType(widget.type);
}
