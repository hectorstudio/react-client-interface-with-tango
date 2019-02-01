import React, { Component, CSSProperties } from "react";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class CommandExecutor extends Component<IWidgetProps> {
  public render() {
    const { mode, inputs } = this.props;
    const { title, requireConfirmation, command } = inputs;
    const actualTitle = title || command.command || "command";

    const style: CSSProperties = mode === "run" ? {} : { pointerEvents: "none" };

    return (
      <div style={{ padding: "0.25em" }}>
        <button
          style={style}
          onClick={() => {
            const message = `Confirm execution of ${command.command} on ${
              command.device
            }`;
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
      type: "command",
      required: true
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
