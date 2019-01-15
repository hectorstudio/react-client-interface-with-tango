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
    
    this.state = {
      data: []
    };
  }
  
  componentWillReceiveProps(newProps) {
    if (this.props.mode === "edit" || this.props.mode === "library") {
      return;
    }
      const time = new Date().toLocaleTimeString();
      const data = newProps.value.map((val, i) => {
      return {
        y: this.state.data[i] ? [...this.state.data[i].y.slice(-newProps.params.nbrDataPoints), val] : [val],
        x: this.state.data[i] ? [...this.state.data[i].x.slice(-newProps.params.nbrDataPoints), time] : [time],
        mode: "lines",
        name: newProps.device[i] + "/"+ newProps.attribute[i]
      }
    })
    this.setState(...this.state, { data });
  }

  render() {
    const liveMode =
      this.props.mode !== "edit" && this.props.mode !== "library";

    const {
      nbrDataPoints,
      width,
      height,
      showGrid,
      Title,
      strokeWidth
    } = this.props.params;

    const data0 = [trace1];

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
        <Plot data={liveMode ? this.state.data : data0} layout={layout} />
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
