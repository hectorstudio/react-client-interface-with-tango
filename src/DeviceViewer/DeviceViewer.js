import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import 'font-awesome/css/font-awesome.min.css';

import CommandsTable from './CommandsTab/CommandsTab';
import PropertyTable from './PropertyTable/PropertyTable';

import {
  selectDevice,
  setDeviceProperty,
  deleteDeviceProperty
} from '../actions/tango';

import Spinner from '../Spinner/Spinner';
import ValueDisplay from './ValueDisplay/ValueDisplay';

import './DeviceViewer.css';

import {
  getCurrentDeviceProperties,
  getCurrentDeviceCommands,
  getCurrentDeviceName,
  getCurrentDeviceStateValue,
  getAvailableDataFormats,
} from '../selectors/currentDevice';

import { getDeviceIsLoading } from '../selectors/loadingStatus';

import {
  getFilteredCurrentDeviceAttributes,
  getActiveDataFormat,
  getActiveTab,
} from '../selectors/deviceDetail';

import { setDataFormat, setTab} from '../actions/deviceList';

const DescriptionDisplay = ({description}) => <i
  className={classNames('fa fa-info-circle', {'no-description': description === 'No description'})}
  title={description}
  onClick={alert.bind(null, description)}
/>;

const AttributeTable = ({ attributes, dataFormat, dataFormats, onSetDataFormat }) => {
  const QualityIndicator = ({ quality }) => {
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
          {attributes && attributes.map(({ name, value, quality, datatype, dataformat, description }, i) =>
            <tr key={i}>
              <td className='name'>
                <QualityIndicator quality={quality} />
                {name}
              </td>
              <td className='value'>
                <ValueDisplay name={name} value={value} datatype={datatype} dataformat={dataformat} />
              </td>
              <td className='description'>
                <DescriptionDisplay description={description} />
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
    const {
      properties,
      attributes,
      commands,
      dataFormat,
      dataFormats,
      selectedTab,
      onSetDataFormat,
      onSetTab,
    } = this.props;

    const hasAttrs = attributes.length > 0;
    const hasProps = properties.length > 0;
    const hasCommands = commands.length > 0;

    const dataTabs = selectedTab === "attributes" && dataFormats.length > 1 ?
      <ul className='nav nav-pills format-chooser'>
        {dataFormats.map((format, i) =>
          <li
            className='nav-item'
            key={i} onClick={this.handleSelectDataFormat.bind(this, format)}>
            <a className={classNames('nav-link', { active: format === dataFormat })} href='#'>
              {format}
            </a>
          </li>
        )}
      </ul> : null;

    const Tab = ({ name, title }) => <li className='nav-item'>
      <a href={`#${name}`} className={classNames('nav-link', { active: selectedTab === name })} onClick={this.handleSelectTab.bind(this, name)}>
        {title}
      </a>
    </li>;

    return (
      <div className="device-menu">
        <ul className='nav nav-tabs section-chooser'>
          {hasProps && <Tab name='properties' title='Properties' />}
          {hasAttrs && <Tab name='attributes' title='Attributes' />}
          {hasCommands && <Tab name='commands' title='Commands' />}
        </ul>
        {selectedTab === 'attributes' && dataTabs}
      </div>
    );
  }
}

class DeviceTables extends Component {

  render() {
    const {
      properties,
      attributes,
      dataFormat,
      dataFormats,
      onSetDataFormat,
      selectedTab,
      commands,
      setDeviceProperty,
      deviceName,
      deleteDeviceProperty
    } = this.props;
    
    const hasAttrs = attributes.length > 0;
    const hasProps = properties.length > 0;

    return (
      <div className="device-table">
        {hasProps && selectedTab === "properties" && <PropertyTable properties={properties} setDeviceProperty={setDeviceProperty} deviceName={deviceName} deleteDeviceProperty={deleteDeviceProperty} />}
        {selectedTab === "attributes" && <AttributeTable attributes={attributes} dataFormat={dataFormat} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat} />}
        {selectedTab === "commands" && <CommandsTable commands={commands} />}
      </div>
    );
  }
}


class DeviceViewer extends Component {
  parseDevice(props) {
    return (props || this.props).match.params.device;
  }

  parseTab() {
    const { hash } = this.props.history.location;
    const tab = hash.substr(1);
    return tab || undefined;
  }

  componentDidMount() {
    const device = this.parseDevice();
    this.props.selectDevice(device);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    if (device !== this.parseDevice(prevProps)) {
      this.props.selectDevice(device);
    }

    const tab = this.parseTab();
    if (tab && tab !== this.props.activeTab) {
      this.props.selectTab(tab);
    }
  }

  render() {
    const {
      properties,
      attributes,
      loading,
      dataFormat,
      dataFormats,
      selectDataFormat,
      selectTab,
      activeTab,
      currentState,
      commands,
      setDeviceProperty,
      deviceName,
      deleteDeviceProperty
    } = this.props;
    const QualityIndicator = ({ state }) => {
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

    const content = loading
      ? <Spinner size={4} />
      : <div>
        <Helmet>
          <title>{deviceName}</title>
        </Helmet>
        <div className="device-header">
          <QualityIndicator state={currentState} /> {deviceName}
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
            attributes={attributes}
            properties={properties}
            commands={commands}
            dataFormats={dataFormats}
            dataFormat={dataFormat}
            selectedTab={activeTab}
            setDeviceProperty={setDeviceProperty}
            deviceName={deviceName}
            deleteDeviceProperty={deleteDeviceProperty}
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
    currentState: getCurrentDeviceStateValue(state),
    deviceName: getCurrentDeviceName(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectDevice: device => dispatch(selectDevice(device)),
    selectDataFormat: format => dispatch(setDataFormat(format)),
    selectTab: tab => dispatch(setTab(tab)),
    setDeviceProperty: (device, name, value) => dispatch(setDeviceProperty(device, name, value)),
    deleteDeviceProperty: (device, name) => dispatch(deleteDeviceProperty(device, name))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
