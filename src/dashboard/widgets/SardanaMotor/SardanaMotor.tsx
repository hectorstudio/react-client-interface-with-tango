import React, { Component } from "react";
import cx from "classnames";

import {
  WidgetDefinition,
  DeviceInputDefinition,
  NumberInputDefinition,
  CommandInputDefinition,
  AttributeInputDefinition
} from "../../types";

import "./SardanaMotor.css";
// import { MultiDialWriter } from "./MultiDialWriter";
// import { AttributeStepWriter } from "./AttributeStepWriter";
import { AttributeAbsWriter } from "./AttributeAbsWriter";
import { StateIndicatorLabel } from "../../../shared/ui/components/StateIndicatorLabel";
import { WidgetProps } from "../types";

type Inputs = {
  device: DeviceInputDefinition;
  precision: NumberInputDefinition;
  stop: CommandInputDefinition;
  limits: AttributeInputDefinition;
  position: AttributeInputDefinition;
  power: AttributeInputDefinition;
  state: AttributeInputDefinition;
};

type Props = WidgetProps<Inputs>;

class SardanaMotor extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleStop = this.handleStop.bind(this);
    this.setPower = this.setPower.bind(this);
    this.setPosition = this.setPosition.bind(this);
  }

  public render() {
    const { inputs, mode } = this.props;
    const { limits, precision, power, position, state, device } = inputs;

    let name = "";
    let alias = "";

    if (device) {
      name = device.name;
      alias = device.alias;
    }
    const limitValues = limits.value;
    let limitWarningCss = "";
    let limitWarningTitle = "";
    if (limitValues) {
      if (limitValues[1]) {
        limitWarningCss = "upper-limit-warning";
        limitWarningTitle = "Upper limit reached";
      } else if (limitValues[2]) {
        limitWarningCss = "lower-limit-warning";
        limitWarningTitle = "Lower limit reached";
      }
    }

    // const running = power.value ? "running" : "stopped";
    // const editMode = mode === "edit";

    const value = mode === "run" ? position.value : 0;

    // Value hasn't been initialised yet
    if (value == null) {
      return null;
    }

    const valueWithPrecision = value.toFixed(precision);

    const displayElement =
      value === undefined ? (
        <span className="value" style={{ color: "gray" }}>
          n/a
        </span>
      ) : (
        <span
          style={{ fontFamily: "monospace" }}
          title={limitWarningTitle}
          className={cx("value", limitWarningCss)}
        >
          {valueWithPrecision} {position.unit}
        </span>
      );

    return (
      <div className="sardana-motor">
        <div className="motor-container">
          <div className="motor-row">
            <StateIndicatorLabel
              state={mode === "run" ? state.value : "UNKNOWN"}
            />
            <span style={{ margin: "0em 0.3em" }}>
              {alias || name || "name"}
            </span>
          </div>
          {mode === "run" && !power.value ? (
            <div className="motor-row">
              Power is off.{" "}
              <button
                className={"btn-stopped"}
                title="Power on motor"
                onClick={() => this.setPower(true)}
              />
            </div>
          ) : (
            <>
              <div className="motor-row">{displayElement}</div>
              <div className="motor-row">
                <AttributeAbsWriter
                  state={state.value}
                  writeValue={position.writeValue}
                  mode={mode}
                  onSetPosition={value => this.setPosition(value)}
                  onStop={this.handleStop}
                />
              </div>
            </>
          )}
          {/* {showStepInput && (
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
          )} */}
          {/* {showMultipleDialInput && (
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
          )} */}
        </div>
      </div>
    );
  }

  private setPosition(value: number) {
    this.props.inputs.position.write(value);
  }

  private handleStop() {
    this.props.inputs.stop.execute();
  }
  private setPower(value: boolean) {
    this.props.inputs.power.write(value);
  }
}

const definition: WidgetDefinition<Inputs> = {
  type: "SARDANA_MOTOR",
  name: "Sardana Motor",
  defaultHeight: 2,
  defaultWidth: 24,
  inputs: {
    device: {
      type: "device",
      label: "Device",
      publish: "$device"
    },
    precision: {
      type: "number",
      label: "Precision",
      default: 3
    },
    stop: {
      type: "command",
      device: "$device",
      command: "Stop",
      invalidates: ["state", "position"]
    },
    limits: {
      type: "attribute",
      device: "$device",
      attribute: "Limit_switches"
    },
    position: {
      type: "attribute",
      device: "$device",
      attribute: "Position",
      invalidates: ["state"]
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
