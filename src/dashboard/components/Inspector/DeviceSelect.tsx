import React, { Component } from "react";

import DeviceSuggester from "./DeviceSuggester";
import { DeviceConsumer } from "../DevicesProvider";

interface Props {
  tangoDB: string;
  device: string;
  onSelect: (device: string) => void;
}

export default class DeviceSelect extends Component<Props> {
  public render() {
    return (
      <DeviceConsumer>
        {({ devices }) => (
          <DeviceSuggester
            devices={devices}
            deviceName={this.props.device}
            onSelection={device => this.props.onSelect(device)}
          />
        )}
      </DeviceConsumer>
    );
  }
}
