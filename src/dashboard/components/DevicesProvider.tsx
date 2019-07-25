import React, { Component } from "react";
import { fetchDeviceNames } from "./api";

interface Props {
  tangoDB: string;
}

interface State {
  fetching: boolean;
  error: boolean;
  devices: string[];
  tangoDB: string;
}

const initialState: Readonly<State> = {
  fetching: false,
  error: false,
  devices: [],
  tangoDB: ""
};

const deviceContext = React.createContext<State>({ ...initialState });

export class DeviceProvider extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { ...initialState, tangoDB: props.tangoDB };
  }

  public async componentDidMount() {
    this.setState({ fetching: true });
    const { tangoDB } = this.props;
    try {
      const devices = await fetchDeviceNames(tangoDB);
      const error = devices.length === 0;
      this.setState({ devices, fetching: false, error });
    } catch (err) {
      this.setState({ fetching: false, error: true });
    }
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
