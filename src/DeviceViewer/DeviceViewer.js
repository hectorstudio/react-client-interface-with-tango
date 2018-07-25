import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import CommandsTable from './CommandsTab/CommandsTab';

import { fetchDevice, submitCommand } from '../actions/tango';

import Spinner from '../Spinner/Spinner';
import ValueDisplay from './ValueDisplay/ValueDisplay';

import './DeviceViewer.css';

import {
  getCurrentDeviceProperties,
  getCurrentDeviceCommands,
  getAvailableDataFormats,
  getCurrentDeviceState,
  getCommandValue,
} from '../selectors/devices';

import { getDeviceIsLoading } from '../selectors/loadingStatus';

import {
  getFilteredCurrentDeviceAttributes,
  getActiveDataFormat,
  getActiveTab,
} from '../selectors/deviceView';

import { setDataFormat, setTab} from '../actions/deviceList';

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
            <td>
              <ValueDisplay value={value} datatype={datatype} dataformat={dataformat} name={name}/>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};



class DeviceMenu extends Component {
  handleSelectDataFormat(format, event) {
    event.preventDefault();
    this.props.onSetDataFormat(format);
  }

  handleSelectTab(tab) {
    this.props.onSetTab(tab);
  }

  render() {
    const {properties, attributes, commands, dataFormat, dataFormats, onSetDataFormat, onSetTab, selectedTab} = this.props;

    const hasAttrs = attributes.length > 0;
    const hasProps = properties.length > 0;
    const hasCommands = commands.length > 0;

    const dataTabs = selectedTab === "attributes" && dataFormats.length > 1 ?
      <ul className='nav nav-pills format-chooser'>
        {dataFormats.map((format, i) =>
          <li
            className='nav-item'
            key={i} onClick={this.handleSelectDataFormat.bind(this, format)}>
            <a className={classNames('nav-link', {active: format === dataFormat})} href='#'>
              {format}
            </a>
          </li>
        )}
      </ul> : null;

    const Tab = ({name, title}) => <li className='nav-item'>
      <a href={`#${name}`} className={classNames('nav-link', {active: selectedTab === name})} onClick={this.handleSelectTab.bind(this, name)}>
        {title}
      </a>
    </li>;

    return (
      <div className="device-menu">
        <ul className='nav nav-tabs section-chooser'>
          {hasProps && <Tab name='properties' title='Properties'/>}
          {hasAttrs && <Tab name='attributes' title='Attributes'/>}
          {hasCommands && <Tab name='commands' title='Commands'/>}
        </ul>
        {selectedTab === 'attributes' && dataTabs}
      </div>
    );
  }
}

class DeviceTables extends Component {

  render() {
      const {properties, attributes, dataFormat, dataFormats, onSetDataFormat, selectedTab, commands} = this.props;
      const hasAttrs = attributes.length > 0;
      const hasProps = properties.length > 0;

    return (
      <div className="device-table">
        {selectedTab === "properties" && <PropertyTable properties={properties}/>}
        {selectedTab === "attributes" && <AttributeTable attributes={attributes} dataFormat={dataFormat} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat}/>}
        {selectedTab === "commands" && <CommandsTable commands ={commands}/>}
      </div>
    );
  }
}


class DeviceViewer extends Component {
  parseDevice(props) {
    return (props || this.props).match.params.device;
  }

  parseTab() {
    const {hash} = this.props.history.location;
    const tab = hash.substr(1);
    return tab || 'properties';
  }

  componentDidMount() {
    const device = this.parseDevice();
    this.props.fetchDevice(device);
    const tab = this.parseTab();
    this.props.selectTab(tab);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    if (device !== this.parseDevice(prevProps)) {
      this.props.fetchDevice(device);
    }

    const tab = this.parseTab();
    if (tab !== this.props.activeTab) {
      this.props.selectTab(tab);
    }
  }

  render() {
    const {properties, attributes, loading, dataFormat, dataFormats, selectDataFormat, selectTab, activeTab, currentState, commands} = this.props;    
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
    
    const deviceName = this.parseDevice(this.props);
    const content = loading 
      ? <Spinner size={4}/>
      : <div>
          <Helmet>
            <title>{deviceName}</title>
          </Helmet>
          <div className="device-header">
            <QualityIndicator state={currentState}/> {deviceName}
          </div>
          <div className="device-body">
            <DeviceMenu
              attributes={attributes}
              properties={properties}
              commands={commands}
              dataFormats={dataFormats}
              dataFormat={dataFormat}
              selectedTab={activeTab}
              onSetDataFormat={selectDataFormat}
              onSetTab={selectTab}
            />
            <DeviceTables
              submitCommand={this.props.submitCommand}
              getValue= {this.props.getCommandValue}
              attributes={attributes}
              properties={properties}
              commands={commands}
              dataFormats={dataFormats}
              dataFormat={dataFormat}
              selectedTab={activeTab}
            />
          </div>
        </div>;    
        
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
    commands: getCurrentDeviceCommands(state),
    loading: getDeviceIsLoading(state),
    dataFormats: getAvailableDataFormats(state),
    dataFormat: getActiveDataFormat(state),
    activeTab: getActiveTab(state),
    currentState: getCurrentDeviceState(state),
    getValue: getCommandValue(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDevice: device => dispatch(fetchDevice(device)),
    selectDataFormat: format => dispatch(setDataFormat(format)),
    selectTab: tab => dispatch(setTab(tab)),
    submitCommand: (command, value) => dispatch(submitCommand(command, value))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
