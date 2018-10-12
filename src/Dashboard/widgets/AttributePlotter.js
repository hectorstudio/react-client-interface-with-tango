import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  YAxis,
  XAxis,
  Label
} from "recharts";

import { roundToGrid, expandToGrid } from '../Dashboard';

const plotterSampleValues = Array(100)
  .fill(0)
  .map((_, i) => ({
    value:
      Math.sin((i / 100) * Math.PI * 2) - 0.5 * Math.cos((i / 25) * Math.PI * 2)
  }));

export default class AttributePlotter extends React.Component {
  constructor(props) {
    super(props);
    const time = new Date().getTime();
    this.state = {
      values: [],
      startTime: time
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.mode === "edit" || this.props.mode === "library") {
      return;
    }

    const oldValues = this.state.values;
    const startTime = this.state.startTime;
    const newValue = newProps.value;
    //Difference in seconds between "now" and when the plot was created, rounded to one decimal place.
    const newTime =
      Math.round((10 * (new Date().getTime() - startTime)) / 1000) / 10;
    if (oldValues.length === 0 || newValue !== oldValues.slice(-1)[0].value) {
      const values = [...oldValues, { value: newValue, time: newTime }];
      this.setState(...this.state, { values });
    }
  }

  render() {
    const liveMode = this.props.mode !== "edit" && this.props.mode !== "library";
    const values = liveMode ? this.state.values : plotterSampleValues;

    const {nbrDataPoints, width, height, showGrid, yAxisLabel, strokeWidth} = this.props.params;
    const lastValues = nbrDataPoints === 0 ? [] : values.slice(-nbrDataPoints);
    return (
      <div
        style={{
          border: "1px solid lightgray",
          padding: "0.25em",
          fontSize: "small",
          width: expandToGrid(width) + "px",
          height: expandToGrid(height) + "px",
        }}
      >
        <LineChart data={lastValues} width={width} height={height}>
            {liveMode && <XAxis dataKey="time">
              <Label  offset={-3} position="insideBottom" value="Δs"/>
            </XAxis>}
            <YAxis> 
              {liveMode && <Label angle={-90} position="insideLeft" value={yAxisLabel}/> }
            </YAxis>
            {liveMode && <Tooltip/>}
            {showGrid && <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="5 5" /> }
            <Line dot={false} isAnimationActive={false} type='linear' dataKey="value" strokeWidth={strokeWidth} stroke="#ff7300" yAxisId={0}/>
          </LineChart>
      </div>
    );
  }
}
