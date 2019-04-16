import React, { Component } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition, CommandInput } from "../types";
import "./SardanaMotor.css";
import { QualityIndicatorLabel } from "../../shared/widgets/snippets";
import {PrecisionAttributeWriter} from "./PrecisionAttributeWriter";

interface State{
  pawPosition: number;
}

class SardanaMotor extends Component<WidgetProps, State> {
  constructor(props: WidgetProps) {
    super(props);
    this.state = { pawPosition: this.props.inputs.position.value };
    this.handleStop = this.handleStop.bind(this);
  }

  public render() {
    const { inputs, mode } = this.props;
    const { title, upperLimit, lowerLimit, position, powerOn, state, precision, maxMagnitude } = inputs;
    const running = powerOn.value ? "running" : "stopped";
    const editMode = mode === "edit";
    return (
      <div className="sardana-motor">
        <div className="border">
          <div className="row menu">
            <div>
            <QualityIndicatorLabel state={(editMode ? "UNKNOWN" : state.value)} />
              <span className="title">{title}</span>
            </div>
            <div>
              <span className={"label-" + (editMode ? "unknown" : running)} />
              {" "}
              <button
                className={"btn-" + running}
                title="Stop the motor"
                onClick={this.handleStop}
              />
            </div>
          </div>
          <div className="row">
            <span>Upper limit: </span>{" "}
            <span>
              {mode === "run"
                ? upperLimit.value
                  ? "Reached"
                  : "Not reached"
                : "-"}
            </span>
          </div>
          <div className="row">
            <span>Lower limit: </span>{" "}
            <span>
              {!editMode
                ? lowerLimit.value
                  ? "Reached"
                  : "Not reached"
                : "-"}
            </span>
          </div>
          <div className="row">
            <span>Current position:</span>
            <span>{editMode ? "-" : position.value}</span>
          </div>
          <div className="row">
          <button className="btn-copy" onClick={() => this.setPosition()}>Set position</button>
            {editMode ? 
            <PrecisionAttributeWriter
            initialValue={position.value}
            precision={precision}
            maxMagnitude={maxMagnitude}
            mode={mode}
            onValueChange={(value:number) => (null)}
            />
            :
            <PrecisionAttributeWriter
            initialValue={position.value}
            precision={precision}
            maxMagnitude={maxMagnitude}
            mode={mode}
            onValueChange={(value:number) => this.setState({pawPosition: value})}
            />
          }
            
            <button className="btn-copy" onClick={() => this.copyCurrent()}>Copy current</button>
          </div>
        </div>
      </div>
    );
  }

  private copyCurrent(){
    console.log("copying");
  }
  private setPosition(){
    console.log("New value: " + this.state.pawPosition);
  }
  private async handleStop() {
    // const { stop } = this.props.inputs;
    // stop.execute();
  }
}

const definition: WidgetDefinition = {
  type: "SARDANA_MOTOR",
  name: "Sardana motor",
  defaultHeight: 12,
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
    },
    state: {
      type: "attribute",
      device: "$device",
      attribute: "State"
    },
    maxMagnitude: {
      type: "number",
      label: "Max. magnitude",
      default: 6,
    },
    precision: {
      type: "number",
      label: "precision",
      default: 3,
    }
  }
};

export default { definition, component: SardanaMotor };
