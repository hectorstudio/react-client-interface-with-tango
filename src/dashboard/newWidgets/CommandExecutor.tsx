import React, { Component } from "react";

import { IWidgetProps } from "./types";
import { IWidgetDefinition } from "../types";

class CommandExecutor extends Component<IWidgetProps> {
  public render() {
    return (
      <div style={{ padding: "0.25em" }}>
        <button>Click Me!</button>
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
      type: "command"
    }
  }
};

export default { definition, component: CommandExecutor };
