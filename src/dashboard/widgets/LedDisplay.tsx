import React, { Component, Fragment, CSSProperties } from "react";
import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  BooleanInputDefinition,
  NumberInputDefinition,
  AttributeInputDefinition,
  SelectInputDefinition,
  ColorInputDefinition
} from "../types";
import { isDark } from "../colorUtils";

type Inputs = {
  showAttributeValue: BooleanInputDefinition;
  showAttributeName: BooleanInputDefinition;
  showDeviceName: BooleanInputDefinition;
  compare: NumberInputDefinition;
  relation: SelectInputDefinition;
  attribute: AttributeInputDefinition;
  trueColor: ColorInputDefinition;
  falseColor: ColorInputDefinition;
  ledSize: NumberInputDefinition;
  textSize: NumberInputDefinition;
}

type Props = WidgetProps<Inputs>;

function Led(props) {
  const {fillColor, textColor, ledSize, value} = props;
  return <div className="led" style={{color: textColor, backgroundColor: fillColor, width: ledSize, height: ledSize, lineHeight: ledSize}}>{value}</div>;
}

class LedReadOnly extends Component<Props> {
  public render() {
    const {trueColor, falseColor, ledSize, textSize, showDeviceName, showAttributeName, showAttributeValue} = this.props.inputs;
    const {deviceName, attributeName} = this.deviceAndAttribute();
    const ledStyle: CSSProperties = { padding: "0.2em", whiteSpace: "nowrap", fontSize: ledSize/2 + "em" };
    const textStyle: CSSProperties = { fontSize: textSize + "em" };
    
    const condition = this.checkCondition();
    // if condition is null, color the LED to white (blank)
    let fillColor = "#ffffff";
    // black color for the value text
    let textColor = "#000000";
    // otherwise apply the color specified
    if (condition !== null) {
      fillColor = condition ? trueColor : falseColor;      
    }
    const emledSize = 1 * ledSize + "em";
    const value = this.props.inputs.attribute.value;
    
    // if LED is darker, make the value color to be white
    if (isDark(fillColor)) {
      textColor = "#ffffff";
    }

    const inner = (
      <Fragment>
        <div style={textStyle}>
          { showDeviceName && deviceName}
          { showAttributeName && "/" + attributeName}
        </div>
        { showAttributeValue ? (
        <Led
          fillColor={fillColor}
          textColor={textColor}
          ledSize={emledSize}
          value={value}
        />
        ) : (
        <Led
          fillColor={fillColor}
          textColor={textColor}
          ledSize={emledSize}
        />
        )}
      </Fragment>
    );

    return <div style={ledStyle}>{inner}</div>;
  }

  private checkCondition(): any {

    const {
      attribute: { value:stringVal },
      compare,
      relation
    } = this.props.inputs;

    if (isNaN(stringVal)) {
      return null;
    }
    else {
      const value = Number(stringVal);
      switch (relation) {
        case ">":
          return value > compare;
        case "<":
          return value < compare;
        case "=":
          return value === compare;
        case ">=":
          return value >= compare;
        case "<=":
          return value <= compare;
        default:
          break;
      }
    }
  }
  private deviceAndAttribute(): { deviceName: string; attributeName: string } {
    const { attribute } = this.props.inputs;
    const deviceName = attribute.device || "device";
    const attributeName = attribute.attribute || "attribute";
    return { deviceName, attributeName };
  }
}

export const definition: WidgetDefinition<Inputs> = {
  type: "LED_DISPLAY",
  name: "Attribute LED Display",
  defaultWidth: 2,
  defaultHeight: 2,
  inputs: {
    attribute: {
      /* tslint:disable-next-line */
      type: "attribute",
      label: "",
      dataFormat: "scalar",
      required: true
    },
    relation: {
      type: "select",
      label: "relation",
      default: ">",
      options: [
        {
          name: "is more than",
          value: ">"
        },
        {
          name: "is less than",
          value: "<"
        },
        {
          name: "is equal to",
          value: "="
        },
        {
          name: "is more than or equal to",
          value: ">="
        },
        {
          name: "is less than or equal to",
          value: "<="
        }
      ]
    },
    compare: {
      type: "number",
      label: "Compare",
      default: 0
    },
    trueColor: {
      type: "color",
      label: "True color",
      default: "#3ac73a",
    },
    falseColor: {
      type: "color",
      label: "False color",
      default: "#ff0000",
    },
    ledSize: {
      label: "Size of LED (in units)",
      type: "number",
      default: 2,
      nonNegative: true,
    },
    textSize: {
      label: "Size of text (in units)",
      type: "number",
      default: 2,
      nonNegative: true,
    },
    showAttributeValue: {
      type: "boolean",
      label: "Show Attribute Value",
      default: false
    },
    showDeviceName: {
      type: "boolean",
      label: "Show Device Name",
      default: false
    },
    showAttributeName: {
      type: "boolean",
      label: "Show Attribute Name",
      default: false
    }
  }
};

export default { component: LedReadOnly, definition };
