import React, { Component } from "react";
import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class AttributePlot extends Component<IWidgetProps> {
  public render() {
    return <div>Input: <pre>{JSON.stringify(this.props.inputs)}</pre></div>;
  }
}

const definition: IWidgetDefinition = {
  type: "ATTRIBUTE_PLOT",
  name: "Attribute Plot",
  defaultWidth: 5,
  defaultHeight: 2,
  inputs: {
    xMin: {
      type: "number",
      default: 0,
      label: "X min"
    },
    xMax: {
      type: "number",
      default: 100,
      label: "X max"
    },
    yMin: {
      type: "number",
      default: 0,
      label: "Y min"
    },
    yMax: {
      type: "number",
      default: 100,
      label: "Y max"
    },
    showGrid: {
      type: "boolean",
      default: true,
      label: "Show Grid"
    },
    attributes: {
      label: "Graphs",
      type: "complex",
      repeat: true,
      inputs: {
        attribute: {
          label: "Attribute",
          type: "attribute",
          required: true,
          dataFormat: "scalar",
          dataType: "numeric"
        },
        strokeStyle: {
          type: "select",
          default: "line",
          label: "Stroke Style",
          options: [
            {
              name: "Line",
              value: "line"
            },
            {
              name: "Dashed",
              value: "dashed"
            }
          ]
        },
        strokeWidth: {
          type: "number",
          default: 1,
          label: "Stroke Width"
        }
      }
    }
  }
};

export default { component: AttributePlot, definition };
