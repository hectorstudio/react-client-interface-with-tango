import React, { Component } from "react";
import { IWidgetDefinition } from "../types";

class SimpleMotor extends Component {
  public render() {
    return <div style={{ height: 200, width: 200 }}>MOTOR</div>;
  }
}

const definition: IWidgetDefinition = {
  type: "SIMPLE_MOTOR",
  name: "Simple Motor",
  defaultHeight: 5,
  defaultWidth: 10,
  inputs: {
    device: {
      type: "device",
      publish: "$device"
    },
    goForward: {
      type: "command",
      device: "$device",
      command: "GoForward"
    },
    goBackward: {
      type: "command",
      device: "$device",
      command: "GoBackward"
    },
    position: {
      type: "attribute",
      device: "$device",
      attribute: "Position"
    }
  }
};

export default { definition, component: SimpleMotor };
