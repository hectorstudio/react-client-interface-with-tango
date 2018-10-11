import React, { Component } from "react";

export default class DeviceName extends Component {
  render() {
    const { device, mode } = this.props;

    if (mode === "library" || device == null) {
      return <i>Device Name</i>;
    }

    if (device === "__parent__") {
      return <i>Parent Device</i>;
    }

    return <span>{device}</span>;
  }
}
