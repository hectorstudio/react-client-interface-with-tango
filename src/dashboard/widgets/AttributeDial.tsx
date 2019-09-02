import React, { Component } from "react";
import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  AttributeInputDefinition,
  NumberInputDefinition,
  SelectInputDefinition,
  BooleanInputDefinition
} from "../types";

type Inputs = {
  attribute: AttributeInputDefinition;
  min: NumberInputDefinition;
  max: NumberInputDefinition;
  label: SelectInputDefinition<"attribute" | "device">;
  showWriteValue: BooleanInputDefinition;
};

type Props = WidgetProps<Inputs>;

function normalizeWithFlex(
  value: number,
  min: number,
  max: number,
  flex: number = 0
): number {
  let result = (value - min) / (max - min);
  result = Math.min(result, 1 + flex);
  result = Math.max(result, 0 - flex);
  return result;
}

function normalizedValueToAngle(value: number) {
  return -225 + value * 270;
}

interface HandProps {
  radius: number;
  innerRadius: number;
  width: number;
  angle: number;
  color: string;
  boltColor?: string;
  animationDuration: number;
}

function Hand(props: HandProps) {
  const {
    radius,
    innerRadius,
    width,
    angle,
    color,
    boltColor,
    animationDuration
  } = props;

  const handBackLength = 0.25 * innerRadius;
  const handCenterRadius = 0.075 * radius;
  const transition = `transform ${animationDuration}s ease-in-out`;

  return (
    <g transform={`translate(${radius} ${radius})`}>
      <path
        style={{
          transform: `rotate(${angle}deg)`,
          transition
        }}
        d={`
    M0 ${width}
    L${0.95 * innerRadius} ${0.15 * width}
    l0 ${-0.3 * width}
    L0 -${width}
    l-${handBackLength} 0
    l0 ${2 * width}
    Z`}
        fill={color}
      />
      <circle r={handCenterRadius} cx={0} cy={0} fill={color} />
      <circle
        r={0.5 * handCenterRadius}
        cx={0}
        cy={0}
        fill={boltColor || color}
      />
    </g>
  );
}

class AttributeDial extends Component<Props> {
  public render() {
    const { mode, inputs, actualWidth, actualHeight } = this.props;
    const { min, max, attribute, label, showWriteValue } = inputs;

    const radius =
      mode === "library" ? 60 : Math.min(actualHeight, actualWidth) / 2;
    const libraryProps = mode === "library" ? { margin: "0.5em" } : {};

    const value = attribute.value || 0;
    const writeValue = mode === "run" ? attribute.writeValue : (min + max) / 2;

    const normalized = normalizeWithFlex(value, min, max, 0.02);
    const angle = normalizedValueToAngle(normalized);

    const handWidth = 0.05 * radius;
    const handColor = "red";
    const boltColor = "darkred";
    const innerRadius = 0.9 * radius;

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
          transform: "scale(0.95)",
          ...libraryProps
        }}
      >
        <svg width={2 * radius} height={2 * radius}>
          <circle r={radius} cx={radius} cy={radius} fill="darkgray" />
          <circle r={innerRadius} cx={radius} cy={radius} fill="white" />

          {showWriteValue && (
            <Hand
              radius={radius}
              innerRadius={innerRadius}
              width={0.9 * handWidth}
              angle={normalizedValueToAngle(
                normalizeWithFlex(writeValue, min, max, 0.02)
              )}
              color={"lightgray"}
              animationDuration={0.2}
            />
          )}

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
            <Hand
              radius={radius}
              innerRadius={innerRadius}
              width={handWidth}
              angle={angle}
              color={handColor}
              boltColor={boltColor}
              animationDuration={2}
            />
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

const definition: WidgetDefinition<Inputs> = {
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
    },
    showWriteValue: {
      type: "boolean",
      label: "Show Write Value",
      default: false
    }
  }
};

export default { component: AttributeDial, definition };
