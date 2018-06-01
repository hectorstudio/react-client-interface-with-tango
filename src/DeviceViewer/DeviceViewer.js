import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import { fetchDevice } from '../actions/tango';

import Spinner from '../Spinner/Spinner';

import './DeviceViewer.css';

import {
  getCurrentDeviceAttributes,
  getCurrentDeviceProperties,
  getCurrentDeviceName,
  getDeviceIsLoading
} from '../selectors/devices';

const DeviceTables = ({properties, attributes}) =>
  <div className="list">
    <h2>Properties</h2>
    <table>
      <tbody>
      {properties && properties.map((prop, i) =>
        <tr key={i}>
          <td>{prop.name}</td>
          <td>{prop.value}</td>
        </tr>
      )}
      </tbody>
    </table>
    
    <h2>Attributes</h2>
    <table>
      <tbody>
      {attributes && attributes.map((attr, i) =>
        <tr key={i}>
          <td>{attr.name}</td>
          <td>{attr.value}</td>
        </tr>
      )}
      </tbody>
    </table>
  </div>;

class DeviceViewer extends Component {
  parseDevice(props) {
    return (props || this.props).match.params.device;
  }

  componentDidMount() {
    const device = this.parseDevice();
    this.props.fetchDevice(device);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    if (device !== this.parseDevice(prevProps)) {
      this.props.fetchDevice(device);
    }
  }

  render() {
    const {properties, attributes, loading} = this.props;
    const content = loading
      ? <Spinner/>
      : <DeviceTables attributes={attributes} properties={properties}/>;

    return (
      <div className="device-viewer">
        <h1>{this.parseDevice(this.props)}</h1>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: getCurrentDeviceName(state),
    attributes: getCurrentDeviceAttributes(state),
    properties: getCurrentDeviceProperties(state),
    loading: getDeviceIsLoading(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDevice: device => dispatch(fetchDevice(device))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceViewer));