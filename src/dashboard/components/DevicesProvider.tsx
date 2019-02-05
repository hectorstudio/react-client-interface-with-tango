import React, { Component } from "react";
import { fetchDeviceNames } from "./api";

const deviceContext = React.createContext<{ devices: string[] }>({
  devices: []
});

interface Props {
  tangoDB: string;
}

interface State {
  fetching: boolean;
  devices: string[];
}

export class DeviceProvider extends Component<Props, State> {
  public constructor(props) {
    super(props);
    this.state = { fetching: false, devices: [] };
  }

  public async componentDidMount() {
    this.setState({ fetching: true });
    const { tangoDB } = this.props;
    const devices = await fetchDeviceNames(tangoDB);
    this.setState({ devices, fetching: false });
  }

  public render() {
    return (
      <deviceContext.Provider value={this.state}>
        {this.props.children}
      </deviceContext.Provider>
    );
  }
}

export const DeviceConsumer = deviceContext.Consumer;
