import React, { Component } from "react";

class AttributeReadOnly extends Component {
  render() {
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

const definition = {
  type: "ATTRIBUTE_DISPLAY",
  name: "Attribute Display",
  inputs: {
    attribute: {
      type: "attribute",
      required: true
    }
  }
};

export default { component: AttributeReadOnly, definition };
