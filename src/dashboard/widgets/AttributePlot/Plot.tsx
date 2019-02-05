import React, { Component } from "react";
import Plotly from "react-plotly.js";

export interface IPlotParams {
  height: number;
  width: number;
  staticMode?: boolean;
  timeWindow: number;
  showZeroLine?: boolean;
}

export interface ITrace {
  x?: number[];
  y?: number[];
  model: string;
  axisLocation: "left" | "right";
}

interface IPlotProps {
  traces: ITrace[];
  params: IPlotParams;
}

export default class Plot extends Component<IPlotProps> {
  public render() {
    const { params } = this.props;
    const { staticMode, width, height, showZeroLine } = params;

    const { data, range } = this.dataAndRange();
    const xaxis = {
      range,
      title: "Time (s)",
      titlefont: { size: 12 },
      zeroline: false
    };

    const zeroline = showZeroLine !== false;
    const hasRight = data.find(({ yaxis }) => yaxis === "y2") != null;
    const hasLeft = hasRight === false || data.find(({ yaxis }) => yaxis === "y1") != null;

    const addY1 = hasLeft
      ? {
          yaxis: {
            side: "left",
            showgrid: false,
            zeroline
          }
        }
      : {};
    const addY2 = hasRight
      ? {
          yaxis2: {
            side: "right",
            overlaying: "y",
            showgrid: false,
            zeroline
          }
        }
      : {};

    const layout = {
      font: { family: "Helvetica, Arial, sans-serif" },
      xaxis,
      margin: {
        l: 30,
        r: 30,
        t: 15,
        b: 35
      },
      width,
      height,
      showlegend: true,
      legend: {
        y: 1.2,
        orientation: "h"
      },
      ...addY1,
      ...addY2
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

  private dataAndRange() {
    const { traces, params } = this.props;

    const { timeWindow } = params;
    const data = traces.map((trace: ITrace) => {
      const yaxis = trace.axisLocation === "left" ? "y1" : "y2";
      return {
        x: trace.x || [null],
        y: trace.y || [null],
        name: trace.model,
        yaxis
      };
    });

    const latestX = traces
      .map(({ x }) => x)
      .filter(x => x != null)
      .map(x => (x == null || x.length === 0 ? [0] : x))
      .reduce((all, x) => [...all, ...x], [])
      .reduce((x1, x2) => Math.max(x1, x2), 0);

    const offset = Math.max(0, latestX - timeWindow);
    const range = [offset, offset + timeWindow];
    return { data, range };
  }
}
