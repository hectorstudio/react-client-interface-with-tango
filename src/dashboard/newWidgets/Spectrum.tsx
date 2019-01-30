import React, { Component } from "react";
import Plotly from "react-plotly.js";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

// prettier-ignore
const sampleData = [0, -2, 3, -2, 1, -5, 4, -3, -2, -4, 0, -4, 2, 2, -2, -2, 2, -5, -2, -3, 0];

class Spectrum extends Component<IWidgetProps> {
  public render() {
    const { mode, inputs } = this.props;
    const { attribute, showTitle } = inputs;
    const title =
      showTitle === false
        ? null
        : mode === "library"
        ? "device/attribute"
        : `${attribute.device || "?"}/${attribute.attribute || "?"}`;

    const y =
      mode === "run" ? attribute.value : mode === "library" ? sampleData : [];
    const data = [{ y }];

    const layout = {
      title,
      titlefont: { size: 12 },
      font: { family: "Helvetica, Arial, sans-serif" },
      margin: {
        l: 30,
        r: 15,
        t: 15 + (showTitle ? 20 : 0),
        b: 20
      },
      width: this.props.actualWidth,
      height: mode !== "library" ? this.props.actualHeight : 200
    };

    return (
      <Plotly
        data={data}
        layout={layout}
        config={{ staticPlot: true }}
        responsive={true}
      />
    );
  }
}

const definition: IWidgetDefinition = {
  type: "SPECTRUM",
  name: "Spectrum",
  defaultWidth: 30,
  defaultHeight: 20,
  inputs: {
    attribute: {
      label: "",
      type: "attribute",
      dataFormat: "spectrum",
      dataType: "numeric",
      required: true
    },
    showTitle: {
      type: "boolean",
      label: "Show Title",
      default: true
    }
  }
};

export default { component: Spectrum, definition };
