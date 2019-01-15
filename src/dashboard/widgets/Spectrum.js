import React, { Component } from "react";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";

const Spectrum = ({
  mode,
  value,
  params: { showGrid, Title, height, width }
}) => {

  const plotterSampleValues = [{
    y: [2,8,12,1,9],
    mode: "lines",
    line: {
      color: 'rgb(219, 64, 82)'
    }
  }];

    const liveMode = mode !== "edit" && mode !== "library";

    const realData = [
        {
        y: value && value[0], 
        mode: "lines",
        line: {
          color: 'rgb(219, 64, 82)'
        }
      }];
    
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
          width: width + "px",
          height: height + "px"
        }}
      >
        <Plot data={liveMode ? realData : plotterSampleValues} layout={layout} />
      </div>
    );
  }


Spectrum.propTypes = {
  attribute: PropTypes.string,
  device: PropTypes.string,
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

export default Spectrum;