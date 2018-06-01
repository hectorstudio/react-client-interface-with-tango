import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import { fetchDevice } from '../actions/tango';

import Spinner from '../Spinner/Spinner';

import './DeviceViewer.css';

import {
  getCurrentDeviceProperties,
  getCurrentDeviceName,
  getDeviceIsLoading,
  getAvailableDataFormats,
  getFilteredCurrentDeviceAttributes
} from '../selectors/devices';
import { setDataFormat } from '../actions/deviceList';

const PropertyTable = ({properties}) => 
  <div>
    <h2>Properties</h2>
    <table>
      <tbody>
      {properties && properties.map(({name, value}, i) =>
        <tr key={i}>
          <td>{name}</td>
          <td>{value}</td>
        </tr>
      )}
      </tbody>
    </table>
  </div>;

const AttributeTable = ({attributes, dataFormats, onSetDataFormat}) =>
  <div>
    <h2>Attributes</h2>
    <select onChange={e => onSetDataFormat(e.target.value)}>
      {dataFormats.map((format, i) => <option key={i}>{format}</option>)}
    </select>
    <table>
      <tbody>
      {attributes && attributes.map(({name, value}, i) =>
        <tr key={i}>
          <td>{name}</td>
          <td>{value}</td>
        </tr>
      )}
      </tbody>
    </table>
  </div>;

const DeviceTables = ({properties, attributes, dataFormats, onSetDataFormat}) => {
  const hasAttrs = attributes.length > 0;
  const hasProps = properties.length > 0;

  return hasAttrs && hasProps
    ? <div>
        {hasProps > 0 && <PropertyTable properties={properties}/>}
        {hasAttrs > 0 && <AttributeTable attributes={attributes} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat}/>}
      </div>
    : <div>
        No information is available for this device.
      </div>; 
};

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
    const {properties, attributes, loading, dataFormats, selectDataFormat} = this.props;
    const content = loading
      ? <Spinner/>
      : <DeviceTables
          attributes={attributes}
          properties={properties}
          dataFormats={dataFormats}
          onSetDataFormat={selectDataFormat}
        />;

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
    attributes: getFilteredCurrentDeviceAttributes(state),
    properties: getCurrentDeviceProperties(state),
    loading: getDeviceIsLoading(state),
    dataFormats: getAvailableDataFormats(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDevice: device => dispatch(fetchDevice(device)),
    selectDataFormat: format => dispatch(setDataFormat(format))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
