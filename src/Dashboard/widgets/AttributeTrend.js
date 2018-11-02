import Plot from "react-plotly.js";

import React, { Component } from "react";

import { roundToGrid, expandToGrid } from "../Dashboard";
import PropTypes from "prop-types";

const trace1 = {
  x: [1, 2, 3, 4, 5],
  y: [16, 5, 11, 9, 11],
  mode: "lines"
};
const plotterSampleValues = trace1;

export default class AttributeTrend extends React.Component {
  constructor(props) {
    super(props);
    const time = new Date().getTime();
    this.state = {
      data: { x: [], y: [] },
      startTime: time
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.mode === "edit" || this.props.mode === "library") {
      return;
    }
    const oldValues = this.state.data.y;
    const oldTimes = this.state.data.x;
    const startTime = this.state.startTime;
    const newValue = newProps.value[0];
    //Difference in seconds between "now" and when the plot was created, rounded to one decimal place.
    const newTime = newProps.time[0];
    const data = {
      y: [...oldValues, newValue],
      x: [...oldTimes, newTime]
    };
    this.setState(...this.state, { data });
  }

  render() {
    const liveMode =
      this.props.mode !== "edit" && this.props.mode !== "library";
    const data = liveMode ? this.state.data : plotterSampleValues;

    const {
      nbrDataPoints,
      width,
      height,
      showGrid,
      Title,
      strokeWidth
    } = this.props.params;
    const lastValues = nbrDataPoints === 0 ? [] : data.y.slice(-nbrDataPoints);
    const lastTimes = nbrDataPoints === 0 ? [] : data.x.slice(-nbrDataPoints);

    const data0 = [trace1];
    const trace = [
      {
        x: lastTimes,
        y: lastValues,
        mode: "lines"
      }
    ];
    const layout = {
      width: width,
      height: height - 10,
      title: Title,
      xaxis: { showgrid: showGrid },
      yaxis: { showgrid: showGrid }
    };

    return (
      <div
        style={{
          border: "1px solid lightgray",
          padding: "0.25em",
          fontSize: "small",
          width: expandToGrid(width) + "px",
          height: expandToGrid(height) + "px"
        }}
      >
        <Plot data={liveMode ? trace : data0} layout={layout} />
      </div>
    );
  }
}

AttributeTrend.propTypes = {
  attribute: PropTypes.array,
  device: PropTypes.array,
  mode: PropTypes.string,
  params: PropTypes.shape({
    height: PropTypes.number,
    nbrDataPoints: PropTypes.number,
    showGrid: PropTypes.bool,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
    yAxisLabel: PropTypes.string
  })
};
