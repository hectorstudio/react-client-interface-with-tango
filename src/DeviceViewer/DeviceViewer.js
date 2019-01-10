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
import ErrorTable from "./ErrorTable/ErrorTable";

import Spinner from "../Spinner/Spinner";

import {
  getDispLevels,
  getDevice
} from "../selectors/currentDevice";

import { getDeviceIsLoading } from "../selectors/loadingStatus";
import { getDisabledDisplevels } from "../selectors/deviceDetail";

import {
  enableDisplevel,
  disableDisplevel,
  selectDevice
} from "../actions/tango";

import "./DeviceViewer.css";

class DeviceMenu extends Component {
  render() {
    const { selectedTab, device } = this.props;
    const { properties, attributes, commands } = device;
    const errors = [];

    const hasProperties = properties.length > 0;
    const hasAttributes = attributes.length > 0;
    const hasCommands = commands.length > 0;
    const hasErrors = errors.length > 0;

    const mask = [true, hasErrors, hasProperties, hasAttributes, hasCommands];
    const tabTitles = [
      "Server",
      "Errors",
      "Properties",
      "Attributes",
      "Commands"
    ];

    const tabs = tabTitles.map((title, i) => {
      const name = title.toLowerCase();
      return !mask[i] ? null : (
        <li className={"nav-item"} key={name}>
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
  const classSuffixes = {
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
  };
  const classSuffix = classSuffixes[state] || "invalid";
  return <span className={`state state-${classSuffix}`}>{state}</span>;
};

class DeviceViewer extends Component {
  parseTab() {
    const { hash } = this.props.history.location;
    const tab = hash.substr(1);
    return tab || "server";
  }

  innerView(tab) {
    const { device, tangoDB } = this.props;

    if (tab === "properties") {
      return (
        <PropertyTable
          tangoDB={tangoDB}
          deviceName={device.name}
          properties={device.properties}
        />
      );
    } else if (tab === "commands") {
      return (
        <CommandTable
          tangoDB={tangoDB}
          deviceName={device.name}
          commands={device.commands}
        />
      );
    } else if (tab === "errors") {
      return (
        <ErrorTable
          tangoDB={tangoDB}
          deviceName={device.name}
          errors={device.errors}
        />
      );
    } else if (tab === "attributes") {
      return (
        <AttributeTable
          tangoDB={tangoDB}
          deviceName={device.name}
          attributes={device.attributes}
        />
      );
    } else {
      return <ServerInfo tangoDB={tangoDB} server={device.server} />;
    }
  }

  innerContent() {
    if (this.props.loading) {
      return <Spinner size={4} />;
    }

    if (this.props.device == null) {
      return (
        <p style={{ margin: "1em", color: "red" }}>
          Couldn't load {this.props.deviceName}.
        </p>
      );
    }

    const selectedTab = this.parseTab();
    const {
      device,
      displevels,
      disabledDisplevels,
      onDisplevelChange
    } = this.props;

    // Disable the displevel chooser until its role in the user interface has been worked out properly. Currently it doesn't add much except distraction
    const enableDisplevelChooser = false;

    return (
      <div>
        <Helmet>
          <title>{device.name}</title>
        </Helmet>
        <div className="device-header">
          <QualityIndicator state={device.state} /> {device.name}
          {enableDisplevelChooser && displevels.length > 1 && (
            <DisplevelChooser
              displevels={[] /*displevels*/}
              disabledDisplevels={disabledDisplevels}
              onChange={onDisplevelChange}
            />
          )}
        </div>
        <div className="device-body">
          <DeviceMenu device={device} selectedTab={selectedTab} />
          <div className="device-view">{this.innerView(selectedTab)}</div>
        </div>
      </div>
    );
  }

  render() {
    return <div className="DeviceViewer">{this.innerContent()}</div>;
  }
}

DeviceViewer.propTypes = {
  loading: PropTypes.bool,
  displevels: PropTypes.arrayOf(PropTypes.string),
  disabledDisplevels: PropTypes.arrayOf(PropTypes.string),
  onSelectDevice: PropTypes.func,
  onDisplevelChange: PropTypes.func
};

function mapStateToProps(state, ownProps) {
  const deviceName = ownProps.deviceName;
  const getCurrentDevice = getDevice(deviceName);

  return {
    loading: getDeviceIsLoading(state),
    device: getCurrentDevice(state),
    disabledDisplevels: getDisabledDisplevels(state),
    //displevels: getDispLevels(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectDevice: (tangoDB, device) =>
      dispatch(selectDevice(tangoDB, device)),
    onDisplevelChange: (displevel, value) => {
      const action = value ? enableDisplevel(displevel) : disableDisplevel(displevel);
      dispatch(action);
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
