import React from "react";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({
      attribute,
      libraryMode,
      editMode,
      value,
      params: { scientific, showName }
    }) => {
      const displayValue =
        value == null
          ? "-"
          : scientific
            ? Number(value).toExponential(2)
            : value;
      return (
        <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
          {showName && attribute ? (
            `${attribute}: `
          ) : (
            <span>
              <i>attribute</i>:{" "}
            </span>
          )}
          {libraryMode || editMode ? <i>value</i> : displayValue}
        </div>
      );
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
        default: true,
        description: "Show Name"
      }
    ]
  },

  {
    type: "MOTOR_CONTROL",
    name: "Motor Control",
    component: ({ value, libraryMode, editMode }) => (
      <div>
        <button>+</button>
        <button>-</button> <span>Position: </span>
        <span>{libraryMode || editMode ? <i>position</i> : value}</span>
      </div>
    ),
    fields: ["device"],
    params: [
      {
        name: "stepSize",
        type: "number",
        default: 0,
        description: "Step Size"
      }
    ]
  },

  {
    type: "LABEL",
    name: "Label",
    component: ({ editMode, libraryMode, params: { text } }) => (
      <div
        style={{
          backgroundColor: "white",
          border: editMode ? "1px dashed gray" : "",
          padding: "0.5em"
        }}
      >
        {text || (editMode || libraryMode ? <i>Your Text Here</i> : null)}
      </div>
    ),
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
