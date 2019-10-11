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
  attribute: AttributeInputDefinition;
  showTitle: BooleanInputDefinition;
};

interface State {
  min?: number;
  max?: number;
}

type Props = WidgetProps<Inputs>;

function Table(props) {
  
  const { mode, inputs } = props.props;
  const { attribute, showTitle} = inputs;

  let value = mode === "run" ? attribute.value : mode === "library" || mode === "edit" ? sampleData : [];
  const length = value === undefined ? 0 : value.length;

  value = value === undefined ? [null] : value;
  const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap", border: "1px solid black" };
  return <table ><tbody>
  { 
    value.map((item, i) => {
      return [ <td style={style}>{item}</td> ];
    })
  }
</tbody></table>;
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
    }
  }
};

export default { component: SpectrumTable, definition };
