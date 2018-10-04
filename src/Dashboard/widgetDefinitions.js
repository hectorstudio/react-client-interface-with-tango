import React from "react";

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({
      device,
      attribute,
      libraryMode,
      editMode,
      value,
      params: { scientific, showDevice, showAttribute }
    }) => {
      const displayValue =
        value == null
          ? "-"
          : scientific
            ? Number(value).toExponential(2)
            : value;

      const deviceLabel = device || <i>device</i>;
      const attributeLabel = attribute || <i>attribute</i>;
      const labels = (showDevice ? [deviceLabel] : []).concat(
        showAttribute ? [attributeLabel] : []
      );
      const label =
        labels.length === 2 ? (
          <span>
            {deviceLabel}/{attributeLabel}
          </span>
        ) : (
          labels
        );

      return (
        <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
          {label}
          {showDevice || showAttribute ? ": " : ""}
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
    type: "MOTOR_CONTROL",
    name: "Motor Control",
    component: ({ value, libraryMode, editMode }) => {
      const buttonStyle = { fontSize: "small", padding: "0.5em", width: "2em" };
      const buttonStyle2 = { ...buttonStyle, marginLeft: "-1px" };
      return (
        <div>
          <button style={buttonStyle} className="fa fa-plus" />
          <button style={buttonStyle2} className="fa fa-minus" />{" "}
          <span>Position: </span>
          <span>{libraryMode || editMode ? <i>position</i> : value}</span>
        </div>
      );
    },
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
