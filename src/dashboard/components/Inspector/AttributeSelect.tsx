import React, { Component, FormEvent } from "react";

import { fetchAttributes } from "../api";
import { DeviceConsumer } from "../DevicesProvider";
import DeviceSuggester from "./DeviceSuggester";

interface IProps {
  device?: string;
  attribute?: string;
  dataFormat?: "scalar" | "spectrum" | "image";
  dataType?: "numeric";
  onSelect?: (device: string | null, attribute: string | null) => void;
}

interface IState {
  fetchingAttributes: boolean;
  attributes: Array<{
    name: string;
    datatype: string;
    dataformat: string;
  }>;
}

export default class AttributeSelect extends Component<IProps, IState> {
  public constructor(props:IProps) {
    super(props);
    this.state = { fetchingAttributes: false, attributes: [] };
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
  }

  public componentDidMount() {
    this.fetchAttributes();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.device !== prevProps.device) {
      this.setState({ attributes: [] });
      this.fetchAttributes();
    }
  }

  public handleSelectDevice(newDevice: string) {
    this.fetchAttributes();
    const { onSelect } = this.props;
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
    const attributes = this.filteredAttributes();

    return (
      <DeviceConsumer>
        {({ devices }) => (
          <div>
            <DeviceSuggester 
              deviceName={device}
              devices={devices}
              onSelection={newValue => this.handleSelectDevice(newValue)}
            />

            <select
              className="form-control"
              value={attribute}
              disabled={false}
              onChange={this.handleSelectAttribute}
            >
              {attributes.length > 0 && attribute == null && (
                <option
                  disabled={this.state.fetchingAttributes || device == null}
                  value={""}
                >
                  Select an attribute...
                </option>
              )}
              {attributes.length === 0 && (
                <option value={""} disabled={true} selected={true}>No attributes</option>
              )}
              {attributes.map(({ name }, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </DeviceConsumer>
    );
  }

  private filteredAttributes() {
    const numericTypes = [
      "DevDouble",
      "DevFloat",
      "DevLong",
      "DevLong64",
      "DevShort",
      "DevUChar",
      "DevULong",
      "DevULong64",
      "DevUShort"
    ];

    return this.state.attributes.filter(attr => {
      const { dataType, dataFormat } = this.props;

      if (dataFormat === "scalar" && attr.dataformat !== "SCALAR") {
        return false;
      } else if (dataFormat === "spectrum" && attr.dataformat !== "SPECTRUM") {
        return false;
      } else if (dataFormat === "image" && attr.dataformat !== "IMAGE") {
        return false;
      } else if (
        dataType === "numeric" &&
        numericTypes.indexOf(attr.datatype) === -1
      ) {
        return false;
      } else {
        return true;
      }
    });
  }

  private async fetchAttributes() {
    const { device } = this.props;
    if (device) {
      this.setState({ fetchingAttributes: true });
      const attributes = await fetchAttributes("kitslab", device);
      this.setState({ attributes, fetchingAttributes: false });
    }
  }
}
