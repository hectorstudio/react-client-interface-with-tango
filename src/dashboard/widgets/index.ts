import attributeDisplay from "./AttributeDisplay";
import attributeWriter from "./AttributeWriter";
import attributePlot from "./AttributePlot";
import label from "./Label";
import spectrum from "./Spectrum";
import commandExecutor from "./CommandExecutor";
import attributeDial from "./AttributeDial";

import { Widget, WidgetDefinition } from "../types";

export const bundles = [
  label,
  attributeDisplay,
  attributeWriter,
  attributePlot,
  spectrum,
  commandExecutor,
  attributeDial
];

function bundleForType(type: string) {
  return bundles.find(bundle => bundle.definition.type === type);
}

export function definitionForType(type: string): WidgetDefinition {
  const bundle = bundleForType(type)!;
  return bundle.definition;
}

export function componentForType(type: string) {
  const bundle = bundleForType(type)!;
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
