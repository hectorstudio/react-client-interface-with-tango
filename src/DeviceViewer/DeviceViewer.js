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
  getActiveDataFormat,
  getActiveTab,
  getDeviceNames
} from '../selectors/devices';
import { setDataFormat, setTab } from '../actions/deviceList';

const PropertyTable = ({properties}) => 
  <div>
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

const switchButton = 'Switch on/off';
const CommandButton = ({commands}) =>
    <div class="switch">
    <form action="/action_page.php">
     <br></br>
        {switchButton}
        <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round"  type="checkbox"/>
        <label for="cmn-toggle-1"></label>
        <br></br>
    
      Set voltage: <input type="text" name="fname"/>
      <input type="submit" value="Submit"/>
    </form>
    </div>


function valueComponent(value, datatype, dataformat) {
  // Some special cases, should be refactored later.
  if (value === null) {
    return <span className="no-value">No value</span>;
  } else if (dataformat !== 'SPECTRUM' || datatype === 'DevString') {
    return value.length < 50000 ? value : 'Value too big to display.';
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

const AttributeTable = ({attributes, dataFormat, dataFormats, onSetDataFormat}) => {
  const QualityIndicator = ({quality}) => {
    const sub = {
      'ATTR_VALID': 'valid',
      'ATTR_INVALID': 'invalid',
      'ATTR_CHANGING': 'changing',
      'ATTR_ALARM': 'alarm',
      'ATTR_WARNING': 'warning'
    }[quality] || 'invalid';

    return <span
      className={`quality quality-${sub}`}
      title={quality}>● </span>;
  };
 
  return (
    <div>

      <table className="attributes">
        <tbody>
        {attributes && attributes.map(({name, value, quality, datatype, dataformat}, i) =>
          <tr key={i}>
            <td>
              <QualityIndicator quality={quality}/>
              {name}
            </td>
            <td>{valueComponent(value, datatype, dataformat)}</td>              
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};



class DeviceMenu extends Component {

  render() {
      const {properties, attributes, dataFormat, dataFormats, onSetDataFormat, onSetTab, selectedTab} = this.props;

      const hasAttrs = attributes.length > 0;
      const hasProps = properties.length > 0;

      const dataTabs = selectedTab === "attributes" ?

      <ul className="format-chooser chooser">
            {dataFormats.map((format, i) =>
              <li
                className={format === dataFormat ? 'active' : ''}
                key={i} onClick={() => onSetDataFormat(format)}>
                  {format}
                </li>
            )}
      </ul> : null;

    return hasAttrs && hasProps
      ? <div className="device-menu">
          <ul className="tab-chooser chooser">
            {<li className={selectedTab === "attributes" ? 'active' : ''} onClick={() => onSetTab("attributes")}>Attributes</li>}
            {hasProps > 0 && <li className={selectedTab === "properties" ? 'active' : ''} onClick={() => onSetTab("properties")}>Properties</li>}
            {<li className={selectedTab === "commands" ? 'active' : ''} onClick={() => onSetTab("commands")}>Commands</li>}
          </ul>
          {dataTabs}
        </div>
      : <div>
          No information is available for this device.
        </div>; 
  }
}

class DeviceTables extends Component {

  render() {
      const {properties, attributes, dataFormat, dataFormats, onSetDataFormat, selectedTab} = this.props;

      const hasAttrs = attributes.length > 0;
      const hasProps = properties.length > 0;

    return hasAttrs && hasProps
      ? <div className="device-table">
          {selectedTab === "properties" && <PropertyTable properties={properties}/>}
          {selectedTab === "attributes" && <AttributeTable attributes={attributes} dataFormat={dataFormat} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat}/>}
          {selectedTab === "commands" && <CommandButton/>}
        </div>
      : null; 
  }
}


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
    const {properties, attributes, loading, dataFormat, dataFormats, selectDataFormat, selectTab, activeTab, device} = this.props;
    const QualityIndicator = ({state}) => {
      const sub = {
        'ON': 'on',
        'OFF': 'off',
        'CLOSE': 'close',
        'OPEN': 'open',
        'INSERT': 'insert',
        'EXTRACT': 'extract',
        'MOVING': 'moving',
        'STANDBY': 'standy',
        'FAULT': 'fault',
        'INIT': 'init',
        'RUNNING': 'running',
        'ALARM': 'alarm',
        'DISABLE': 'disable',
        'UNKNOWN': 'unknown'
      }[state] || 'invalid';
      return <span
      className={`state state-${sub}`}
      title={state}>● </span>;
    };

    const stateAttr = attributes.find(attr => attr.name === 'State');
    const state = stateAttr ? stateAttr.value : null;

    const content = loading 
      ? <Spinner/>
      : (<div>
        <div className="device-header">
        <QualityIndicator state={state}/>
        {this.parseDevice(this.props)}
        </div>
        <DeviceMenu
          attributes={attributes}
          properties={properties}
          dataFormats={dataFormats}
          dataFormat={dataFormat}
          selectedTab={activeTab}
          onSetDataFormat={selectDataFormat}
          onSetTab={selectTab}
        />
        <DeviceTables
          attributes={attributes}
          properties={properties}
          dataFormats={dataFormats}
          dataFormat={dataFormat}
          selectedTab={activeTab}
        />
        </div>);
        
    return (
      <div className="device-viewer">
        {content}
      </div>
     
    );
  }
}

function mapStateToProps(state) {
  return {
    attributes: getFilteredCurrentDeviceAttributes(state),
    properties: getCurrentDeviceProperties(state),
    device: getDeviceNames(state),
    loading: getDeviceIsLoading(state),
    dataFormats: getAvailableDataFormats(state),
    dataFormat: getActiveDataFormat(state),
    activeTab: getActiveTab(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDevice: device => dispatch(fetchDevice(device)),
    selectDataFormat: format => dispatch(setDataFormat(format)),
    selectTab: tab => dispatch(setTab(tab))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
