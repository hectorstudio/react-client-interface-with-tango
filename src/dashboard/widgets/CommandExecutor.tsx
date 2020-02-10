import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
<<<<<<< HEAD
import {
  WidgetDefinition,
  StringInputDefinition,
  BooleanInputDefinition,
  CommandInputDefinition,
  NumberInputDefinition,
  ColorInputDefinition,
  SelectInputDefinition
} from "../types";
=======
import { WidgetDefinition, CommandInput } from "../types";
>>>>>>> origin/master

function timeout(seconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds);
  });
}

<<<<<<< HEAD
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
=======
interface Inputs {
  title: string;
  requireConfirmation: string;
  command: CommandInput;
  displayOutput: boolean;
  cooldown: number;
}
>>>>>>> origin/master

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
<<<<<<< HEAD
    const { title, command, backgroundColor, textColor, size, font } = inputs;
=======
    const { title, command } = inputs;
>>>>>>> origin/master
    const actualTitle = title || command.command || "command";

    const extraStyle = mode === "library" ? { margin: "0.25em" } : {};
    const containerStyle: CSSProperties = {
      padding: "0.25em",
<<<<<<< HEAD
      backgroundColor,
      color: textColor,
      fontSize: size + "em",
      ...extraStyle
    };
    if (font){
      containerStyle["fontFamily"] = font;
    }
=======
      ...extraStyle
    };

>>>>>>> origin/master
    const [output, outputStyle] = this.outputAndStyle();
    const fullOutputStyle: CSSProperties = {
      marginLeft: "0.5em",
      ...outputStyle
    };

    return (
      <div style={containerStyle}>
<<<<<<< HEAD
        <button style={{border: "none", borderRadius: "2px", color: backgroundColor, backgroundColor: textColor}} disabled={this.state.cooldown} onClick={this.handleExecute}>
=======
        <button disabled={this.state.cooldown} onClick={this.handleExecute}>
>>>>>>> origin/master
          {actualTitle}
        </button>
        <span style={fullOutputStyle}>{output}</span>
      </div>
    );
  }

  private async handleExecute() {
    const { command, requireConfirmation, cooldown } = this.props.inputs;

<<<<<<< HEAD
    const message = `Confirm executing "${command.command}" on "${command.device}"`;
=======
    const message = `Confirm executing "${command.command}" on "${
      command.device
    }"`;
>>>>>>> origin/master

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

<<<<<<< HEAD
const definition: WidgetDefinition<Inputs> = {
=======
const definition: WidgetDefinition = {
>>>>>>> origin/master
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
<<<<<<< HEAD
      default: ""
=======
      default: "",
>>>>>>> origin/master
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
<<<<<<< HEAD
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
=======
>>>>>>> origin/master
    }
  }
};

export default { definition, component: CommandExecutor };
