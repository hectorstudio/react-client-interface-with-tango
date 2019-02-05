import React, { Component } from "react";
import Plot, { PlotParams } from "./Plot";

interface BufferingPlotProps {
  models: string[];
  values: number[];
  params: PlotParams;
  axes: Array<"left" | "right">
}

type Coord = [number, number];

interface Buffer {
  [model: string]: Coord[];
}

interface BufferingPlotState {
  t0: number;
  buffer: Buffer;
}

export default class BufferingPlot extends Component<
  BufferingPlotProps,
  BufferingPlotState
> {
  public constructor(props: BufferingPlotProps) {
    super(props);

    const t0 = new Date().getTime() / 1000;
    const buffer = props.models.reduce((accum: Buffer, model, i) => {
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
        const newCoord: Coord = [time, value];
        const newSequence = [...oldSequence, newCoord ];
        return { ...accum, [model]: newSequence };
      } else {
        return accum;
      }
    }, this.state.buffer);

    if (buffer !== this.state.buffer) {
      this.setState({ buffer });
    }
  }

  public render() {
    const traces = this.props.models.map((model, i) => {
      const buffer = this.state.buffer[model];
      const axis = this.props.axes[i];
      const x = buffer.map(entry => entry[0]);
      const y = buffer.map(entry => entry[1]);
      return {
          x,
          y,
          model,
          axisLocation: axis
      };
    });

    return (
      <Plot
        traces={traces}
        params={this.props.params}
      />
    );
  }
}
