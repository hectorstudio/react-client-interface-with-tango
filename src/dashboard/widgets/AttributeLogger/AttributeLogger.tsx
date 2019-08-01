import React, { Component, Fragment, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "../types";
import { WidgetDefinition, AttributeInput } from "../../types";
import AttributeLog from "./Logs/Logs";


interface Input {
  showDevice: boolean;
  precision: number;
  attribute: AttributeInput;
}

type Props = WidgetProps<Input>;

let valueLog : string[] = [];  

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();

    const value = this.value();

    valueLog.push(this.logValue()); 

    console.log(valueLog); 

    const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap" };
    const inner = this.props.inputs.showDevice ? (
      <Fragment>
         <AttributeLog tangoDB="testdb" deviceName={device} values = {value} valueLog = {valueLog} />
      </Fragment>
    ) : (
      <Fragment>
        <AttributeLog tangoDB="testdb" deviceName={device} values = {value} valueLog = {valueLog} />
      </Fragment>
    );

    return <div style={style}>{inner}</div>;
  }

  private logValue(): string {
    const {
      attribute: { value, unit },
      precision
    } = this.props.inputs;

    if(value)
      return value;
    else
      return ""; 
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

const definition: WidgetDefinition = {
  type: "ATTRIBUTE_LOGGER",
  name: "Attribute Logger",
  defaultWidth: 50,
  defaultHeight: 20,
  inputs: {
    attribute: {
      type: "attribute",
      label: "Attribute to log",
      dataFormat: "scalar",
      required: true
    },
  }
};

export default { component: AttributeReadOnly, definition };
