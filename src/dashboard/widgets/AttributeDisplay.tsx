import React, { Component, Fragment, CSSProperties } from "react";
import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";

interface Input {
  showDevice: boolean;
  precision: number;
  attribute: AttributeInput;
}

type Props = WidgetProps<Input>;

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();
    const value = this.value();

    const style = { padding: "0.5em", whiteSpace: "nowrap" } as CSSProperties;
    const inner = this.props.inputs.showDevice ? (
      <Fragment>
        {device}/{name}: {value}
      </Fragment>
    ) : (
      <Fragment>
        {name}: {value}
      </Fragment>
    );

    return <div style={style}>{inner}</div>;
  }

  private value(): any {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value },
      precision
    } = this.props.inputs;

    if (Number(parseFloat(value)) === value) {
      return value.toFixed(precision);
    } else {
      return value === undefined ? null : String(value);
    }
  }

  private deviceAndAttribute(): { device: string; name: string } {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const name = attribute.attribute || "attribute";
    return { device, name };
  }
}

const definition: WidgetDefinition = {
  type: "ATTRIBUTE_DISPLAY",
  name: "Attribute Display",
  defaultWidth: 10,
  defaultHeight: 2,
  inputs: {
    attribute: {
      type: "attribute",
      label: "",
      dataFormat: "scalar",
      required: true
    },
    precision: {
      type: "number",
      label: "Precision",
      default: 2
    },
    showDevice: {
      type: "boolean",
      label: "Device Name",
      default: false
    }
  }
};

export default { component: AttributeReadOnly, definition };
