import React, { Component } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition } from "../types";
import "./SardanaMotor.css";
import { QualityIndicatorLabel } from "../../shared/widgets/snippets";
import {PrecisionAttributeWriter} from "./PrecisionAttributeWriter";

interface State{
  pawPosition: number;
  copiedPosition: number;
}

class SardanaMotor extends Component<WidgetProps, State> {
  constructor(props: WidgetProps) {
    super(props);
    this.state = { pawPosition: this.props.inputs.position.value, copiedPosition: this.props.inputs.position.value};
    this.handleStop = this.handleStop.bind(this);
    this.setPower = this.setPower.bind(this);
    this.setPosition = this.setPosition.bind(this);
  }

  public render() {
    const { inputs, mode } = this.props;
    const { title, upperLimit, lowerLimit, power, position, state, precision, maxMagnitude } = inputs;
    const running = power.value ? "running" : "stopped";
    const editMode = mode === "edit";
    return (
      <div className="sardana-motor">
        <div className="border">
          <div className="row menu">
            <div>
            <QualityIndicatorLabel state={(editMode ? "UNKNOWN" : state.value)} />
            {state.value === "MOVING" && <button className="btn-stop" title="Stop the movement" onClick={this.handleStop}/>}
              <span className="title">{title}</span>
            </div>
            <div>
              <span className={"label-" + (editMode ? "unknown" : running)} />
              {" "}
              {power.value ? <button
                className={"btn-running"}
                title="Stop the motor"
                onClick={() => this.setPower(false)}
              /> : <button
              className={"btn-stopped"}
              title="Start the motor"
              onClick={() => this.setPower(true)}
            /> }
              
            </div>
          </div>
          <div className="row">
            <span>Upper limit: </span>{" "}
            <span>
              {mode === "run"
                ? upperLimit.value
                : "-"}
            </span>
          </div>
          <div className="row">
            <span>Lower limit: </span>{" "}
            <span>
              {!editMode
                ? lowerLimit.value
                : "-"}
            </span>
          </div>
          <div className="row">
            <span>Current position:</span>
            <span>{editMode ? "-" : position.value}</span>
          </div>
          <div className="row">
          <button className="btn-copy" onClick={this.setPosition}>Set position</button>
            {editMode ? 
            <PrecisionAttributeWriter
            initialValue={0}
            precision={precision}
            maxMagnitude={maxMagnitude}
            mode={mode}
            onValueChange={(value:number) => (null)}
            />
            :
            <PrecisionAttributeWriter
            initialValue={this.state.copiedPosition}
            precision={precision}
            maxMagnitude={maxMagnitude}
            mode={mode}
            onValueChange={(value:number) => this.setState({pawPosition: value})}
            />
          }
            
            <button className="btn-copy" onClick={() => this.setState({copiedPosition: this.props.inputs.position.value})}>Copy current</button>
          </div>
        </div>
      </div>
    );
  }

  private setPosition(){
    this.props.inputs.position.write(this.state.pawPosition);
  }

  private handleStop() {
    this.props.inputs.stop.execute();
    
  }
  private setPower(value:boolean){
    this.props.inputs.power.write(value);
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
    maxMagnitude: {
      type: "number",
      label: "Max. magnitude",
      default: 6,
    },
    precision: {
      type: "number",
      label: "precision",
      default: 3,
    },
    stop: {
      type: "command",
      device: "$device",
      command: "Stop"
    },
    upperLimit: {
      type: "attribute",
      device: "$device",
      attribute: "UpperLimitSwitch"
    },
    lowerLimit: {
      type: "attribute",
      device: "$device",
      attribute: "LowerLimitSwitch"
    },
    position: {
      type: "attribute",
      device: "$device",
      attribute: "Position"
    },
    power: {
      type: "attribute",
      device: "$device",
      attribute: "Power"
    },
    state: {
      type: "attribute",
      device: "$device",
      attribute: "State"
    },
  }
};

export default { definition, component: SardanaMotor };
