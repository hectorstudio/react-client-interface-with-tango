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
  width: number;
  height: number;
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
  staticMode: boolean;
  width: number;
  height: number;
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
        width={this.props.width}
        height={this.props.height}
        staticMode={false}
      />
    );
  }
}

class Plot extends Component<IPlotProps> {
  public render() {
    const { values, models, staticMode, width, height } = this.props;
    const data = models.map((model, i) => {
      return { x: values[i][0], y: values[i][1], name: model };
    });

    const layout = {
      margin: {
        l: 30,
        r: 15,
        t: 15
      },
      width,
      height,
      legend: {
        orientation: "h"
      }
    };

    return (
      <Plotly
        data={data}
        layout={layout}
        config={{ staticPlot: staticMode }}
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
    const { attributes } = inputs;

    const singleAttributes = attributes.map(({ attribute }) => attribute);
    const models = singleAttributes.map(
      ({ device, attribute }) => `${device}/${attribute}`
    );

    if (mode === "run") {
      const values = singleAttributes.map(({ value }) => value);
      return (
        <BufferingPlot
          width={actualWidth}
          height={actualHeight}
          values={values}
          models={models}
        />
      );
    }

    // if (mode === "edit") {
    //   return <Plot values={[]} models={models}/>;
    // }

    const xValues = Array(25)
      .fill(0)
      .map((_, i) => i);
    const sample1 = xValues.map(x => Math.sin(x / 2));
    const sample2 = xValues.map(x => 0.5 * Math.cos(x / 3));
    const sampleValues = [[xValues, sample1], [xValues, sample2]];

    return (
      <Plot
        values={sampleValues}
        models={["test1", "test2"]}
        width={actualWidth}
        height={actualHeight}
        staticMode={true}
      />
    );
  }
}

const definition: IWidgetDefinition = {
  type: "ATTRIBUTE_PLOT",
  name: "Attribute Plot",
  defaultWidth: 30,
  defaultHeight: 30,
  inputs: {
    xMin: {
      type: "number",
      default: 0,
      label: "X min"
    },
    xMax: {
      type: "number",
      default: 100,
      label: "X max"
    },
    yMin: {
      type: "number",
      default: 0,
      label: "Y min"
    },
    yMax: {
      type: "number",
      default: 100,
      label: "Y max"
    },
    showGrid: {
      type: "boolean",
      default: true,
      label: "Show Grid"
    },
    attributes: {
      label: "Graphs",
      type: "complex",
      repeat: true,
      inputs: {
        attribute: {
          label: "Attribute",
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
