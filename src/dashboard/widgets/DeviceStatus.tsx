import React, { Component, CSSProperties } from "react";
import { WidgetProps } from "./types";

import {
  WidgetDefinition,
  NumberInputDefinition,
  AttributeInputDefinition,
  DeviceInputDefinition,
  BooleanInputDefinition
} from "../types";
import { STATE_COLORS, brighten } from "../colorUtils";

type Inputs = {
  device: DeviceInputDefinition;
  state: AttributeInputDefinition;
  showDeviceName: BooleanInputDefinition;
  showStateString: BooleanInputDefinition;
  showStateLED: BooleanInputDefinition;
  LEDSize: NumberInputDefinition;
  textSize: NumberInputDefinition;
};

const definition: WidgetDefinition<Inputs> = {
  type: "DEVICE_STATUS",
  name: "Device Status",
  defaultHeight: 2,
  defaultWidth: 24,
  inputs: {
    device: {
      type: "device",
      label: "Device",
      publish: "$device"
    },
    state: {
      type: "attribute",
      device: "$device",
      attribute: "State"
    },
    showDeviceName: {
      type: "boolean",
      label: "Show device name",
      default: true
    },
    showStateString: {
      type: "boolean",
      label: "Show state name",
      default: true
    },
    showStateLED: {
      type: "boolean",
      label: "Show state LED",
      default: true
    },
    LEDSize: {
      label: "LED size (in units)",
      type: "number",
      default: 1,
      nonNegative: true
    },
    textSize: {
      label: "Text size (in units)",
      type: "number",
      default: 1,
      nonNegative: true
    }
  }
};

type Props = WidgetProps<Inputs>;

class DeviceStatus extends Component<Props> {
  public render() {
    const { inputs, mode } = this.props;
    return (
      <div style={{display: "table-cell"}}>
        <Text {...inputs} />

        {<LED {...inputs} />}
      </div>
    );
  }
}

const Text = props => {
    const {device, textSize, showDeviceName, showStateString, state, showStateLED } = props;
    const deviceName = showDeviceName ? device.name || "Device name" : "";
    const stateString = showStateString ? state.value || "STATE" : "";

    const style: CSSProperties = { fontSize: textSize + "em", display: "inline-block", verticalAlign: "middle" };
    if (showStateLED){
        style["marginRight"] = "0.5em";
    }
  return <div style={style}>{deviceName} {stateString}</div>;
};
const LED = props => {
  const { LEDSize, state, showStateLED } = props;
  if (!showStateLED){
      return null;
  }
  const stateValue = state.value;
  const color: string = STATE_COLORS[stateValue || "UNKONWN"];
  const emSize = 1 * LEDSize + "em";
  let baseColor = color;
  let highLightColor = brighten(color, 30);
  let borderColor = color;

  switch (color) {
    case "green":
      baseColor = brighten(baseColor, 15);
      highLightColor = brighten(highLightColor, 15);
      borderColor = brighten(borderColor, 15);
      break;
    case "white":
      borderColor = "#aaa";
      baseColor = "#f8f8f8";
      break;
    case "lightblue":
      baseColor = brighten(baseColor, -10);
      highLightColor = brighten(highLightColor, -10);
      break;
    case "yellow":
      baseColor = brighten(baseColor, -5);
      highLightColor = brighten(highLightColor, -5);
      borderColor = brighten(borderColor, -5);
      break;
    case "red":
      borderColor = brighten(borderColor, -5);
      break;
    case "beige":
      baseColor = brighten(baseColor, -15);
      highLightColor = brighten(highLightColor, -15);
      borderColor = brighten(borderColor, -15);
      break;
    case "darkgreen":
      borderColor = brighten(borderColor, 5);
      break;
    case "magenta":
      borderColor = brighten(borderColor, -5);
      break;
    case "grey":
      borderColor = brighten(borderColor, 5);
      break;
    default:
      break;
  }
  const background =
    "radial-gradient(circle, " +
    highLightColor +
    " 0%, " +
    baseColor +
    " 100%)";
  const border = props.size / 50 + "em solid " + borderColor;
  return (
    <div style={{ display: "inline-block", verticalAlign: "middle" }}>
      <div
        style={{
          width: emSize,
          height: emSize,
          background,
          borderRadius: "50%",
          border
        }}
        title={stateValue}
      ></div>
    </div>
  );
};

export default { component: DeviceStatus, definition };
