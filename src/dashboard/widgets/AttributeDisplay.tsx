import React, { Component, Fragment, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "./types";

import {
  WidgetDefinition,
  BooleanInputDefinition,
  NumberInputDefinition,
  AttributeInputDefinition
} from "../types";

type Inputs = {
  showDevice: BooleanInputDefinition;
  precision: NumberInputDefinition;
  attribute: AttributeInputDefinition;
}

const definition: WidgetDefinition<Inputs> = {
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

type Props = WidgetProps<Inputs>;

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();

    const value = this.value();
    const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap" };
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

  private value(): ReactNode {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value, unit },
      precision
    } = this.props.inputs;

    let result: ReactNode;
    if (Number(parseFloat(value)) === value) {
      result = value.toFixed(precision);
    } else {
      result = value === undefined ? null : String(value);
    }

    const unitSuffix = unit ? ` ${unit} ` : "";
    return (
      <>
        {result}
        {unitSuffix}
      </>
    );
  }

  private deviceAndAttribute(): { device: string; name: string } {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const name = attribute.attribute || "attribute";
    return { device, name };
  }
}

export default { component: AttributeReadOnly, definition };
