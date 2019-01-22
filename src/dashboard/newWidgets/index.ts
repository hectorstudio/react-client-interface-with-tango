import attributeDisplayWidget from "./AttributeDisplay";
import attributePlot from "./AttributePlot";
import { IWidget } from "../types";

export const bundles = [attributeDisplayWidget, attributePlot];

function bundleForType(type: string) {
  return bundles.find(bundle => bundle.definition.type === type);
}

export function definitionForType(type: string) {
  const bundle = bundleForType(type);
  return bundle && bundle.definition;
}

export function componentForType(type: string) {
  const bundle = bundleForType(type);
  return bundle && bundle.component;
}

export function definitionForWidget(widget: IWidget) {
  return definitionForType(widget.type);
}

export function componentForWidget(widget: IWidget) {
  return componentForType(widget.type);
}
