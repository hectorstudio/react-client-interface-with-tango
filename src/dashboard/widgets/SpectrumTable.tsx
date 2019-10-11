import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  BooleanInputDefinition,
  AttributeInputDefinition
} from "../types";

// prettier-ignore
const sampleData = [0, 1, 2, 3, 4];

type Inputs = {
  showDevice: BooleanInputDefinition;
  showAttribute: BooleanInputDefinition;
  attribute: AttributeInputDefinition;
  showTitle: BooleanInputDefinition;
};

interface State {
  min?: number;
  max?: number;
}

type Props = WidgetProps<Inputs>;

function Table(props) {
  console.log(props);
  const { mode, inputs } = props.props;
  const { attribute} = inputs;

  let value = mode === "run" ? attribute.value : mode === "library" || mode === "edit" ? sampleData : [];
  value = value === undefined ? [null] : value;

  const tdStyle: CSSProperties = { marginLeft: "5px",padding: "0.5em", whiteSpace: "nowrap", border: "1px solid black" };
  const spanStyle: CSSProperties = { marginLeft: "5px", display: "inline"};

  let spanText = inputs.showDevice === true ? attribute.device+"/" : "";
  spanText += inputs.showAttribute === true ? attribute.attribute+":" : "";

  return inputs.showDevice || inputs.showAttribute ? ( 
  <div>
    <span style={spanStyle}>{spanText}</span> 
    <table>
      { 
      value.map((item, i) => {
        return [ <td style={tdStyle}>{item}</td> ];
      })
      }
    </table>
  </div>
  ) : (
  <div>
    <table >
      { 
      value.map((item, i) => {
        return [ <td style={tdStyle}>{item}</td> ];
      })
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

  public componentDidUpdate() {
    if (this.props.mode !== "run") {
      return;
    }
  }

  public render() {
    return (
      <Table props={this.props}> </Table>
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
    showTitle: {
      type: "boolean",
      label: "Show Title",
      default: true
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
  }
};

export default { component: SpectrumTable, definition };
