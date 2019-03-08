import React, { Component } from "react";

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
      const actualAttributes = attributes.map(({ attribute }) => attribute);
      const nonEmptyHistories = actualAttributes
        .map(({ history }) => history)
        .filter(history => history.length > 0);

      const t0 =
        nonEmptyHistories.length === 0
          ? 0
          : nonEmptyHistories
              .map(history => history[0].timestamp)
              .reduce((t1, t2) => Math.min(t1, t2));

      const traces = attributes.map(attributeInput => {
        const { history, device, attribute } = attributeInput.attribute;
        const fullName = `${device}/${attribute}`;

        let x: number[] = [];
        let y: number[] = [];

        if (history.length > 0) {
          x = history.map(({ timestamp }) => timestamp - t0);
          y = history.map(({ value }) => value);
        }

        return { fullName, x, y, axisLocation: attributeInput.yAxis };
      });

      return <Plot traces={traces} params={runParams} />;
    }

    if (mode === "library") {
      const xValues = Array(120)
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
}

export default AttributePlot;
