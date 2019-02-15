import React, { Component } from "react";
import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";

interface Input {
  attribute: AttributeInput;
  min: number;
  max: number;
}

type Props = WidgetProps<Input>;

function normalize(value: number, min: number, max: number) {
  const normed = (value - min) / (max - min);
  if (normed > 1) {
    return 1;
  } else if (normed < 0) {
    return 0;
  } else {
    return normed;
  }
}

function normalizedValueToAngle(value: number) {
  return -255 + value * 270;
}

class AttributeDial extends Component<Props> {
  public render() {
    const { mode, inputs, actualWidth, actualHeight } = this.props;
    const { min, max, attribute } = inputs;

    const radius =
      mode === "library" ? 40 : Math.min(actualHeight, actualWidth) / 2;
    const libraryProps =
      mode === "library" ? { marginLeft: "0.5em", marginTop: "0.5em" } : {};

    const style = {
      width: 2 * radius,
      height: 2 * radius,
      backgroundColor: "lightgray",
      borderRadius: radius,
      border: `${0.05 * radius}px solid gray`
    };

    const value = attribute.value || 0;
    const normalized = normalize(value, min, max);
    const angle = normalizedValueToAngle(normalized);
    const transform = `rotate(${angle}deg) scaleX(0.7)`;

    const handWidth = 0.2 * radius;

    const hand = (
      <div
        style={{
          position: "absolute",
          top: radius - handWidth / 2,
          left: radius,
          width: radius, // Hand length
          height: handWidth, // Hand width
          backgroundColor: "black",
          clipPath: "polygon(0 0, 100% 40%, 100% 60%, 0 100%)",
          transformOrigin: "0 50%",
          transition: "transform 2s ease-in-out",
          transform
        }}
      />
    );

    const minLabel = (
      <div
        style={{
          fontSize: 0.2 * radius,
          position: "absolute",
          left: 0,
          bottom: 0,
          transform: "rotateZ(45deg)"
        }}
      >
        {min}
      </div>
    );

    const maxLabel = (
      <div
        style={{
          fontSize: 0.2 * radius,
          position: "absolute",
          right: 0,
          bottom: 0,
          transform: "rotateZ(-45deg)"
        }}
      >
        {max}
      </div>
    );

    const numTicks = 10;
    const ticks = Array(numTicks)
      .fill(0)
      .map((_, tick) => {
        const angle2 = -225 + (tick / (numTicks - 1)) * 270;
        const lastOrFirst = tick === 0 || tick === numTicks - 1;
        const transform2 = `rotate(${angle2}deg) translateX(${
          lastOrFirst ? 78 : 87
        }%) scaleX(${lastOrFirst ? 0.15 : 0.1})`;

        return (
          <div
            key={tick}
            style={{
              position: "absolute",
              top: radius,
              left: radius,
              width: radius,
              height: (lastOrFirst ? 0.06 : 0.02) * radius,
              backgroundColor: "black",
              transformOrigin: "0 50%",
              transition: "transform 1s ease-in-out",
              transform: transform2
            }}
          />
        );
      });

    const knob = (
      <div
        style={{
          width: 0.25 * radius,
          height: 0.25 * radius,
          borderRadius: 0.25 * radius,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "auto",
          marginBottom: "auto",
          backgroundColor: "gray"
        }}
      />
    );

    return (
      <div
        style={{
          position: "relative",
          width: 2 * radius,
          height: 2 * radius,
          ...libraryProps
        }}
      >
        <div style={style}>
          {minLabel}
          {maxLabel}
          {hand}
          {ticks}
          {knob}
        </div>
      </div>
    );
  }
}

const definition: WidgetDefinition = {
  type: "ATTRIBUTE_DIAL",
  name: "Attribute Dial",
  defaultWidth: 5,
  defaultHeight: 5,
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
      default: 0
    },
    max: {
      type: "number",
      default: 10
    }
  }
};

export default { component: AttributeDial, definition };
