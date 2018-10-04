import React from "react";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({ attribute, value, params: { scientific, showName } }) => {
      const displayValue =
        value == null
          ? "-"
          : scientific
            ? Number(value).toExponential(2)
            : value;
      return (
        <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
          {showName && `${attribute}: `}
          {displayValue}
        </div>
      );
    },
    libraryProps: {
      value: 0,
      params: {}
    },
    fields: ["device", "attribute"],
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false,
        description: "Sci. Notation"
      },
      {
        name: "showName",
        type: "boolean",
        default: false,
        description: "Show Name"
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
    fields: ["device"],
    params: []
  },

  {
    type: "LABEL",
    name: "Label",
    component: ({ editMode, params: { text } }) => (
      <div
        style={{
          backgroundColor: "white",
          border: editMode ? "1px dashed gray" : "",
          padding: "0.5em"
        }}
      >
        {text || "(Empty)"}
      </div>
    ),
    libraryProps: {
      params: { text: "Your Text Here" }
    },
    fields: [],
    params: [
      {
        name: "text",
        type: "string",
        default: "",
        description: "Text"
      }
    ]
  }
];

export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}
