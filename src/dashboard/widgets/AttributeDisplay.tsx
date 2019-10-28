import React, { Component, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "./types";

import {
  WidgetDefinition,
  BooleanInputDefinition,
  NumberInputDefinition,
  AttributeInputDefinition,
} from "../types";

type Inputs = {
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
  scientificNotation: BooleanInputDefinition;
  precision: NumberInputDefinition;
  showEnumLables: BooleanInputDefinition;
  attribute: AttributeInputDefinition;
};

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
    },
    showAttribute: {
      type: "boolean",
      label: "Attribute Name",
      default: false
    },
    scientificNotation: {
      type: "boolean",
      label: "Scientific Notation",
      default: false
    },
    showEnumLables: {
      type: "boolean",
      label: "Show Enum Lables",
      default: false
    }
  }
};

type Props = WidgetProps<Inputs>;

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();
    const { showDevice, showAttribute, showEnumLables, attribute } = this.props.inputs;
    const { value } = attribute;
    const valueG = this.value();
    let enumLable = this.props.inputs.attribute.enumlabels;
    const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap" };
    return (
      <div style={style}>
        {showDevice ? device : ""}
        {showDevice && showAttribute && "/"}
        {showAttribute ? name : ""}
        {(showDevice || showAttribute) && ": "} 
        {(showEnumLables && enumLable !== undefined) ? enumLable[value] : valueG}
      </div>
    );
  }

  private value(): ReactNode {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value, unit },
      precision,
      scientificNotation
    } = this.props.inputs;

    let result: ReactNode;
    if (Number(parseFloat(value)) === value) {
      if (scientificNotation) {
        result = value.toExponential(precision);
      } else {
        result = value.toFixed(precision);
      }
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
