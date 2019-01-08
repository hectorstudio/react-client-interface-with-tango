import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.min.css";

import AttributeTable from "./AttributeTable/AttributeTable";
import CommandTable from "./CommandTable/CommandTable";
import PropertyTable from "./PropertyTable/PropertyTable";
import ServerInfo from "./ServerInfo/ServerInfo";
import DisplevelChooser from "./DisplevelChooser/DisplevelChooser";

import Spinner from "../Spinner/Spinner";

import {
  getCurrentDeviceName,
  getCurrentDeviceStateValue,
  getCurrentDeviceHasAttributes,
  getCurrentDeviceHasProperties,
  getCurrentDeviceHasCommands,
  getDispLevels,
  getHasCurrentDevice
} from "../selectors/currentDevice";

import { getDeviceIsLoading } from "../selectors/loadingStatus";
import { getDisabledDisplevels } from "../selectors/deviceDetail";

import { setDataFormat } from "../actions/deviceList";

import {
  enableDisplevel,
  disableDisplevel,
  selectDevice
} from "../actions/tango";

import "./DeviceViewer.css";

class DeviceMenu extends Component {
  render() {
    const {
      hasProperties,
      hasAttributes,
      hasCommands,
      selectedTab
    } = this.props;

    const mask = [true, hasProperties, hasAttributes, hasCommands];
    const tabTitles = ["Server", "Properties", "Attributes", "Commands"];

    const tabs = tabTitles.map((title, i) => {
      const name = title.toLowerCase();
      return !mask[i] ? null : (
        <li className="nav-item" key={name}>
          <Link
            to={`#${name}`}
            className={classNames("nav-link", { active: name === selectedTab })}
          >
            {title}
          </Link>
        </li>
      );
    });

    return (
      <div className="DeviceMenu">
        <ul className="nav nav-tabs section-chooser">{tabs}</ul>
      </div>
    );
  }
}

DeviceMenu.propTypes = {
  hasProperties: PropTypes.bool,
  hasAttributes: PropTypes.bool,
  hasCommands: PropTypes.bool,
  selectedTab: PropTypes.string,
  onSelectTab: PropTypes.func
};

const QualityIndicator = ({ state }) => {
  const sub =
    {
      ON: "on",
      OFF: "off",
      CLOSE: "close",
      OPEN: "open",
      INSERT: "insert",
      EXTRACT: "extract",
      MOVING: "moving",
      STANDBY: "standy",
      FAULT: "fault",
      INIT: "init",
      RUNNING: "running",
      ALARM: "alarm",
      DISABLE: "disable",
      UNKNOWN: "unknown"
    }[state] || "invalid";
  return (
    <span className={`state state-${sub}`} title={state}>
      ●{" "}
    </span>
  );
};

class DeviceViewer extends Component {
  parseDevice(props) {
    return (props || this.props).match.params.device;
  }

  parseTangoDB(props) {
    return (props || this.props).match.params.tangoDB;
  }

  parseTab() {
    const { hash } = this.props.history.location;
    const tab = hash.substr(1);
    return tab || "server";
  }

  componentDidMount() {
    const device = this.parseDevice();
    const tangoDB = this.parseTangoDB();
    this.props.onSelectDevice(tangoDB, device);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    const tangoDB = this.parseTangoDB();
    
    if (device !== this.parseDevice(prevProps)) {
      this.props.onSelectDevice(tangoDB, device);
    }
  }

  innerContent() {
    if (this.props.loading) {
      return <Spinner size={4} />;
    }

    if (!this.props.hasDevice) {
      return (
        <p style={{ margin: "1em", color: "red" }}>
          Couldn't load {this.props.deviceName}.
        </p>
      );
    }

    const selectedTab = this.parseTab();
    const {
      loading,
      onSelectTab,
      currentState,
      deviceName,
      displevels,
      disabledDisplevels,
      onDisplevelChange
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
      return <span className={`state state-${sub}`}>{state}</span>;
    };
    
    const views = {
      server: ServerInfo,
      properties: PropertyTable,
      attributes: AttributeTable,
      commands: CommandTable
    };

    const CurrentView = views[selectedTab];

    return (
      <div>
        <Helmet>
          <title>{deviceName}</title>
        </Helmet>
        <div className="device-header">
          <QualityIndicator state={currentState} /> {deviceName}
          {displevels.length > 1 && (
            <DisplevelChooser
              displevels={displevels}
              disabledDisplevels={disabledDisplevels}
              onChange={onDisplevelChange}
            />
          )}
        </div>
        <div className="device-body">
          <DeviceMenu
            selectedTab={selectedTab}
            onSelectTab={onSelectTab}
            hasProperties={this.props.hasProperties}
            hasAttributes={this.props.hasAttributes}
            hasCommands={this.props.hasCommands}
          />
          <div className="device-view">
            <CurrentView
              tangoDB={this.parseTangoDB()}
              deviceName={this.props.deviceName}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div className="DeviceViewer">{this.innerContent()}</div>;
  }
}

DeviceViewer.propTypes = {
  onSelectDevice: PropTypes.func,
  loading: PropTypes.bool,
  currentState: PropTypes.string,
  deviceName: PropTypes.string,
  displevels: PropTypes.arrayOf(PropTypes.string),
  disabledDisplevels: PropTypes.arrayOf(PropTypes.string),
  onDisplevelChange: PropTypes.func,

  hasAttributes: PropTypes.bool,
  hasProperties: PropTypes.bool,
  hasCommands: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    hasAttributes: getCurrentDeviceHasAttributes(state),
    hasProperties: getCurrentDeviceHasProperties(state),
    hasCommands: getCurrentDeviceHasCommands(state),

    loading: getDeviceIsLoading(state),
    hasDevice: getHasCurrentDevice(state),
    currentState: getCurrentDeviceStateValue(state),
    deviceName: getCurrentDeviceName(state),

    disabledDisplevels: getDisabledDisplevels(state),
    displevels: getDispLevels(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectDevice: (tangoDB, device) =>
      dispatch(selectDevice(tangoDB, device)),
    onSelectTab: tab => dispatch(setTab(tab)),
    onDisplevelChange: (displevel, value) => {
      const actionCreator = value ? enableDisplevel : disableDisplevel;
      dispatch(actionCreator(displevel));
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
