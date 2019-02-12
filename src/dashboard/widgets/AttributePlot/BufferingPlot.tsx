import React, { Component } from "react";
import Plot, { PlotParams } from "./Plot";

interface BufferingPlotProps {
  fullNames: string[];
  values: number[];
  params: PlotParams;
  axes: Array<"left" | "right">
}

type Coord = [number, number];

interface Buffer {
  [fullName: string]: Coord[];
}

interface BufferingPlotState {
  t0: number;
  buffer: Buffer;
}

// A new value will be buffered if there have been no new values in IDLE_TIMEOUT seconds
const IDLE_TIMEOUT = 10;

export default class BufferingPlot extends Component<
  BufferingPlotProps,
  BufferingPlotState
> {
  public constructor(props: BufferingPlotProps) {
    super(props);

    const t0 = new Date().getTime() / 1000;
    const buffer = props.fullNames.reduce((accum: Buffer, fullName, i) => {
      const value = this.props.values[i];
      const init = value === undefined ? [] : [[0, value]];
      return { ...accum, [fullName]: init };
    }, {});

    this.state = { t0, buffer };
  }

  public componentDidUpdate(prevProps) {
    const buffer = this.props.fullNames.reduce((accum, fullName, i) => {
      const value = this.props.values[i];
      const time = new Date().getTime() / 1000 - this.state.t0;
      const oldSequence = accum[fullName] || [];
      
      if (this.shouldBuffer(oldSequence, time, value)) {  
        const newCoord: Coord = [time, value];
        const newSequence = [...oldSequence, newCoord ];
        return { ...accum, [fullName]: newSequence };
      } else {
        return accum;
      }
    }, this.state.buffer);

    if (buffer !== this.state.buffer) {
      this.setState({ buffer });
    }
  }

  public render() {
    const traces = this.props.fullNames.map((fullName, i) => {
      const buffer = this.state.buffer[fullName];
      const axis = this.props.axes[i];
      const x = buffer.map(entry => entry[0]);
      const y = buffer.map(entry => entry[1]);
      return {
          x,
          y,
          fullName,
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

  private shouldBuffer(sequence: Coord[], time: number, value: number) {
    if (sequence.length === 0) {
      return true;
    }

    const [latestTime, latestValue] = sequence.slice(-1)[0];
    const deltaT = time - latestTime;
    if (deltaT > IDLE_TIMEOUT) {
      return true;
    }

    return latestValue !== value;
  }
}
