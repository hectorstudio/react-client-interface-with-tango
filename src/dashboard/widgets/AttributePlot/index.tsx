import AttributePlot from "./AttributePlot";
<<<<<<< HEAD
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
  logarithmic: BooleanInputDefinition;
  attributes: ComplexInputDefinition<AttributeComplexInput>;
}

const definition: WidgetDefinition<Inputs> = {
=======
import { WidgetDefinition } from "../../../dashboard/types";

const definition: WidgetDefinition = {
>>>>>>> origin/master
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
<<<<<<< HEAD
    logarithmic: {
      type: "boolean",
      default: false,
      label: "Log y axis"
    },
=======
>>>>>>> origin/master
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
