import React, { Component, Suspense } from "react";

// In order to avoid importing the entire plotly.js library. Note that this mutates the global PlotlyCore object.
import PlotlyCore from "plotly.js/lib/core";
import PlotlyScatter from "plotly.js/lib/scatter";
import createPlotlyComponent from "react-plotly.js/factory";
PlotlyCore.register([PlotlyScatter]);
const Plotly = createPlotlyComponent(PlotlyCore);

export interface PlotParams {
  height: number;
  width: number;
  staticMode?: boolean;
  timeWindow: number;
  showZeroLine?: boolean;
}

export interface Trace {
  x?: number[];
  y?: number[];
  fullName: string;
  axisLocation: "left" | "right";
}

interface PlotProps {
  traces: Trace[];
  params: PlotParams;
}

export default class Plot extends Component<PlotProps> {
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
    const hasLeft =
      hasRight === false || data.find(({ yaxis }) => yaxis === "y1") != null;

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
      <Suspense fallback={null}>
        <Plotly
          data={data}
          layout={layout}
          config={{ staticPlot: staticMode === true }}
          responsive={true}
        />
      </Suspense>
    );
  }

  private dataAndRange() {
    const { traces, params } = this.props;

    const { timeWindow } = params;
    const data = traces.map((trace: Trace) => {
      const yaxis = trace.axisLocation === "left" ? "y1" : "y2";
      return {
        x: trace.x || [null],
        y: trace.y || [null],
        name: trace.fullName,
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
