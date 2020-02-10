import React from "react";
<<<<<<< HEAD
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
=======
import { WidgetDefinition } from "../types";

const Inner = ({ mode, text }) => {
  if (mode === "library") {
    return "Label";
>>>>>>> origin/master
  }

  if (text === "" && mode === "edit") {
    return <span style={{ fontStyle: "italic" }}>Empty</span>;
  }
<<<<<<< HEAD
  const style = {fontSize: size + "em"}
  if (font){
    style["fontFamily"] = font;
  }
  const prefix = linkTo.toLowerCase().startsWith("http") ? "" : "http://"
  const content = linkTo? <a href={prefix + linkTo} target="_blank" rel="noopener noreferrer">{text}</a> : text;
  return <span title={`Visit ${linkTo}`} style={style}>{content}</span>
  
};

const Label = (props: Props) => {
  const { inputs, mode, actualWidth, actualHeight } = props;
  const { text, backgroundColor, textColor, linkTo, size, font } = inputs;

=======

  return text;
};

const Label = ({ mode, inputs, actualWidth, actualHeight }) => {
  const { text, backgroundColor } = inputs;
>>>>>>> origin/master
  return (
    <div
      style={{
        padding: "0.5em",
        backgroundColor,
<<<<<<< HEAD
        color: textColor,
        wordBreak: "break-word",
        height: actualHeight,
        width: (mode === "library" ? "100%" : actualWidth),
      }}
    >
      <Inner mode={mode} text={text} linkTo={linkTo} size={size} font={font} />
=======
        wordBreak: "break-word",
        height: actualHeight,
        width: actualWidth
      }}
    >
      <Inner mode={mode} text={text} />
>>>>>>> origin/master
    </div>
  );
};

<<<<<<< HEAD
const definition: WidgetDefinition<Inputs> = {
=======
const definition: WidgetDefinition = {
>>>>>>> origin/master
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
<<<<<<< HEAD
    textColor: {
      label: "Text Color",
      type: "color",
      default: "#000"
    },
=======
>>>>>>> origin/master
    backgroundColor: {
      label: "Background Color",
      type: "color",
      default: "#ffffff"
<<<<<<< HEAD
    },
    size: {
      label: "Text size (in units)",
      type: "number",
      default: 1,
      nonNegative: true,
    },
    font: {
      type: "select",
      default: "Helvetica",
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
=======
>>>>>>> origin/master
    }
  }
};

export default { definition, component: Label };
