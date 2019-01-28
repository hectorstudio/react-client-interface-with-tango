import React from "react";
import { IWidgetDefinition } from "../types";

const Inner = ({ mode, text }) => {
  if (mode === "library") {
    return "Label";
  }

  if (text === "" && mode === "edit") {
    return <span style={{ fontStyle: "italic" }}>Empty</span>;
  }

  return text;
};

const Label = ({ mode, inputs }) => (
  <div style={{ padding: "0.5em" }}>
    <Inner mode={mode} text={inputs.text} />
  </div>
);

const definition: IWidgetDefinition = {
  type: "LABEL",
  name: "Label",
  defaultHeight: 2,
  defaultWidth: 10,
  inputs: {
    text: {
      label: "Text",
      type: "string",
      default: ""
    }
  }
};

export default { definition, component: Label };
