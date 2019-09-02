import React from "react";

import Plot, { Trace } from "./Plot";
import { WidgetProps } from "../types";
import { Inputs } from ".";

type Props = WidgetProps<Inputs>;
type AttributeEntries = Props["inputs"]["attributes"];

function AttributePlot(props: Props) {
  const { mode, inputs, actualWidth, actualHeight } = props;
  const { attributes, timeWindow, showZeroLine } = inputs;

  const runParams = {
    width: actualWidth,
    height: actualHeight,
    timeWindow,
    showZeroLine
  };

  const staticParams = { ...runParams, staticMode: true };

  if (mode === "run") {
    const traces = tracesFromAttributeInputs(attributes, props.t0);
    return <Plot traces={traces} params={runParams} />;
  }

  if (mode === "library") {
    const xValues = Array(timeWindow)
      .fill(0)
      .map((_, i) => i);
    const sample1 = xValues.map(x => 8 * Math.sin(x / 6) * Math.sin(x / 20));
    const sample2 = xValues.map(x => 5 * Math.cos(x / 20) * Math.cos(x / 3));
    const traces: Trace[] = [
      {
        fullName: "attribute 1",
        x: xValues,
        y: sample1,
        axisLocation: "left"
      },
      {
        fullName: "attribute 2",
        x: xValues,
        y: sample2,
        axisLocation: "left"
      }
    ];

    return <Plot traces={traces} params={{ ...staticParams, height: 200 }} />;
  } else {
    const traces = attributes.map(attributeInput => {
      const { device, attribute } = attributeInput.attribute;
      const fullName = `${device || "?"}/${attribute || "?"}`;
      const trace: Trace = { fullName, axisLocation: attributeInput.yAxis };
      return trace;
    });

    return <Plot traces={traces} params={staticParams} />;
  }
}

function tracesFromAttributeInputs(
  complexInputs: AttributeEntries,
  t0: number
): Trace[] {
  return complexInputs.map(complexInput => {
    const { attribute: attributeInput, yAxis } = complexInput;
    const { history, device, attribute } = attributeInput;
    const fullName = `${device}/${attribute}`;

    let x: number[] = [];
    let y: number[] = [];

    if (history.length > 0) {
      x = history.map(({ timestamp }) => timestamp - t0);
      y = history.map(({ value }) => value);
    }

    return { fullName, x, y, axisLocation: yAxis };
  });
}


export default AttributePlot;
