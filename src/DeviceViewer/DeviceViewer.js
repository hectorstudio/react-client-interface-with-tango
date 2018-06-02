import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';

import { fetchDevice } from '../actions/tango';

import Spinner from '../Spinner/Spinner';

import './DeviceViewer.css';

import {
  getCurrentDeviceProperties,
  getDeviceIsLoading,
  getAvailableDataFormats,
  getFilteredCurrentDeviceAttributes,
  getActiveDataFormat
} from '../selectors/devices';
import { setDataFormat } from '../actions/deviceList';

const PropertyTable = ({properties}) => 
  <div>
    <h2>Properties</h2>
    <table className="properties">
      <tbody>
      {properties && properties.map(({name, value}, i) =>
        <tr key={i}>
          <td>{name}</td>
          <td>{value.join('\n')}</td>
        </tr>
      )}
      </tbody>
    </table>
  </div>;

function valueComponent(value, datatype, dataformat) {
  if (dataformat !== 'SPECTRUM' || datatype === 'DevString') {
    return value;
  } else {
    const noBrackets = value.substring(1, value.length-1);
    const entries = noBrackets.split(/\s+/);
    const values = datatype === 'DevBoolean'
      ? entries.map(s => Number(s === 'True'))
      : entries.map(s => Number(s));
    const data = values.map(value => ({value}));
    const lineType = datatype === 'DevBoolean' ? 'step' : 'linear';

    return (
      <LineChart data={data} width={400} height={300}>
        <YAxis/>
        <Tooltip/>
        <CartesianGrid stroke="#f5f5f5"/>
        <Line dot={false} isAnimationActive={false} type={lineType} dataKey="value" stroke="#ff7300" yAxisId={0}/>
      </LineChart>
    );
  }
}

const AttributeTable = ({attributes, dataFormat, dataFormats, onSetDataFormat}) =>
  <div>
    <h2>Attributes</h2>

    <ul className="format-chooser">
      {dataFormats.map((format, i) =>
        <li
          className={format === dataFormat ? 'active' : ''}
          key={i} onClick={() => onSetDataFormat(format)}>
            {format}
          </li>
      )}
    </ul>

    <table className="attributes">
      <tbody>
      {attributes && attributes.map(({name, value, datatype, dataformat}, i) =>
        <tr key={i}>
          <td>{name}</td>
          <td>{valueComponent(value, datatype, dataformat)}</td>
        </tr>
      )}
      </tbody>
    </table>
  </div>;

const DeviceTables = ({properties, attributes, dataFormat, dataFormats, onSetDataFormat}) => {
  const hasAttrs = attributes.length > 0;
  const hasProps = properties.length > 0;

  return hasAttrs && hasProps
    ? <div>
        {hasProps > 0 && <PropertyTable properties={properties}/>}
        {hasAttrs > 0 && <AttributeTable attributes={attributes} dataFormat={dataFormat} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat}/>}
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
    const {properties, attributes, loading, dataFormat, dataFormats, selectDataFormat} = this.props;
    const content = loading
      ? <Spinner/>
      : <DeviceTables
          attributes={attributes}
          properties={properties}
          dataFormats={dataFormats}
          dataFormat={dataFormat}
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
    attributes: getFilteredCurrentDeviceAttributes(state),
    properties: getCurrentDeviceProperties(state),
    loading: getDeviceIsLoading(state),
    dataFormats: getAvailableDataFormats(state),
    dataFormat: getActiveDataFormat(state)
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
