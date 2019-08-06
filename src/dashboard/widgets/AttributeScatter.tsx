import React from "react";

import { WidgetDefinition, AttributeInput, AttributeInputDefinition } from "../types";
import { WidgetProps } from "./types";

// In order to avoid importing the entire plotly.js library. Note that this mutates the global PlotlyCore object.
import PlotlyCore from "plotly.js/lib/core";
import PlotlyScatter from "plotly.js/lib/scatter";
import createPlotlyComponent from "react-plotly.js/factory";
PlotlyCore.register([PlotlyScatter]);
const Plotly = createPlotlyComponent(PlotlyCore);

type Inputs = {
  independent: AttributeInputDefinition;
  dependent: AttributeInputDefinition;
}

const definition: WidgetDefinition<Inputs> = {
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

type Props = WidgetProps<Inputs>;

// Naive lerp implementation, with fallback to first/last value of unknown is ouside range
function interpolated(xs: number[], ys: number[]) {
  if (xs.length !== ys.length) {
    throw new Error("xs.length != ys.length");
  }

  if (xs.length === 0) {
    throw new Error("xs.length == 0");
  }

  return (input: number) => {
    if (input < xs[0]) {
      return ys[0];
    }

    for (let i = 0; i < xs.length - 1; i++) {
      const currX = xs[i];
      const nextX = xs[i + 1];

      if (input >= currX && input < nextX) {
        const deltaX = nextX - currX;
        if (deltaX !== 0) {
          const w1 = (nextX - input) / deltaX;
          const w2 = (input - currX) / deltaX;
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

// prettier-ignore
const sampleX = [-3.96, -2.6, -2.89, -2.28, -1.19, -1.79, -0.19, 0.76, -0.37, 1.66, 0.83, 2.33, 3.41, 3.91, 4.44, 4.73, 5.15, 4.72];
// prettier-ignore
const sampleY = [-3.59, -3.84, -2.64, -2.28, -2.38, -1.04, -0.99, -0.87, 0.07, 0.15, 1.29, 1.61, 2.35, 2.83, 2.59, 3.11, 4.44, 4.79];

function AttributeScatter(props: Props) {
  const { mode, inputs, actualWidth, actualHeight } = props;
  const staticMode = mode !== "run";
  const height = mode === "library" ? 200 : actualHeight;

  const { dependent, independent } = inputs;
  const independentName =
    mode === "library" ? "attribute 1" : fullName(independent);
  const dependentName =
    mode === "library" ? "attribute 2" : fullName(dependent);

  const defaultRange = mode !== "run" ? { range: [-5, 5] } : {};

  const layout = {
    font: { family: "Helvetica, Arial, sans-serif" },
    width: actualWidth,
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
      titlefont: { size: 12 },
      ...defaultRange
    },
    yaxis: {
      title: dependentName,
      titlefont: { size: 12 },
      ...defaultRange
    }
  };

  let x: number[] = [];
  let y: number[] = [];

  if (mode === "run") {
    const dependentHistory = dependent.history;
    const independentHistory = independent.history;

    if (dependentHistory.length > 0 && independentHistory.length > 0) {
      const fun = interpolated(
        dependentHistory.map(attr => attr.timestamp),
        dependentHistory.map(attr => attr.value)
      );

      x = independentHistory.map(attr => attr.value);
      y = independentHistory.map(attr => fun(attr.timestamp));
    }
  } else if (mode === "library") {
    x = sampleX;
    y = sampleY;
  }

  const data = [
    {
      type: "scatter",
      mode: "markers",
      x,
      y,
      marker: { symbol: "cross" }
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

export default { definition, component: AttributeScatter };
