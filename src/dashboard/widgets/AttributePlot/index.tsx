import AttributePlot from "./AttributePlot";
import {
  WidgetDefinition,
  NumberInputDefinition,
  BooleanInputDefinition,
  ComplexInputDefinition,
  AttributeInputDefinition,
  SelectInputDefinition
} from "../../../dashboard/types";

export interface AttributeComplexInput {
  attribute: AttributeInputDefinition;
  yAxis: SelectInputDefinition<"left" | "right">;
}

export type Inputs = {
  timeWindow: NumberInputDefinition;
  showZeroLine: BooleanInputDefinition;
  attributes: ComplexInputDefinition<AttributeComplexInput>;
}

const definition: WidgetDefinition<Inputs> = {
  type: "ATTRIBUTE_PLOT",
  name: "Attribute Plot",
  defaultWidth: 30,
  defaultHeight: 20,
  inputs: {
    timeWindow: {
      type: "number",
      default: 120,
      label: "Time Window"
    },
    showZeroLine: {
      type: "boolean",
      default: true,
      label: "Show Zero Line"
    },
    attributes: {
      label: "Graphs",
      type: "complex",
      repeat: true,
      inputs: {
        attribute: {
          label: "",
          type: "attribute",
          required: true,
          dataFormat: "scalar",
          dataType: "numeric"
        },
        yAxis: {
          type: "select",
          default: "left",
          label: "Y Axis",
          options: [
            {
              name: "Left",
              value: "left"
            },
            {
              name: "Right",
              value: "right"
            }
          ]
        }
      }
    }
  }
};

export default { definition, component: AttributePlot };
