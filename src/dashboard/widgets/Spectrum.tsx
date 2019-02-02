import React, { Component } from "react";
import Plotly from "react-plotly.js";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

// prettier-ignore
const sampleData = [0, -2, 3, -2, 1, -5, 4, -3, -2, -4, 0, -4, 2, 2, -2, -2, 2, -5, -2, -3, 0];

interface IState {
  min?: number;
  max?: number;
}

class Spectrum extends Component<IWidgetProps, IState> {
  public constructor(props: IWidgetProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate() {
    if (this.props.mode !== "run") {
      return;
    }

    const { value } = this.props.inputs.attribute;
    const { min: currMin, max: currMax } = this.state;

    const propMin = value.reduce((a, b) => Math.min(a, b));
    const propMax = value.reduce((a, b) => Math.max(a, b));
    const min = currMin == null ? propMin : Math.min(currMin, propMin);
    const max = currMax == null ? propMax : Math.max(currMax, propMax);

    if (min !== currMin || max !== currMax) {
      this.setState({ min, max });
    }
  }

  public render() {
    const { mode, inputs } = this.props;
    const { attribute, showTitle, inelastic } = inputs;
    const title =
      showTitle === false
        ? null
        : mode === "library"
        ? "device/attribute"
        : `${attribute.device || "?"}/${attribute.attribute || "?"}`;

    const y =
      mode === "run" ? attribute.value : mode === "library" ? sampleData : [];
    const data = [{ y }];
    const yaxis = this.yAxis(inelastic);

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
      height: mode !== "library" ? this.props.actualHeight : 200,
      yaxis
    };

    return (
      <div>
        <Plotly
          data={data}
          layout={layout}
          config={{ staticPlot: true }}
          responsive={true}
        />
      </div>
    );
  }

  private yAxis(inelastic: boolean): { range: [number, number] } | {} {
    const { min, max } = this.state;
    if (inelastic && min != null && max != null) {
      return {
        range: [1.25 * min, 1.25 * max]
      };
    } else {
      return {};
    }
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
    },
    inelastic: {
      type: "boolean",
      label: "Inelastic Y Axis",
      default: true
    }
  }
};

export default { component: Spectrum, definition };
