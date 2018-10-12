import React, { Component } from "react";

function randomNumber(limit) {
  return Math.floor(Math.random() * limit);
}

const recorderSampleValues = Array(100)
  .fill(0)
  .map((_, i) => ({
    h: randomNumber(24),
    m: randomNumber(60),
    s: randomNumber(60),
    value: i
  }));

export default class AttributeRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.mode === "edit" || this.props.mode === "library") {
      return;
    }

    const oldValues = this.state.values;
    const newValue = newProps.value;
    if (oldValues.length === 0 || newValue !== oldValues.slice(-1)[0].value) {
      const now = new Date();
      const values = [
        ...oldValues,
        {
          value: newValue,
          h: now.getHours(),
          m: now.getMinutes(),
          s: now.getSeconds()
        }
      ];
      this.setState({ values });
    }
  }

  padZero(num) {
    const s = String(num);
    return (s.length === 1 ? "0" : "") + s;
  }

  render() {
    const values =
      this.props.mode === "edit" || this.props.mode === "library"
        ? recorderSampleValues
        : this.state.values;

    const numShow = this.props.params.numShow;
    const lastValues = numShow === 0 ? [] : values.slice(-numShow);
    const numHiding = values.length - lastValues.length;

    return (
      <div
        style={{
          border: "1px solid lightgray",
          padding: "0.25em",
          fontSize: "small"
        }}
      >
        <table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {lastValues.map(({ h, m, s, value }, i) => (
              <tr key={i}>
                <td style={{ paddingRight: "0.5em" }}>
                  {this.padZero(h)}:{this.padZero(m)}:{this.padZero(s)}
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {values.length === 0 && <div>No values recorded.</div>}
      </div>
    );
  }
}
