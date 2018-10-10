import React from "react";

import AttributePlotter from './AttributePlotter';
import AttributeRecorder from './AttributeRecorder';
import AttributeReadOnly from './AttributeReadOnly';
import Label from "./Label";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: AttributeReadOnly,
    fields: ["device", "attribute"],
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

  // {
  //   type: "ATTRIBUTE_RECORDER",
  //   name: "Attribute Recorder",
  //   component: AttributeRecorder,
  //   fields: ["device", "attribute"],
  //   params: [
  //     {
  //       name: "numShow",
  //       type: "number",
  //       default: 5,
  //       description: "№ Entries"
  //     }
  //   ]
  // },
  
  {
    type: "ATTRIBUTE_PLOTTER",
    name: "Attribute plotter",
    component: AttributePlotter,
    fields: ["device", "attribute"],
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
    ]
  }
];

// Remove from here, use utils.js
export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}
