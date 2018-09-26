import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import 'font-awesome/css/font-awesome.min.css';

import AttributeTable from './AttributeTable/AttributeTable';
import CommandTable from './CommandTable/CommandTable';
import PropertyTable from './PropertyTable/PropertyTable';
import ServerInfo from './ServerInfo/ServerInfo';

import Spinner from '../Spinner/Spinner';

import {
  getCurrentDeviceName,
  getCurrentDeviceStateValue,
  getCurrentDeviceHasAttributes,
  getCurrentDeviceHasProperties,
  getCurrentDeviceHasCommands,
  getCurrentDeviceCommands,
  getCurrentDeviceCommandOutputs,
  getCommandDisplevels,
} from '../selectors/currentDevice';


import { getDeviceIsLoading } from '../selectors/loadingStatus';
import { getActiveTab, getEnabledDisplevels } from '../selectors/deviceDetail';

import { setDataFormat, setTab } from '../actions/deviceList';

import {
  executeCommand,
  enableDisplevel,
  disableDisplevel,
  selectDevice
} from '../actions/tango';

import './DeviceViewer.css';

class DeviceMenu extends Component {
  render() {
    const {
      hasProperties,
      hasAttributes,
      hasCommands,
      selectedTab,
      onSelectTab,
    } = this.props;

    const mask = [
      true,
      hasProperties,
      hasAttributes,
      hasCommands
    ];

    const tabTitles = ['Server', 'Properties', 'Attributes', 'Commands'];
    const tabs = tabTitles.map((title, i) => {
      const name = title.toLowerCase();
      return !mask[i]
        ? null
        : (
          <li className='nav-item' key={name}>
            <a
              href={`#${name}`}
              className={classNames('nav-link', { active: name === selectedTab })}
              onClick={onSelectTab.bind(null, name)}
            >
              {title}
            </a>
          </li>
        );
    });

    return (
      <div className="DeviceMenu">
        <ul className='nav nav-tabs section-chooser'>
          {tabs}
        </ul>
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
    this.props.onSelectDevice(device);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    if (device !== this.parseDevice(prevProps)) {
      this.props.onSelectDevice(device);
    }

    const tab = this.parseTab();
    if (tab && tab !== this.props.activeTab) {
      this.props.onSelectTab(tab);
    }
  }

  innerContent() {
    if (this.props.loading) {
      return <Spinner size={4}/>;
    }

    const {
      loading,
      onSelectTab,
      selectedTab,
      currentState,
      deviceName,
      displevels,
      enabledList,
      enableDisplevel,
      disableDisplevel,
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

    const views = {
      'server': ServerInfo,
      'properties': PropertyTable,
      'attributes': AttributeTable,
      'commands': CommandTable,
    };

    const CurrentView = views[selectedTab];

    return (
      <div>
        <Helmet>
          <title>{deviceName}</title>
        </Helmet>
        <div className="device-header">
          <QualityIndicator state={currentState} /> {deviceName}
        </div>
        {displevels.length > 1 &&
          <DisplevelBox displevels={displevels} enabledList={enabledList} enableDisplevel={enableDisplevel} disableDisplevel={disableDisplevel} />
        }
        <div className="device-body">
          <DeviceMenu
            selectedTab={selectedTab}
            onSelectTab={onSelectTab}
            hasProperties={this.props.hasProperties}
            hasAttributes={this.props.hasAttributes}
            hasCommands={this.props.hasCommands}
          />
          <div className="device-view">
            <CurrentView/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="DeviceViewer">
        {this.innerContent()}
      </div>
    );
  }
}

class DisplevelBox extends Component {

  handleInputChange(name, e) {
    if (e.target.checked) {
      this.props.enableDisplevel(name);
    } else {
      this.props.disableDisplevel(name);
    }
  }

  render() {
    const inputs = this.props.displevels.map((name, i) =>
      <span className="checkboxes" key={i}>
        <label>
          <input key={i} type="checkbox" checked={this.props.enabledList.indexOf(name) !== -1} onChange={this.handleInputChange.bind(this, name)} />
          {name}
        </label>
      </span>
    );

    return <span className="layout">
      {inputs}
    </span>;
  }
}

function mapStateToProps(state) {
  return {
    hasAttributes: getCurrentDeviceHasAttributes(state),
    hasProperties: getCurrentDeviceHasProperties(state),
    hasCommands: getCurrentDeviceHasCommands(state),

    loading: getDeviceIsLoading(state),
    selectedTab: getActiveTab(state),

    currentState: getCurrentDeviceStateValue(state),
    deviceName: getCurrentDeviceName(state),
    enabledList: getEnabledDisplevels(state),
    displevels: getCommandDisplevels(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectDevice: device => dispatch(selectDevice(device)),
    onSelectTab: tab => dispatch(setTab(tab)),
    enableDisplevel: (displevel) => dispatch(enableDisplevel(displevel)),
    disableDisplevel: (displevel) => dispatch(disableDisplevel(displevel)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
