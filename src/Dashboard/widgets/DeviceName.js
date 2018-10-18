import React, { Component } from "react";
import PropTypes from 'prop-types'

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

DeviceName.propTypes = {
  attribute: PropTypes.string, //always null for this component?
  device: PropTypes.string,
  mode: PropTypes.string,
  params: PropTypes.object, //always empty for this component?
}