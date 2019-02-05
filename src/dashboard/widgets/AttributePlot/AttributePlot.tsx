import React, { Component } from "react";

import BufferingPlot from "./BufferingPlot";
import Plot, { Trace } from "./Plot";

import { WidgetProps } from "../types";
import { AttributeInput } from "../../types";

interface State {
  local: Record<string, number[]>;
}

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

class AttributePlot extends Component<Props, State> {
  public constructor(props) {
    super(props);
    this.state = { local: {} };
  }

  public render() {
    const { mode, inputs, actualWidth, actualHeight } = this.props;
    const { attributes, timeWindow, showZeroLine } = inputs;

    const runParams = {
      width: actualWidth,
      height: actualHeight,
      timeWindow,
      showZeroLine
    };

    const staticParams = { ...runParams, staticMode: true };

    if (mode === "run") {
      const axes = attributes.map(({ yAxis }) => yAxis);
      const singleAttributes = attributes.map(({ attribute }) => attribute);
      const values = singleAttributes.map(({ value }) => value);
      const models = singleAttributes.map(
        ({ device, attribute }) => `${device}/${attribute}`
      );

      return (
        <BufferingPlot
          params={runParams}
          values={values}
          models={models}
          axes={axes}
        />
      );
    }

    if (mode === "library") {
      const xValues = Array(120)
        .fill(0)
        .map((_, i) => i);
      const sample1 = xValues.map(x => 8 * Math.sin(x / 6) * Math.sin(x / 20));
      const sample2 = xValues.map(x => 5 * Math.cos(x / 20) * Math.cos(x / 3));
      const traces: Trace[] = [
        {
          model: "attribute 1",
          x: xValues,
          y: sample1,
          axisLocation: "left"
        },
        {
          model: "attribute 2",
          x: xValues,
          y: sample2,
          axisLocation: "left"
        }
      ];

      return <Plot traces={traces} params={{ ...staticParams, height: 200 }} />;
    } else {
      const traces = attributes.map(attributeInput => {
        const { device, attribute } = attributeInput.attribute;
        const model = `${device || "?"}/${attribute || "?"}`;
        const trace: Trace = { model, axisLocation: attributeInput.yAxis };
        return trace;
      });

      return <Plot traces={traces} params={staticParams} />;
    }
  }
}

export default AttributePlot;
