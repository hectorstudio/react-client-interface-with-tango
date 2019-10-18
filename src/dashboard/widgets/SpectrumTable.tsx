import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  BooleanInputDefinition,
  AttributeInputDefinition,
  SelectInputDefinition,
  NumberInputDefinition
} from "../types";

// prettier-ignore
const sampleData = [10, 25, 38, 135, 9856];

type Inputs = {
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
  attribute: AttributeInputDefinition;
  showIndex: BooleanInputDefinition;
  showLabel: BooleanInputDefinition;
  fontSize: NumberInputDefinition;
  layout: SelectInputDefinition<"horizontal" | "vertical">;
};

interface State {
  min?: number;
  max?: number;
}

type Props = WidgetProps<Inputs>;

function Table(props:Props) {
  
  const { mode, inputs } = props;
  const { attribute} = inputs;

  let value = mode === "run" ? attribute.value : mode === "library" || mode === "edit" ? sampleData : [];
  value = value === undefined || value === null ? [null] : value;

  const tdStyle: CSSProperties = { marginLeft: "5px", padding: "0.5em", whiteSpace: "nowrap", border: "1px solid black", textAlign: "center" };
  const mainDivStyle: CSSProperties = { marginLeft: "5px", fontSize: inputs.fontSize+"px"};
  const spanStyle: CSSProperties = { marginLeft: "5px", display: "inline"};

  let spanText = inputs.showDevice === true ? attribute.device+"/" : "";
  spanText += inputs.showAttribute === true ? attribute.attribute+":" : "";

  return (
    <div style={mainDivStyle}>
      { inputs.showDevice || inputs.showAttribute ? <span style={spanStyle}>{spanText}</span> : null }
      <table>
        { 
          inputs.layout === 'horizontal' ? 
         <tbody>{inputs.showIndex === true ? <tr>{inputs.showLabel === true ? <td style={tdStyle}>Index:</td> : null}
         {value.map((item, i) => { return [<td style={tdStyle}  key={i}>{i}</td>];})}</tr> : null}
          <tr>{inputs.showLabel === true ? <td style={tdStyle}>Value:</td> : null}
          {value.map((item, i) => { return [<th style={tdStyle}  key={i}>{item}</th>];})}</tr></tbody>
          : //vertical
          <tbody>
          {inputs.showLabel === true ? <tr>{inputs.showIndex === true ? <td style={tdStyle}>Index:</td>: null}
          <td style={tdStyle}>Value:</td></tr> : null}
          {value.map((item, i) => { return [<tr key={i}>{inputs.showIndex === true ? <td style={tdStyle}>{i}</td> : null}
          <th style={tdStyle}>{item}</th></tr>];})}</tbody>
        }
      </table>
    </div>
  );
}

class SpectrumTable extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Table {...this.props}>> </Table>
    );
  }
}

const definition: WidgetDefinition<Inputs> = {
  type: "SPECTRUM_TABLE",
  name: "SpectrumTable",
  defaultWidth: 10,
  defaultHeight: 3,
  inputs: {
    attribute: {
      label: "",
      type: "attribute",
      dataFormat: "spectrum",
      dataType: "numeric",
      required: true
    },
    layout: {
      type: "select",
      label: "Layout",
      default: "horizontal",
      options: [
        {
          name: "Horizontal",
          value: "horizontal"
        },
        {
          name: "Vertical",
          value: "vertical"
        }
      ]
    },
    showDevice: {
      type: "boolean",
      label: "Show Device",
      default: false
    },
    showAttribute: {
      type: "boolean",
      label: "Show Attribute",
      default: false
    },
    showIndex: {
      type: "boolean",
      label: "Show Index",
      default: false
    },
    showLabel: {
      type: "boolean",
      label: "Show Labels",
      default: false
    },
    fontSize: {
      type: "number",
      label: "Font Size (px)",
      default: 16,
      nonNegative: true
    },
  }
};

export default { component: SpectrumTable, definition };
