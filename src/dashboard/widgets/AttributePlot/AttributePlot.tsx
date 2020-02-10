import React from "react";

import Plot, { Trace } from "./Plot";
import { WidgetProps } from "../types";
<<<<<<< HEAD
import { Inputs } from ".";

type Props = WidgetProps<Inputs>;
type AttributeEntries = Props["inputs"]["attributes"];

function AttributePlot(props: Props) {
  const { mode, inputs, actualWidth, actualHeight } = props;
  const { attributes, timeWindow, showZeroLine, logarithmic } = inputs;
=======
import { AttributeInput } from "../../types";

interface AttributeComplexInput {
  attribute: AttributeInput<number>;
  yAxis: "left" | "right";
}

interface InputProps {
  timeWindow: number;
  showZeroLine: boolean;
  attributes: AttributeComplexInput[];
}

type Props = WidgetProps<InputProps>;

function AttributePlot(props: Props) {
  const { mode, inputs, actualWidth, actualHeight } = props;
  const { attributes, timeWindow, showZeroLine } = inputs;
>>>>>>> origin/master

  const runParams = {
    width: actualWidth,
    height: actualHeight,
    timeWindow,
<<<<<<< HEAD
    showZeroLine,
    logarithmic
=======
    showZeroLine
>>>>>>> origin/master
  };

  const staticParams = { ...runParams, staticMode: true };

  if (mode === "run") {
    const traces = tracesFromAttributeInputs(attributes, props.t0);
    return <Plot traces={traces} params={runParams} />;
  }

  if (mode === "library") {
<<<<<<< HEAD
    const xValues = Array(timeWindow)
=======
    const xValues = Array(120)
>>>>>>> origin/master
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

<<<<<<< HEAD
    return <Plot traces={traces} params={{ ...staticParams, height: 150 }} />;
=======
    return <Plot traces={traces} params={{ ...staticParams, height: 200 }} />;
>>>>>>> origin/master
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
<<<<<<< HEAD
  complexInputs: AttributeEntries,
=======
  complexInputs: AttributeComplexInput[],
>>>>>>> origin/master
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

<<<<<<< HEAD

=======
>>>>>>> origin/master
export default AttributePlot;
