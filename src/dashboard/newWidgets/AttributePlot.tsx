import React, { Component } from "react";
import Plotly from "react-plotly.js";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

interface IState {
  local: { [model: string]: number[] };
}

interface IBufferingPlotProps {
  values: number[];
  models: string[];
  params: IParams;
}

interface IBuffer {
  [model: string]: number[][];
}

interface IBufferingPlotState {
  t0: number;
  buffer: IBuffer;
}

interface IPlotProps {
  values: number[][][];
  models: string[];
  params: IParams;
}

interface IParams {
  height: number;
  width: number;
  staticMode?: boolean;
  timeWindow: number;
}

class BufferingPlot extends Component<
  IBufferingPlotProps,
  IBufferingPlotState
> {
  public constructor(props: IBufferingPlotProps) {
    super(props);

    const t0 = new Date().getTime() / 1000;
    const buffer = props.models.reduce((accum: IBuffer, model, i) => {
      const value = this.props.values[i];
      const init = value === undefined ? [] : [[0, value]];
      return { ...accum, [model]: init };
    }, {});

    this.state = { t0, buffer };
  }

  public componentDidUpdate(prevProps) {
    const buffer = this.props.models.reduce((accum, model, i) => {
      const value = this.props.values[i];
      const oldValue = prevProps.values[i];

      if (value !== oldValue) {
        const oldSequence = accum[model];
        const time = new Date().getTime() / 1000 - this.state.t0;
        return { ...accum, [model]: [...oldSequence, [time, value]] };
      } else {
        return accum;
      }
    }, this.state.buffer);

    if (buffer !== this.state.buffer) {
      this.setState({ buffer });
    }
  }

  public render() {
    const values = this.props.models.map(model => {
      const buffer = this.state.buffer[model];
      const x = buffer.map(entry => entry[0]);
      const y = buffer.map(entry => entry[1]);
      return [x, y];
    });

    return (
      <Plot
        models={this.props.models}
        values={values}
        params={this.props.params}
      />
    );
  }
}

class Plot extends Component<IPlotProps> {
  public render() {
    const { values, models, params } = this.props;
    const { staticMode, width, height, timeWindow } = params;

    const data = models.map((model, i) => {
      return { x: values[i][0], y: values[i][1], name: model };
    });

    const latestX = data
      .map(point => point.x.slice(-1))
      .filter(slice => slice.length === 1)
      .map(slice => slice[0])
      .reduce((x1, x2) => Math.max(x1, x2), 0);

    const offset = Math.max(0, latestX - timeWindow);
    const xaxis = {
      range: [offset, offset + timeWindow],
      title: "Time (s)",
      titlefont: { size: 12 }
    };

    const layout = {
      font: { family: "Helvetica, Arial, sans-serif" },
      xaxis,
      margin: {
        l: 30,
        r: 15,
        t: 15,
        b: 35
      },
      width,
      height,
      showlegend: true,
      legend: {
        y: 1.2,
        orientation: "h"
      }
    };

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

class AttributePlot extends Component<IWidgetProps, IState> {
  public constructor(props) {
    super(props);
    this.state = { local: {} };
  }

  public render() {
    const { mode, inputs, actualWidth, actualHeight } = this.props;
    const { attributes, timeWindow } = inputs;

    const singleAttributes = attributes.map(({ attribute }) => attribute);
    const models = singleAttributes.map(
      ({ device, attribute }) => `${device}/${attribute}`
    );

    const runParams = {
      width: actualWidth,
      height: actualHeight,
      timeWindow
    };
    const staticParams = { ...runParams, staticMode: true };

    if (mode === "run") {
      const values = singleAttributes.map(({ value }) => value);
      return (
        <BufferingPlot params={runParams} values={values} models={models} />
      );
    }

    if (mode === "library") {
      const xValues = Array(120)
        .fill(0)
        .map((_, i) => i);
      const sample1 = xValues.map(x => 8 * Math.sin(x / 6) * Math.sin(x / 20));
      const sample2 = xValues.map(x => 5 * Math.cos(x / 20) * Math.cos(x / 3));
      const sampleValues = [[xValues, sample1], [xValues, sample2]];

      return (
        <Plot
          values={sampleValues}
          models={["attribute 1", "attribute 2"]}
          params={{...staticParams, height: 250}}
        />
      );
    } else {
      const editValues = models.map(() => [[null]]); // [null] tricks Plotly to display the legend even though the trace doesn't contain any points
      const editModels = singleAttributes.map(
        ({ device, attribute }) => `${device || "?"}/${attribute || "?"}`
      );

      return (
        <Plot values={editValues} models={editModels} params={staticParams} />
      );
    }
  }
}

const definition: IWidgetDefinition = {
  type: "ATTRIBUTE_PLOT",
  name: "Attribute Plot",
  defaultWidth: 30,
  defaultHeight: 20,
  inputs: {
    timeWindow: {
      type: "number",
      default: 120,
      label: "Time Window"
    },
    attributes: {
      label: "Graphs",
      type: "complex",
      repeat: true,
      inputs: {
        attribute: {
          label: "",
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
