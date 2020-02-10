<<<<<<< HEAD
import React, { Component, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "./types";

import {
  WidgetDefinition,
  BooleanInputDefinition,
  NumberInputDefinition,
  AttributeInputDefinition,
  ColorInputDefinition,
  SelectInputDefinition
} from "../types";

type Inputs = {
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
  scientificNotation: BooleanInputDefinition;
  precision: NumberInputDefinition;
  showEnumLabels: BooleanInputDefinition;
  attribute: AttributeInputDefinition;
  textColor: ColorInputDefinition;
  backgroundColor: ColorInputDefinition;
  size: NumberInputDefinition;
  font: SelectInputDefinition;
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
    showEnumLabels: {
      type: "boolean",
      label: "Show Enum Labels",
      default: false
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
    }
  }
};

type Props = WidgetProps<Inputs>;
=======
import React, { Component, Fragment, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";

interface Input {
  showDevice: boolean;
  precision: number;
  attribute: AttributeInput;
}

type Props = WidgetProps<Input>;
>>>>>>> origin/master

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();
<<<<<<< HEAD
    const {
      showDevice,
      showAttribute,
      showEnumLabels,
      attribute,
      backgroundColor,
      textColor,
      size,
      font
    } = this.props.inputs;
    const { value } = attribute;
    const valueG = this.value();
    let enumLable = this.props.inputs.attribute.enumlabels;
    const style: CSSProperties = {
      padding: "0.5em",
      whiteSpace: "nowrap",
      backgroundColor,
      color: textColor,
      fontSize: size + "em"
    };
    if (font){
      style["fontFamily"] = font;
    }
    return (
      <div id="AttributeDisplay" style={style}>
        {showDevice ? device : ""}
        {showDevice && showAttribute && "/"}
        {showAttribute ? name : ""}
        {(showDevice || showAttribute) && ": "}
        {showEnumLabels && enumLable !== undefined && enumLable.length > 0
          ? enumLable[value]
          : valueG}
      </div>
    );
=======

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
>>>>>>> origin/master
  }

  private value(): ReactNode {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value, unit },
<<<<<<< HEAD
      precision,
      scientificNotation
=======
      precision
>>>>>>> origin/master
    } = this.props.inputs;

    let result: ReactNode;
    if (Number(parseFloat(value)) === value) {
<<<<<<< HEAD
      if (scientificNotation) {
        result = value.toExponential(precision);
      } else {
        result = value.toFixed(precision);
      }
=======
      result = value.toFixed(precision);
>>>>>>> origin/master
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/master
export default { component: AttributeReadOnly, definition };
