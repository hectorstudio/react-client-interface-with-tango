import React, { Component } from "react";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class CommandExecutor extends Component<IWidgetProps> {
  public render() {
    const { title, requireConfirmation, command } = this.props.inputs;
    const actualTitle = title || command.command || "command";

    return (
      <div style={{ padding: "0.25em" }}>
        <button
          onClick={() => {
            const message = `Confirm execution of ${command.command} on ${command.device}`;
            if (!requireConfirmation || confirm(message)) {
              command.execute();
            }
          }}
        >
          {actualTitle}
        </button>
      </div>
    );
  }
}

const definition: IWidgetDefinition = {
  type: "COMMAND_EXECUTOR",
  name: "Command Executor",
  defaultHeight: 2,
  defaultWidth: 10,
  inputs: {
    command: {
      label: "",
      type: "command"
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
