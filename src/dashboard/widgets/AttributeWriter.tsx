import React, { Component, FormEvent } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  AttributeInputDefinition,
  BooleanInputDefinition
} from "../types";

type Inputs = {
  attribute: AttributeInputDefinition;
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
};

type Props = WidgetProps<Inputs>;

interface State {
  input: string;
  pending: boolean;
}

class AttributeWriter extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      input: "",
      pending: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    const { mode, inputs } = this.props;
    const { attribute, showDevice, showAttribute } = inputs;
    const { device, writeValue, attribute: attributeName } = attribute;

    const unit = mode === "run" ? attribute.unit : "unit";
    const deviceLabel = device || "device";
    const attributeLabel = attributeName || "attribute";

    const label = [
      ...(showDevice ? [deviceLabel] : []),
      ...(showAttribute ? [attributeLabel] : [])
    ].join("/");

    const dataType = this.dataType();
    if (mode === "run" && dataType !== "numeric" && dataType !== "string") {
      return (
        <div style={{ backgroundColor: "red", padding: "0.5em" }}>
          {attribute.dataType} not implemented
        </div>
      );
    }

    const isInvalid = dataType === "numeric" && isNaN(Number(this.state.input));
    const invalidStyle = isInvalid ? { outline: "1px solid red" } : {};

    return (
      <form
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.25em 0.5em"
        }}
        onSubmit={this.handleSubmit}
      >
        {label && (
          <span style={{ flexGrow: 0, marginRight: "0.5em" }}>{label}:</span>
        )}
        <input
          type="text"
          style={{
            flexGrow: 1,
            minWidth: "3em",
            ...invalidStyle
          }}
          placeholder={writeValue || ""}
          value={this.state.input}
          onChange={e => this.setState({ input: e.target.value })}
        />
        {unit && <span style={{ marginLeft: "0.5em" }}>{unit}</span>}
      </form>
    );
  }

  private dataType(): "numeric" | "boolean" | "string" | "other" {
    const { attribute } = this.props.inputs;
    const { dataType, isNumeric } = attribute;
    const isBoolean = dataType === "DevBoolean";
    const isString = dataType === "DevString";
    return isNumeric
      ? "numeric"
      : isBoolean
      ? "boolean"
      : isString
      ? "string"
      : "other";
  }

  private async handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (this.state.pending) {
      return;
    }

    event.preventDefault();
    const { attribute } = this.props.inputs;
    const { isNumeric } = attribute;
    // const isBoolean = attribute.dataType === "DevBoolean";
    const { input } = this.state;

    const value = isNumeric ? Number(input) : input;
    if (typeof value === "number" && isNaN(value)) {
      return;
    }

    this.setState({ input: "", pending: true });
    await this.props.inputs.attribute.write(value);
    this.setState({ pending: false });
  }
}

const definition: WidgetDefinition<Inputs> = {
  type: "ATTRIBUTE_WRITER",
  name: " Attribute Writer",
  defaultHeight: 2,
  defaultWidth: 15,
  inputs: {
    attribute: {
      type: "attribute",
      label: "",
      dataFormat: "scalar"
    },
    showDevice: {
      type: "boolean",
      label: "Show Device Name",
      default: true
    },
    showAttribute: {
      type: "boolean",
      label: "Show Attribute Name",
      default: true
    }
  }
};

export default {
  definition,
  component: AttributeWriter
};
