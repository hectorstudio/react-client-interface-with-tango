import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition, CommandInput } from "../types";

interface Inputs {
  title: string;
  requireConfirmation: string;
  command: CommandInput;
  displayOutput: boolean;
}

type Props = WidgetProps<Inputs>;

class CommandExecutor extends Component<Props> {
  public render() {
    const { mode, inputs } = this.props;
    const { title, requireConfirmation, command } = inputs;
    const actualTitle = title || command.command || "command";

    const style: CSSProperties =
      mode === "run" ? {} : { pointerEvents: "none" };

    const containerStyle: CSSProperties = { padding: "0.25em" };
    const [output, outputStyle] = this.outputAndStyle();
    const fullOutputStyle: CSSProperties = {
      marginLeft: "0.5em",
      ...outputStyle
    };

    return (
      <div style={containerStyle}>
        <button
          style={style}
          onClick={() => {
            const message = `Confirm executing "${command.command}" on "${
              command.device
            }"`;
            if (!requireConfirmation || confirm(message)) {
              command.execute();
            }
          }}
        >
          {actualTitle}
        </button>
        <span style={fullOutputStyle}>{output}</span>
      </div>
    );
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

const definition: WidgetDefinition = {
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
    }
  }
};

export default { definition, component: CommandExecutor };
