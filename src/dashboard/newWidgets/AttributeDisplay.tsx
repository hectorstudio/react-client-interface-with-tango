import React, { Component, Fragment, CSSProperties } from "react";
import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class AttributeReadOnly extends Component<IWidgetProps> {
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
      return value;
    }
  }

  private deviceAndAttribute(): { device: string; name: string } {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const name = attribute.attribute || "attribute";
    return { device, name };
  }
}

const definition: IWidgetDefinition = {
  type: "ATTRIBUTE_DISPLAY",
  name: "Attribute Display",
  defaultWidth: 10,
  defaultHeight: 2,
  inputs: {
    attribute: {
      type: "attribute",
      label: "Attribute",
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
