import React from "react";
import { WidgetDefinition } from "../types";

const Inner = ({ mode, text }) => {
  if (mode === "library") {
    return "Label";
  }

  if (text === "" && mode === "edit") {
    return <span style={{ fontStyle: "italic" }}>Empty</span>;
  }

  return text;
};

const Label = ({ mode, inputs, actualWidth, actualHeight }) => {
  const { text, backgroundColor } = inputs;
  return (
    <div
      style={{
        padding: "0.5em",
        backgroundColor,
        wordBreak: "break-word",
        height: actualHeight,
        width: actualWidth
      }}
    >
      <Inner mode={mode} text={text} />
    </div>
  );
};

const definition: WidgetDefinition = {
  type: "LABEL",
  name: "Label",
  defaultHeight: 2,
  defaultWidth: 10,
  inputs: {
    text: {
      label: "Text",
      type: "string",
      default: ""
    },
    backgroundColor: {
      label: "Background Color",
      type: "color",
      default: "#ffffff"
    }
  }
};

export default { definition, component: Label };
