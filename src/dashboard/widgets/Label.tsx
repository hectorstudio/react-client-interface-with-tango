import React from "react";
import {
  WidgetDefinition,
  StringInputDefinition,
  ColorInputDefinition,
  NumberInputDefinition,
  SelectInputDefinition
} from "../types";
import { WidgetProps } from "./types";

type Inputs = {
  text: StringInputDefinition;
  backgroundColor: ColorInputDefinition;
  textColor: ColorInputDefinition;
  linkTo: StringInputDefinition;
  size: NumberInputDefinition;
  font: SelectInputDefinition;
}

type Props = WidgetProps<Inputs>;

const Inner = ({ mode, text, linkTo, size, font}) => {
  if (mode === "library") {
    return <span>Label</span>;
  }

  if (text === "" && mode === "edit") {
    return <span style={{ fontStyle: "italic" }}>Empty</span>;
  }
  const style = {fontSize: size + "em"}
  if (font){
    style["fontFamily"] = font;
  }

  const content = linkTo? <a href={'//' + linkTo} target="_blank" rel="noopener noreferrer">{text}</a> : text;
  return <span title={`Visit ${linkTo}`} style={style}>{content}</span>
  
};

const Label = (props: Props) => {
  const { inputs, mode, actualWidth, actualHeight } = props;
  const { text, backgroundColor, textColor, linkTo, size, font } = inputs;

  return (
    <div
      style={{
        padding: "0.5em",
        backgroundColor,
        color: textColor,
        wordBreak: "break-word",
        height: actualHeight,
        width: actualWidth
      }}
    >
      <Inner mode={mode} text={text} linkTo={linkTo} size={size} font={font} />
    </div>
  );
};

const definition: WidgetDefinition<Inputs> = {
  type: "LABEL",
  name: "Label",
  defaultHeight: 2,
  defaultWidth: 10,
  inputs: {
    text: {
      label: "Text",
      type: "string",
      default: ""
    },
    textColor: {
      label: "Text Color",
      type: "color",
      default: "#000"
    },
    backgroundColor: {
      label: "Background Color",
      type: "color",
      default: "#ffffff"
    },
    size: {
      label: "Size (in units)",
      type: "number",
      default: 1,
      nonNegative: true,
    },
    font: {
      type: "select",
      default: "Default (Helvetica)",
      label: "Font type",
      options: [
        {
          name: "Default (Helvetica)",
          value: "Helvetica"
        },
        {
          name: "Monospaced (Courier new)",
          value: "Courier new"
        }
      ]
    },
    linkTo: {
      label: "Link to",
      type: "string",
      default: "",
      placeholder: "Optional link URL"
    }
  }
};

export default { definition, component: Label };
