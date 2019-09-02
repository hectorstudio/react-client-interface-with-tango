import React, { Component, FormEvent, CSSProperties } from "react";
import { WidgetProps } from "./types";

import {
  WidgetDefinition,
  NumberInputDefinition,
  BooleanInputDefinition,
  CommandInputDefinition,
  StringInputDefinition
} from "../types";

function timeout(seconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds);
  });
}

type Inputs = {
  command: CommandInputDefinition;
  showDevice: BooleanInputDefinition;
  showCommand: BooleanInputDefinition;
  title: StringInputDefinition;
  requireConfirmation: BooleanInputDefinition;
  displayOutput: BooleanInputDefinition;
  cooldown: NumberInputDefinition;
}

type Props = WidgetProps<Inputs>;

interface State {
  input: string;
  pending: boolean;
  cooldown: boolean;
}

class CommandWriter extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      input: "",
      pending: false,
      cooldown: false
    };
    this.handleExecute = this.handleExecute.bind(this);
  }

  public render() {
    const { mode, inputs } = this.props;
    const { command, showDevice, showCommand } = inputs;
    const { device, command: commandName, parameter=undefined} = command;

    //const unit = mode === "run" ? command.unit : "unit";
    const deviceLabel = device || "device";
    const commandLabel = commandName || "command";

    const label = [
      ...(showDevice ? [deviceLabel] : []),
      ...(showCommand ? [commandLabel] : [])
    ].join("/");

    const dataType = this.dataType(parameter);

    if (
      mode === "run" &&
      dataType !== "numeric" &&
      dataType !== "string" &&
      dataType !== "undefined"
    ) {
      return (
        <div style={{ backgroundColor: "red", padding: "0.5em" }}>
          {/*command.dataType*/} not implemented
        </div>
      );
    }

    const isInvalid = false;
    const invalidStyle = isInvalid ? { outline: "1px solid red" } : {};

    const [output, outputStyle] = this.outputAndStyle();
    const fullOutputStyle: CSSProperties = {
      marginLeft: "0.5em",
      fontSize: "80%",
      ...outputStyle
    };

    return (
      <form
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.25em 0.5em"
        }}
        onSubmit={this.handleExecute}
      >
        {label && (
          <span style={{ flexGrow: 0, marginRight: "0.5em" }}>{label}:</span>
        )}
        <input
          type="text"
          style={{
            flexGrow: 1,
            minWidth: "3em",
            ...invalidStyle
          }}
          placeholder={parameter || ""}
          value={this.state.input}
          onChange={e => this.setState({ input: e.target.value })}
        />
        <span style={fullOutputStyle}>{output}</span>
      </form>
    );
  }

  private dataType(
    parameter
  ): "numeric" | "boolean" | "string" | "other" | "undefined" {
    if (typeof parameter !== "string" && parameter !== undefined)
      return "other";
    else if (parameter === undefined) return "undefined";
    else if (parameter === "numeric") return "numeric";
    else return "string";
  }

  private async handleExecute(event: FormEvent<HTMLFormElement>) {
    if (this.state.pending) {
      return;
    }

    event.preventDefault();

    const { command, requireConfirmation, cooldown } = this.props.inputs;
    const { input } = this.state;

    const message = `Confirm executing "${command.command}" on "${
      command.device
    }" with parameter "${input}"`;

    /* eslint-disable no-restricted-globals */
    if (!requireConfirmation || confirm(message)) {
      this.setState({ input: "", pending: true });
      command.execute(input);
      this.setState({ input: "", pending: false });

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
} // class CommandWriter

const definition: WidgetDefinition<Inputs> = {
  type: "COMMAND_WRITER",
  name: " Command Writer",
  defaultHeight: 2,
  defaultWidth: 15,
  inputs: {
    title: {
      type: "string",
      label: "Title",
    },
    command: {
      label: "",
      type: "command",
      required: true,
      intype: "DevString"
    },
    showDevice: {
      type: "boolean",
      label: "Show Device Name",
      default: true
    },
    showCommand: {
      type: "boolean",
      label: "Show Commnad Name",
      default: true
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
    }
  }
};

export default {
  definition,
  component: CommandWriter
};
