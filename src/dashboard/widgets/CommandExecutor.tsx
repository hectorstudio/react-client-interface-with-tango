import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
import {
  WidgetDefinition,
  StringInputDefinition,
  BooleanInputDefinition,
  CommandInputDefinition,
  NumberInputDefinition,
  ColorInputDefinition,
  SelectInputDefinition
} from "../types";

function timeout(seconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds);
  });
}

type Inputs = {
  title: StringInputDefinition;
  requireConfirmation: BooleanInputDefinition;
  command: CommandInputDefinition;
  displayOutput: BooleanInputDefinition;
  cooldown: NumberInputDefinition;
  textColor: ColorInputDefinition;
  backgroundColor: ColorInputDefinition;
  size: NumberInputDefinition;
  font: SelectInputDefinition;
};

type Props = WidgetProps<Inputs>;

interface State {
  cooldown: boolean;
}

class CommandExecutor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { cooldown: false };
    this.handleExecute = this.handleExecute.bind(this);
  }

  public render() {
    const { mode, inputs } = this.props;
    const { title, command, backgroundColor, textColor, size, font } = inputs;
    const actualTitle = title || command.command || "command";

    const extraStyle = mode === "library" ? { margin: "0.25em" } : {};
    const containerStyle: CSSProperties = {
      padding: "0.25em",
      backgroundColor,
      color: textColor,
      fontSize: size + "em",
      ...extraStyle
    };
    if (font){
      containerStyle["fontFamily"] = font;
    }
    const [output, outputStyle] = this.outputAndStyle();
    const fullOutputStyle: CSSProperties = {
      marginLeft: "0.5em",
      ...outputStyle
    };

    return (
      <div style={containerStyle}>
        <button style={{border: "none", borderRadius: "2px", color: backgroundColor, backgroundColor: textColor}} disabled={this.state.cooldown} onClick={this.handleExecute}>
          {actualTitle}
        </button>
        <span style={fullOutputStyle}>{output}</span>
      </div>
    );
  }

  private async handleExecute() {
    const { command, requireConfirmation, cooldown } = this.props.inputs;

    const message = `Confirm executing "${command.command}" on "${command.device}"`;

    /* eslint-disable no-restricted-globals */
    if (!requireConfirmation || confirm(message)) {
      command.execute();

      if (cooldown > 0) {
        this.setState({ cooldown: true });
        await timeout(1000 * cooldown);
        this.setState({ cooldown: false });
      }
    }
  }

  private outputAndStyle(): [string, CSSProperties] {
    const { mode, inputs } = this.props;
    const { command, displayOutput } = inputs;
    const { output } = command;
    const shownOutput = displayOutput
      ? mode === "run"
        ? output
        : "output"
      : "";

    if (mode !== "run") {
      return [shownOutput, { color: "gray", fontStyle: "italic" }];
    }

    if (displayOutput && output === undefined) {
      return ["n/a", { color: "gray" }];
    }

    return [shownOutput, {}];
  }
}

const definition: WidgetDefinition<Inputs> = {
  type: "COMMAND_EXECUTOR",
  name: "Command Executor",
  defaultHeight: 2,
  defaultWidth: 10,
  inputs: {
    command: {
      label: "",
      type: "command",
      required: true,
      intype: "DevVoid"
    },
    title: {
      type: "string",
      label: "Title",
      default: ""
    },
    requireConfirmation: {
      type: "boolean",
      label: "Require Confirmation",
      default: true
    },
    displayOutput: {
      type: "boolean",
      label: "Display Output",
      default: true
    },
    cooldown: {
      type: "number",
      label: "Cooldown (s)",
      default: 0,
      nonNegative: true
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
      label: "Text size (in units)",
      type: "number",
      default: 1,
      nonNegative: true
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
    }
  }
};

export default { definition, component: CommandExecutor };
