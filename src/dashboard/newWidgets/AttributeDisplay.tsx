import React, { Component } from "react";
import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class AttributeReadOnly extends Component<IWidgetProps> {
  public render() {
    return <em>Attribute Read Only</em>;

    const attribute = this.props.inputs.attribute;
    const { device, name, value } = attribute;
    return (
      <div style={{ backgroundColor: "purple", padding: "1em" }}>
        {device}/{name}: {value}
      </div>
    );
  }
}

const definition: IWidgetDefinition = {
  type: "ATTRIBUTE_DISPLAY",
  name: "Attribute Display",
  defaultWidth: 5,
  defaultHeight: 2,
  inputs: {
    attribute: {
      type: "attribute",
      required: true
    }
  }
};

export default { component: AttributeReadOnly, definition };
