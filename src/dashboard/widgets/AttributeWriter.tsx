<<<<<<< HEAD
import React, { Component, FormEvent, CSSProperties } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  AttributeInputDefinition,
  BooleanInputDefinition,
  ColorInputDefinition,
  NumberInputDefinition,
  SelectInputDefinition
} from "../types";

type Inputs = {
  attribute: AttributeInputDefinition;
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
  textColor: ColorInputDefinition;
  backgroundColor: ColorInputDefinition;
  size: NumberInputDefinition;
  font: SelectInputDefinition;
};
=======
import React, { Component, FormEvent } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";

interface Inputs {
  attribute: AttributeInput;
  showDevice: boolean;
  showAttribute: boolean;
}
>>>>>>> origin/master

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
<<<<<<< HEAD
    const {
      attribute,
      showDevice,
      showAttribute,
      backgroundColor,
      textColor,
      size,
      font
    } = inputs;
    const { device, writeValue, attribute: attributeName } = attribute;
=======
    const { attribute, showDevice, showAttribute } = inputs;
    const { device, attribute: attributeName } = attribute;
>>>>>>> origin/master

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
<<<<<<< HEAD
    const style: CSSProperties = {
      display: "flex",
      alignItems: "center",
      padding: "0.25em 0.5em",
      backgroundColor,
      color: textColor,
      fontSize: size + "em"
    }
    if (font){
      style["fontFamily"] = font;
    }
    return (
      <form
        style={style}
=======

    return (
      <form
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.25em 0.5em"
        }}
>>>>>>> origin/master
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
<<<<<<< HEAD
          placeholder={writeValue || ""}
=======
>>>>>>> origin/master
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

<<<<<<< HEAD
const definition: WidgetDefinition<Inputs> = {
=======
const definition: WidgetDefinition = {
>>>>>>> origin/master
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
<<<<<<< HEAD
    },
    textColor: {
      label: "Text Color",
      type: "color",
      default: "#000"
    },
    backgroundColor: {
      label: "Background Color",
      type: "color",
      default: "#ffffff"
    },
    size: {
      label: "Text size (in units)",
      type: "number",
      default: 1,
      nonNegative: true
    },
    font: {
      type: "select",
      default: "Helvetica",
      label: "Font type",
      options: [
        {
          name: "Default (Helvetica)",
          value: "Helvetica"
        },
        {
          name: "Monospaced (Courier new)",
          value: "Courier new"
        }
      ]
=======
>>>>>>> origin/master
    }
  }
};

export default {
  definition,
  component: AttributeWriter
};
