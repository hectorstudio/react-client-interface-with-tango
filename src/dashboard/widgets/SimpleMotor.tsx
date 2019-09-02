import React, { Component } from "react";
import { WidgetDefinition, DeviceInputDefinition, CommandInputDefinition, AttributeInputDefinition} from "../types";
import { WidgetProps } from "./types";

type Inputs = {
  device: DeviceInputDefinition;
  state: CommandInputDefinition;
  status: CommandInputDefinition;
  doubleScalar: AttributeInputDefinition;
  ulongScalar: AttributeInputDefinition;
}

type Props = WidgetProps<Inputs>;

class SimpleMotor extends Component<Props> {
  public render() {
    const { doubleScalar, ulongScalar } = this.props.inputs;

    return (
      <div style={{ height: 200, width: 200 }}>
        ULong Scalar: {ulongScalar.value}
        <hr />
        Double Scalar: {doubleScalar.value}
      </div>
    );
  }
}

const definition: WidgetDefinition<Inputs> = {
  type: "TEST_DEVICE",
  name: "Test Device",
  defaultHeight: 5,
  defaultWidth: 10,
  inputs: {
    device: {
      type: "device",
      publish: "$device"
    },
    state: {
      type: "command",
      device: "$device",
      command: "State"
    },
    status: {
      type: "command",
      device: "$device",
      command: "Status"
    },
    doubleScalar: {
      type: "attribute",
      device: "$device",
      attribute: "double_scalar"
    },
    ulongScalar: {
      type: "attribute",
      device: "$device",
      attribute: "ulong_scalar"
    }
  }
};

export default { definition, component: SimpleMotor };
