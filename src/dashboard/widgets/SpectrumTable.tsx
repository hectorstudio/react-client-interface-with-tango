import React, { Component } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  BooleanInputDefinition,
  AttributeInputDefinition
} from "../types";

// prettier-ignore
const sampleData = [0, -2, 3, -2, 1, -5, 4, -3, -2, -4, 0, -4, 2, 2, -2, -2, 2, -5, -2, -3, 0];

type Inputs = {
  attribute: AttributeInputDefinition;
  showTitle: BooleanInputDefinition;
};

interface State {
  min?: number;
  max?: number;
}

type Props = WidgetProps<Inputs>;

class SpectrumTable extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate() {
    if (this.props.mode !== "run") {
      return;
    }

    const { value } = this.props.inputs.attribute;
  }

  public render() {
    const { mode, inputs } = this.props;
    const { attribute, showTitle} = inputs;
  
    return (
      <div>
        Spectrum Table
      </div>
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
