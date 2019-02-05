import React, { Component, CSSProperties } from "react";

import { WidgetProps } from "./types";
import { WidgetDefinition, CommandInput } from "../types";

interface Inputs {
  title: string;
  requireConfirmation: string;
  command: CommandInput;
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
    const outputStyle: CSSProperties = { marginLeft: "0.5em" };

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
        <span style={outputStyle}>{command.output}</span>
      </div>
    );
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
      intype: "void"
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
    }
  }
};

export default { definition, component: CommandExecutor };
