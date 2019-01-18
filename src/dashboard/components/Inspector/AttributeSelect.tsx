import React, { Component, FormEvent } from "react";

import { fetchAttributes, fetchDeviceNames } from "./api";

interface IProps {
  device?: string;
  attribute?: string;
  onSelect?: (device: string | null, attribute: string | null) => void;
}

interface IState {
  fetchingAttributes: boolean;
  deviceNames: string[];
  attributes: Array<{
    name: string;
    datatype: string;
    dataformat: string;
  }>;
}

export default class AttributeSelect extends Component<IProps, IState> {
  public constructor(props) {
    super(props);
    this.state = { fetchingAttributes: false, deviceNames: [], attributes: [] };
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
  }

  public async componentDidMount() {
    // Eventually shouldn't be done by this component
    const deviceNames = await fetchDeviceNames("kitslab");
    this.setState({ deviceNames });

    this.fetchAttributes();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.device !== prevProps.device) {
      this.setState({ attributes: [] });
      this.fetchAttributes();
    }
  }

  public handleSelectDevice(event: FormEvent<HTMLSelectElement>) {
    this.fetchAttributes();
    const { onSelect } = this.props;
    const newDevice = event.currentTarget.value;
    if (onSelect && newDevice) {
      onSelect(newDevice, null);
    }
  }

  public handleSelectAttribute(event: FormEvent<HTMLSelectElement>) {
    const { onSelect, device } = this.props;
    const newAttribute = event.currentTarget.value;
    if (onSelect && device && newAttribute) {
      onSelect(device, newAttribute);
    }
  }

  public render() {
    const { device, attribute } = this.props;

    return (
      <div>
        <select
          value={device}
          className="form-control"
          onChange={this.handleSelectDevice}
        >
          {device == null && <option>Select device</option>}
          {this.state.deviceNames.map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="form-control"
          value={attribute}
          disabled={false}
          onChange={this.handleSelectAttribute}
        >
          {attribute == null && (
            <option disabled={this.state.fetchingAttributes || device == null}>
              Select attribute
            </option>
          )}
          {this.state.attributes.map(({ name }, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // private filteredAttributes() {
  //   const numericTypes = [
  //     "DevDouble",
  //     "DevFloat",
  //     "DevLong",
  //     "DevLong64",
  //     "DevShort",
  //     "DevUChar",
  //     "DevULong",
  //     "DevULong64",
  //     "DevUShort"
  //   ];
  // }

  private async fetchAttributes() {
    const { device } = this.props;
    if (device) {
      this.setState({ fetchingAttributes: true });
      const attributes = await fetchAttributes("kitslab", device);
      this.setState({ attributes, fetchingAttributes: false });
    }
  }
}
