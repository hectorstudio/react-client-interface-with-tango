import attributeDisplayWidget from "./AttributeDisplay";
import attributePlot from "./AttributePlot";
import { IWidget } from "../types";

export const bundles = [attributeDisplayWidget, attributePlot];

function bundleForType(type: string) {
  return bundles.find(bundle => bundle.definition.type === type);
}

export function definitionForWidget(widget: IWidget) {
  const bundle = bundleForType(widget.type);
  return bundle && bundle.definition;
}

export function componentForWidget(widget: IWidget) {
  const bundle = bundleForType(widget.type);
  return bundle && bundle.component;
}