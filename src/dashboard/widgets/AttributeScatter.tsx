import React from "react";
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

// prettier-ignore
const sampleX = [1.04, 2.4, 2.11, 2.72, 3.81, 3.21, 4.81, 5.76, 4.63, 6.66, 5.83, 7.33, 8.41, 8.91, 9.44, 9.73, 10.15, 9.72];
// prettier-ignore
const sampleY = [1.41, 1.16, 2.36, 2.72, 2.62, 3.96, 4.01, 4.13, 5.07, 5.15, 6.29, 6.61, 7.35, 7.83, 7.59, 8.11, 9.44, 9.79];

function AttributeScatter(props: Props) {
  const { mode, inputs, actualWidth, actualHeight } = props;
  const staticMode = mode !== "run";
  const height = mode === "library" ? 200 : actualHeight;

  const { dependent, independent } = inputs;
  const independentName =
    mode === "library" ? "attribute 1" : fullName(independent);
  const dependentName =
    mode === "library" ? "attribute 2" : fullName(dependent);

  const defaultRange = mode !== "run" ? { range: [0, 10] } : {};

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
    const dependentHistory = dependent.history || [];
    const independentHistory = independent.history || [];

    const fun = interpolated(
      dependentHistory.map(attr => attr.timestamp),
      dependentHistory.map(attr => attr.value)
    );

    x = independentHistory.map(attr => attr.value);
    y = independentHistory.map(attr => fun(attr.timestamp));
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
