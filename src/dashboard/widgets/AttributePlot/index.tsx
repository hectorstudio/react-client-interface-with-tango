import AttributePlot from "./AttributePlot";
import { WidgetDefinition } from "src/dashboard/types";

const definition: WidgetDefinition = {
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
