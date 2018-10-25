import React from "react";

import AttributePlotter from "./AttributePlotter";
import AttributeTrend from "./AttributeTrend";
import AttributeRecorder from "./AttributeRecorder";
import AttributeReadOnly from "./AttributeReadOnly";
import Label from "./Label";
import DeviceName from "./DeviceName";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: AttributeReadOnly,
    fields: ["device", { type: "attribute", dataformats: ["SCALAR"] }],
    dataFormats: ["SCALAR"],
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false,
        description: "Sci. Notation"
      },
      {
        name: "showDevice",
        type: "boolean",
        default: false,
        description: "Show Device"
      },
      {
        name: "showAttribute",
        type: "boolean",
        default: true,
        description: "Show Attribute"
      }
    ]
  },

  {
    type: "LABEL",
    name: "Label",
    component: Label,
    fields: [],
    params: [
      {
        name: "text",
        type: "string",
        default: "",
        description: "Text"
      }
    ]
  },

  {
    type: "ATTRIBUTE_PLOTTER",
    name: "Attribute plotter",
    component: AttributePlotter,
    fields: [
      "device",
      { type: "attribute", dataformats: ["SCALAR"], onlyNumeric: true }
    ],
    params: [
      {
        name: "nbrDataPoints",
        type: "number",
        default: 100,
        description: "№ Entries"
      },
      {
        name: "width",
        type: "number",
        default: 300,
        description: "Width (px)"
      },
      {
        name: "height",
        type: "number",
        default: 200,
        description: "Height (px)"
      },
      {
        name: "showGrid",
        type: "boolean",
        default: true,
        description: "Show grid"
      },
      {
        name: "yAxisLabel",
        type: "string",
        default: "",
        description: "Label y-axis"
      },
      {
        name: "strokeWidth",
        type: "number",
        default: 1,
        description: "Stroke width"
      }
    ]
  },
{
    type: "ATTRIBUTE_TREND",
    name: "Attribute trend",
    component: AttributeTrend,
    fields: [
      "device",
      { type: "attribute", dataformats: ["SCALAR"], onlyNumeric: true }
    ],
    params: [
      {
        name: "nbrDataPoints",
        type: "number",
        default: 100,
        description: "№ Entries"
      },
      {
        name: "width",
        type: "number",
        default: 300,
        description: "Width (px)"
      },
      {
        name: "height",
        type: "number",
        default: 200,
        description: "Height (px)"
      },
      {
        name: "showGrid",
        type: "boolean",
        default: true,
        description: "Show grid"
      },
      {
        name: "Title",
        type: "string",
        default: "",
        description: "Title"
      },
      {
        name: "strokeWidth",
        type: "number",
        default: 1,
        description: "Stroke width"
      }
    ]
  },
  {
    type: "DEVICE_NAME",
    name: "Device Name",
    component: DeviceName,
    fields: ["device"],
    params: []
  }
];

// Remove from here, use utils.js
export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}

// This function will be applied to the widget definitions before use in the application.
// So far, it performs the following transformations:

// 1. If an element in definition.fields is a string S, that element is replaced with {type: S}
//    Example: fields: ["device", {type: "attribute"}] -> [{type: "device"}, {type: "attribute"}]

// The rationale is that it allows for more compact and readable widget definitions while still
// allowing expressiveness when needed.

export function normalizeWidgetDefinitions(definitions) {
  function normalizeField(field) {
    return typeof field === "string" ? { type: field } : field;
  }

  function normalizeDefinition(definition) {
    const fields = definition.fields.map(normalizeField);
    return { ...definition, fields };
  }

  return definitions.map(normalizeDefinition);
}
