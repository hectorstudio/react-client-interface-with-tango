import React, { Component } from "react";
import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";

interface Input {
  attribute: AttributeInput;
  min: number;
  max: number;
  label: string;
}

type Props = WidgetProps<Input>;

function normalizeWithFlex(
  value: number,
  min: number,
  max: number,
  flex: number = 0
): number {
  const normed = (value - min) / (max - min);
  if (normed > 1 + flex) {
    return Math.min(normed, 1 + flex);
  } else if (normed < 0 - flex) {
    return Math.max(normed, 0 - flex);
  } else {
    return normed;
  }
}

function normalizedValueToAngle(value: number) {
  return -225 + value * 270;
}

class AttributeDial extends Component<Props> {
  public render() {
    const { mode, inputs, actualWidth, actualHeight } = this.props;
    const { min, max, attribute, label } = inputs;

    const radius =
      mode === "library" ? 60 : Math.min(actualHeight, actualWidth) / 2;
    const libraryProps = mode === "library" ? { margin: "0.5em" } : {};

    const value = attribute.value || 0;
    const normalized = normalizeWithFlex(value, min, max, 0.02);
    const angle = normalizedValueToAngle(normalized);

    const handWidth = 0.05 * radius;
    const handCenterRadius = 0.075 * radius;
    const handColor = "red";
    const innerRadius = 0.9 * radius;
    const handBackLength = 0.25 * innerRadius;

    const numBigTickMarks = 10;
    const numSmallPerBig = 5;
    const totalNumTickMarks = numBigTickMarks * numSmallPerBig + 1;
    const tickSectorAngle = 270 / (totalNumTickMarks - 1);

    const labelShown = attribute[label] || label;

    return (
      <div
        style={{
          position: "relative",
          width: 2 * radius,
          height: 2 * radius,
          userSelect: "none",
          ...libraryProps
        }}
      >
        <svg width={2 * radius} height={2 * radius}>
          <circle r={radius} cx={radius} cy={radius} fill="darkgray" />
          <circle r={innerRadius} cx={radius} cy={radius} fill="white" />

          {Array(totalNumTickMarks)
            .fill(0)
            .map((_, i) => {
              const isBig = i % numSmallPerBig === 0;
              const tickAngle = 45 - i * tickSectorAngle;
              const textRotation =
                90 + (tickAngle < -180 || tickAngle > 0 ? 180 : 0);
              const delta = max - min;
              const tickValue =
                min + delta * (1 - i / numBigTickMarks / numSmallPerBig);
              const tickLabel =
                Math.abs(delta) > 1000
                  ? tickValue.toExponential(0).replace("+", "")
                  : Math.round(tickValue * 100) / 100;

              return (
                <g
                  key={i}
                  transform={`translate(${radius} ${radius}) rotate(${tickAngle})`}
                >
                  {isBig && (
                    <text
                      style={{ fontSize: 0.1 * radius }}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      x={0}
                      y={0}
                      transform={`translate(${0.8 *
                        innerRadius} 0) rotate(${textRotation}) `}
                    >
                      {tickLabel}
                    </text>
                  )}
                  <line
                    x1={(isBig ? 0.9 : 0.95) * innerRadius}
                    y1={0}
                    x2={innerRadius}
                    y2={0}
                    stroke="black"
                    strokeWidth={0.01 * radius * (isBig ? 2 : 1)}
                  />
                </g>
              );
            })}

          {min !== max && (
            <g transform={`translate(${radius} ${radius})`}>
              <path
                style={{
                  transform: `rotate(${angle}deg)`,
                  transition: "transform 2s ease-in-out"
                }}
                d={`
                M0 ${handWidth}
                L${0.95 * innerRadius} ${0.15 * handWidth}
                l0 ${-0.3 * handWidth}
                L0 -${handWidth}
                l-${handBackLength} 0
                l0 ${2 * handWidth}
                Z`}
                fill={handColor}
              />
              <circle r={handCenterRadius} cx={0} cy={0} fill={handColor} />
              <circle
                r={0.5 * handCenterRadius}
                cx={0}
                cy={0}
                fill="darkred"
              />
            </g>
          )}

          <text
            textAnchor="middle"
            x={radius}
            y={1.6 * radius}
            style={{ fontSize: 0.1 * radius }}
            textLength={radius * Math.min(0.05 * labelShown.length, 1)}
            lengthAdjust="spacing"
          >
            {labelShown}
          </text>
        </svg>
      </div>
    );
  }
}

const definition: WidgetDefinition = {
  type: "ATTRIBUTE_DIAL",
  name: "Attribute Dial",
  defaultWidth: 10,
  defaultHeight: 10,
  inputs: {
    attribute: {
      type: "attribute",
      label: "",
      dataFormat: "scalar",
      dataType: "numeric",
      required: true
    },
    min: {
      type: "number",
      label: "Minimum",
      default: 0
    },
    max: {
      type: "number",
      label: "Maximum",
      default: 10
    },
    label: {
      type: "select",
      label: "Label",
      options: [
        { name: "Attribute", value: "attribute" },
        { name: "Device", value: "device" }
      ],
      default: "attribute"
    }
  }
};

export default { component: AttributeDial, definition };
