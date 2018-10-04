import React from "react";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({ value, params: { scientific } }) => (
      <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
        {scientific ? Number(value).toExponential(2) : value}
      </div>
    ),
    libraryProps: {
      value: 0,
      params: {}
    },
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false
      }
    ]
  },

  {
    type: "MOTOR_CONTROL",
    name: "Motor Control",
    component: ({ value }) => (
      <div>
        <button>+</button>
        <button>-</button> <span>Position: </span>
        <span>{value}</span>
      </div>
    ),
    libraryProps: {
      value: 0
    },
    params: []
  },

  {
    type: "LABEL",
    name: "Label",
    component: ({ params: { text } }) => (
      <div style={{ border: "1px solid gray" }}>{text || "(Empty)"}</div>
    ),
    libraryProps: {
      params: { text: "Your Text Here" }
    },
    params: [
      {
        name: "text",
        type: "string",
        default: ""
      }
    ]
  }
];

export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}
