import React, { Suspense, useState } from "react";

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
  logarithmic?: boolean;
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

function dataAndRange(traces: Trace[], params: PlotParams, mode: String) {
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
  .map(({ x }) => x) //select all the data point arrays of the x axis (more than one in case on multiple plots)
  .map(x => (x === null || x === undefined) ? 0 : x.length) //for each data point array x, replace x with its length
  .reduce((maxLength, currentLength) => Math.max(maxLength, currentLength), 0); //find the max length

  const offset = Math.max(0, latestX - timeWindow);
  let range;
  if (mode === "TIME_WINDOW"){
    range = [offset, offset + timeWindow];
  }else{
    range = [0, latestX]
  }

  return { data, range };
}

export default function Plot(props: PlotProps) {
  const [mode, setMode] = useState("TIME_WINDOW")
  const { traces, params } = props;
  const { staticMode, width, height, showZeroLine, logarithmic } = params;

  const { data, range } = dataAndRange(traces, params, mode);
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
          zeroline,
          type: (logarithmic ? "log" : ""),
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
    autosize: true,
    showlegend: true,
    legend: {
      y: 1.2,
      orientation: "h"
    },
    ...addY1,
    ...addY2
  };

  const overriding = {
    ...addY1,
    ...addY2,
    width,
    height
  };
  return (
    <Suspense fallback={null}>
      <Plotly
        onRelayout={(e:any) =>  e["xaxis.autorange"] ? setMode("HISTORY") : setMode("TIME_WINDOW")}
        data={data}
        layout={{ ...layout, ...overriding }}
        config={{ staticPlot: staticMode === true }}
        responsive={true}
        style={{ width: '100%', height: '100%' }}
      />
    </Suspense>
  );
}
