import attributeDisplay from "./AttributeDisplay";
import attributeWriter from "./AttributeWriter";
import attributePlot from "./AttributePlot";
import attributeScatter from "./AttributeScatter";
import label from "./Label";
import spectrum from "./Spectrum";
import commandExecutor from "./CommandExecutor";
<<<<<<< HEAD
import commandWriter from "./CommandWriter";
import attributeDial from "./AttributeDial";
// import booleanDisplay from "./BooleanDisplay";
import ledDisplay from "./LedDisplay";
import sardanaMotor from "./SardanaMotor/SardanaMotor";
import attributeLogger from "./AttributeLogger/AttributeLogger";
import spectrumTable from "./SpectrumTable";

import { Widget, WidgetDefinition, WidgetBundle } from "../types";
import DeviceStatus from "./DeviceStatus";

export const bundles: WidgetBundle<{}>[] = [
=======
import attributeDial from "./AttributeDial";
// import booleanDisplay from "./BooleanDisplay";
import sardanaMotor from "./SardanaMotor/SardanaMotor";

import { Widget, WidgetDefinition, WidgetBundle } from "../types";

export const bundles: WidgetBundle[] = [
>>>>>>> origin/master
  label,
  attributeDisplay,
  attributeWriter,
  attributePlot,
  attributeScatter,
  spectrum,
  commandExecutor,
<<<<<<< HEAD
  commandWriter,
  attributeDial,
  // booleanDisplay,
  DeviceStatus,
  ledDisplay,
  sardanaMotor,
  attributeLogger,
  spectrumTable,
=======
  attributeDial,
  // booleanDisplay,
  sardanaMotor
>>>>>>> origin/master
];

function bundleForType(type: string) {
  const bundle = bundles.find(bundle => bundle.definition.type === type);

  if (bundle == null) {
    throw new Error(`No bundle for type ${type}`);
  }

  return bundle;
}

<<<<<<< HEAD
export function definitionForType(type: string): WidgetDefinition<{}> {
=======
export function definitionForType(type: string): WidgetDefinition {
>>>>>>> origin/master
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
