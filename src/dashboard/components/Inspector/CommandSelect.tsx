import React, { Component, FormEvent } from "react";
import { DeviceConsumer } from "../DevicesProvider";
import DeviceSuggester from "./DeviceSuggester";
import { fetchCommands } from "../api";

interface Command {
  name: string;
  intype: string;
}

interface Props {
  tangoDB: string;
  device: string;
  command: string;
  inputType?: string;
  onSelect: (device: string, command: string | null) => void;
}

interface State {
  fetchingCommands: boolean;
  commands: Command[];
}

export default class CommandSelect extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { fetchingCommands: false, commands: [] };
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectCommand = this.handleSelectCommand.bind(this);
  }

  public componentDidMount() {
    this.fetchCommands();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.device !== prevProps.device) {
      this.setState({ commands: [] });
      this.fetchCommands();
    }
  }

  public handleSelectDevice(newDevice: string) {
    this.fetchCommands();
    const { onSelect } = this.props;
    if (onSelect && newDevice) {
      onSelect(newDevice, null);
    }
  }

  public handleSelectCommand(event: FormEvent<HTMLSelectElement>) {
    const { onSelect, device } = this.props;
    const newCommand = event.currentTarget.value;
    if (onSelect && device && newCommand) {
      onSelect(device, newCommand);
    }
  }

  public render() {
    const { device, command } = this.props;
    const commands = this.filteredCommands();

    return (
      <DeviceConsumer>
        {({ devices }) => {
          const hasDevice = device != null && device !== "";
          const hasCommands = commands.length > 0;

          return (
            <div className="CommandSelect">
              <DeviceSuggester
                deviceName={device}
                devices={devices}
                onSelection={newValue => this.handleSelectDevice(newValue)}
              />

              <select
                className="form-control"
                value={command}
                disabled={hasCommands === false}
                onChange={this.handleSelectCommand}
              >
                {hasDevice === false && (
                  <option selected={true} value="">
                    Pick a device first
                  </option>
                )}
                {hasDevice && hasCommands === false && (
                  <option value="" selected={true}>
                    No commands
                  </option>
                )}
                {hasDevice && hasCommands && (
                  <option value="" disabled={true} selected={true}>
                    Select command...
                  </option>
                )}
                {commands.map(({ name }, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      </DeviceConsumer>
    );
  }

  private filteredCommands() {
    const { commands } = this.state;
    const { inputType } = this.props;

    if (inputType != null) {
      return commands.filter(({ intype }) => intype === inputType);
    }

    return commands;
  }

  private async fetchCommands() {
    const { device, tangoDB } = this.props;
    if (device) {
      this.setState({ commands: [], fetchingCommands: true });
      const commands = await fetchCommands(tangoDB, device);
      this.setState({ commands, fetchingCommands: false });
    }
  }
}
