import React, { Component } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition, CommandInput } from "../types";
import "./SardanaMotor.css";

class SardanaMotor extends Component<WidgetProps> {
  constructor(props: WidgetProps) {
    super(props);
    this.state = { position: 0 };
    this.handleStop = this.handleStop.bind(this);
  }

  public render() {
    const { inputs, mode } = this.props;
    const { title, upperLimit, lowerLimit, position, powerOn } = inputs;
    const color = { color: "green" };
    if (powerOn) {
      color.color = "red";
    }
    return (
      <div className="sardana-motor">
        <div className="border">
          <div className="row menu">
            <span className="title">{title}</span>
          </div>
          <div className="row">
            <span>Status:</span>
            <span style={color}>
              {mode === "run" ? (powerOn.value ? "Running" : "Stopped") : "-"}
            </span>
            {powerOn.value && (
              <button className="btn-stop" onClick={this.handleStop}>
                Stop
              </button>
            )}
          </div>
          <div className="row">
            <span>Upper limit: </span>{" "}
            <span>{mode === "run" ? upperLimit.value : "-"}</span>
          </div>
          <div className="row">
            <span>Lower limit: </span>{" "}
            <span>{mode === "run" ? lowerLimit.value : "-"}</span>
          </div>
          <div className="row">
            <span>Current position:</span>
            <span>{mode === "run" ? position.value : "-"}</span>
          </div>
          <div className="row">
            <span>Set position:</span>
            <span>[set position]</span>
            <span>[copy current]</span>
          </div>
        </div>
      </div>
    );
  }

  private async handleStop() {
    // const { stop } = this.props.inputs;
    // stop.execute();
  }
}

const definition: WidgetDefinition = {
  type: "SARDANA_MOTOR",
  name: "Sardana motor",
  defaultHeight: 20,
  defaultWidth: 20,
  inputs: {
    device: {
      type: "device",
      publish: "$device"
    },
    title: {
      type: "string",
      label: "Title",
      default: "Motor"
    },
    stop: {
      type: "command",
      device: "$device",
      command: "Stop"
    },
    upperLimit: {
      type: "attribute",
      device: "$device",
      attribute: "StatusLim+"
    },
    lowerLimit: {
      type: "attribute",
      device: "$device",
      attribute: "StatusLim-"
    },
    position: {
      type: "attribute",
      device: "$device",
      attribute: "Position"
    },
    powerOn: {
      type: "attribute",
      device: "$device",
      attribute: "PowerOn"
    }
  }
};

export default { definition, component: SardanaMotor };
