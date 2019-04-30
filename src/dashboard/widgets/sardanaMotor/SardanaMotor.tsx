import React, { Component } from "react";

import { WidgetProps } from "../types";
import { WidgetDefinition } from "../../types";
import "./SardanaMotor.css";
import { QualityIndicatorLabel } from "../../../shared/widgets/snippets";
import { MultiDialWriter } from "./MultiDialWriter";
import { AttributeStepWriter } from "./AttributeStepWriter";
import { AttributeAbsWriter } from "./AttributeAbsWriter";

interface State {}

class SardanaMotor extends Component<WidgetProps, State> {
  constructor(props: WidgetProps) {
    super(props);
    this.handleStop = this.handleStop.bind(this);
    this.setPower = this.setPower.bind(this);
    this.setPosition = this.setPosition.bind(this);
  }

  public render() {
    const { inputs, mode } = this.props;
    const {
      title,
      limits,
      power,
      position,
      state,
      precision,
      maxMagnitude,
      showAbsInput,
      showStepInput,
      showMultipleDialInput,
      device,
    } = inputs;

    let name = "";
    let alias = "";

    if (device){
      name = device.name;
      alias = device.alias;
    }
    const limitValues = limits.value;
    let limitWarningCss = "";
    let limitWarningTitle = "";
    if (limitValues){
      if (limitValues[1]){
        limitWarningCss = "upper-limit-warning";
        limitWarningTitle = "Upper limit reached";
      }else if (limitValues[2]){
        limitWarningCss = "lower-limit-warning";
        limitWarningTitle = "Lower limit reached";
      }
    }

    const running = power.value ? "running" : "stopped";
    const editMode = mode === "edit";
    return (
      <div className="sardana-motor">
        <div className="motor-container">
          <div className="motor-row">
            <div>
              <QualityIndicatorLabel
                state={editMode ? "Power" : state.value}
              />
              {state.value === "MOVING" && (
                <button
                  className="btn-stop"
                  title="Stop the movement"
                  onClick={this.handleStop}
                />
              )}
              <span style={{margin: "0em 0.3em"}}>{title || alias || name || "name"}</span>
            </div>
            <div>
              <span className={"label-" + (editMode ? "status" : running)} />{" "}
              {power.value ? (
                <button
                  className={"btn-running"}
                  title="Power off the motor"
                  onClick={() => this.setPower(false)}
                />
              ) : (
                <button
                  className={"btn-stopped"}
                  title="Power on motor"
                  onClick={() => this.setPower(true)}
                />
              )}
            </div>
          </div>
          <div className="motor-row">
            <span title={limitWarningTitle} className={limitWarningCss}>{editMode ? "0.000000000000" : position.value}</span>
          </div>
          {showAbsInput && (
            <div className="motor-row">
              <AttributeAbsWriter
                state={state.value}
                value={position.value}
                mode={mode}
                onSetPosition={value => this.setPosition(value)}
              />
            </div>
          )}
          {showStepInput && (
            <div className="motor-row">
              <AttributeStepWriter
                state={state.value}
                value={position.value}
                mode={mode}
                onSetPosition={value =>{
                  console.log(this.props.inputs.position.value );
                  console.log(typeof this.props.inputs.position.value);
                  console.log( value );
                  console.log(typeof value );
                  this.setPosition(this.props.inputs.position.value + value)
                }
                }
              />
            </div>
          )}
          {showMultipleDialInput && (
            <div className="motor-row input-row">
              <MultiDialWriter
                state={state.value}
                value={position.value}
                precision={precision}
                maxMagnitude={maxMagnitude}
                mode={mode}
                onSetPosition={value => this.setPosition(value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  private setPosition(value: number) {
    console.log("Settings position: " + value)
    this.props.inputs.position.write(value);
  }

  private handleStop() {
    this.props.inputs.stop.execute();
  }
  private setPower(value: boolean) {
    this.props.inputs.power.write(value);
  }
}

const definition: WidgetDefinition = {
  type: "SARDANA_MOTOR",
  name: "Sardana motor",
  defaultHeight: 7,
  defaultWidth: 18,
  inputs: {
    device: {
      type: "device",
      publish: "$device"
    },
    title: {
      type: "string",
      label: "Title",
      placeholder: "name or alias",
    },
    maxMagnitude: {
      type: "number",
      label: "Max. magnitude",
      default: 6
    },
    precision: {
      type: "number",
      label: "precision",
      default: 3
    },
    showAbsInput: {
      type: "boolean",
      label: "Show abs. input",
      default: true
    },
    showStepInput: {
      type: "boolean",
      label: "Show step input",
      default: true
    },
    showMultipleDialInput: {
      type: "boolean",
      label: "Show mult. dial input",
      default: false
    },
    stop: {
      type: "command",
      device: "$device",
      command: "Stop"
    },
    limits: {
      type: "attribute",
      device: "$device",
      attribute: "Limit_switches"
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
    }
  }
};

export default { definition, component: SardanaMotor };
