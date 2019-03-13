import React, { Component } from "react";
import Plotly from "react-plotly.js";

import { WidgetDefinition, AttributeInput } from "src/dashboard/types";
import { WidgetProps } from "./types";

const definition: WidgetDefinition = {
  type: "ATTRIBUTE_SCATTER",
  name: "Attribute Scatter",
  defaultWidth: 30,
  defaultHeight: 20,
  inputs: {
    independent: {
      label: "Independent Attribute",
      type: "attribute",
      required: true,
      dataFormat: "scalar",
      dataType: "numeric"
    },
    dependent: {
      label: "Dependent Attribute",
      type: "attribute",
      required: true,
      dataFormat: "scalar",
      dataType: "numeric"
    }
  }
};

interface Inputs {
  independent: AttributeInput<number>;
  dependent: AttributeInput<number>;
}

type Props = WidgetProps<Inputs>;

function interpolated(xs: number[], ys: number[]) {
  return (input: number) => {
    if (input < xs[0]) {
      return ys[0];
    }

    for (let i = 0; i < xs.length - 1; i++) {
      const currX = xs[i];
      const nextX = xs[i + 1];
      const deltaX = nextX - currX;

      if (input >= currX && input <= nextX) {
        if (deltaX !== 0) {
          const w1 = (input - currX) / deltaX;
          const w2 = (nextX - input) / deltaX;
          return w1 * ys[i] + w2 * ys[i + 1];
        } else {
          return ys[i];
        }
      }
    }

    return ys[ys.length - 1];
  };
}

function fullName(attribute: AttributeInput) {
  return `${attribute.device || "?"}/${attribute.attribute || "?"}`;
}

class AttributeScatter extends Component<Props> {
  public render() {
    const { mode, inputs } = this.props;
    const staticMode = mode !== "run";
    const height = mode === "library" ? 200 : this.props.actualHeight;

    const { dependent, independent } = inputs;
    const independentName =
      mode === "library" ? "attribute 1" : fullName(independent);
    const dependentName =
      mode === "library" ? "attribute 2" : fullName(dependent);

    const layout = {
      font: { family: "Helvetica, Arial, sans-serif" },
      width: this.props.actualWidth,
      height,
      margin: {
        l: 45,
        r: 15,
        t: 15,
        b: 35
      },
      hovermode: "closest",
      xaxis: {
        title: independentName,
        titlefont: { size: 12 }
      },
      yaxis: {
        title: dependentName,
        titlefont: { size: 12 }
      }
    };

    const dependentHistory = dependent.history || [];
    const independentHistory = independent.history || [];

    const fun = interpolated(
      dependentHistory.map(attr => attr.timestamp),
      dependentHistory.map(attr => attr.value)
    );

    const x = independentHistory.map(attr => attr.value);
    const y = independentHistory.map(attr => fun(attr.timestamp));

    const data = [
      {
        type: "scatter",
        mode: "markers",
        x,
        y
      }
    ];

    return (
      <Plotly
        data={data}
        layout={layout}
        config={{ staticPlot: staticMode === true }}
        responsive={true}
      />
    );
  }
}

export default { definition, component: AttributeScatter };
