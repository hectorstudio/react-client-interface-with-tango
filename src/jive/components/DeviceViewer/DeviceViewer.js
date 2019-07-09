import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import classNames from "classnames";
import { Helmet } from "react-helmet";

import AttributeTable from "./AttributeTable/AttributeTable";
import CommandTable from "./CommandTable/CommandTable";
import PropertyTable from "./PropertyTable/PropertyTable";
import ServerInfo from "./ServerInfo/ServerInfo";
import DisplevelChooser from "./DisplevelChooser/DisplevelChooser";
import ErrorTable from "./ErrorTable/ErrorTable";
import Logs from "./Logs/Logs";
import Spinner from "../Spinner/Spinner";

import { getDevice } from "../../state/selectors/devices";
import { getDeviceIsLoading } from "../../state/selectors/loadingStatus";
import { getDisabledDisplevels } from "../../state/selectors/deviceDetail";

import {
  enableDisplevel,
  disableDisplevel,
  fetchDevice
} from "../../state/actions/tango";

import "./DeviceViewer.css";

class DeviceMenu extends Component {
  render() {
    const { selectedTab, device } = this.props;
    const { attributes, commands, errors } = device;

    const hasAttributes = attributes.length > 0;
    const hasCommands = commands.length > 0;
    const hasErrors = errors.length > 0;

    const mask = [true, hasErrors, true, hasAttributes, hasCommands, true];

    const tabTitles = [
      "Server",
      "Errors",
      "Properties",
      "Attributes",
      "Commands",
      "Logs"
    ].filter((_, i) => mask[i]);

    const tabs = tabTitles.map(title => {
      // Not quite happy about having to pass the location as a prop to this component, but it appeared to be the easiest way to have links preseve the query string
      const location = this.props.location || {};
      const tab = title.toLowerCase();
      const to = { ...location, pathname: tab };

      return (
        <li className={"nav-item"} key={tab}>
          <Link
            to={to}
            className={classNames("nav-link", { active: tab === selectedTab })}
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

const StateIndicator = ({ state }) => {
  const classes = {
    ON: "on",
    OFF: "off",
    CLOSE: "close-status", // In order to avoid collision with bootstrap class name
    OPEN: "open",
    INSERT: "insert",
    EXTRACT: "extract",
    MOVING: "moving",
    STANDBY: "standby",
    FAULT: "fault",
    INIT: "init",
    RUNNING: "running",
    ALARM: "alarm",
    DISABLE: "disable",
    UNKNOWN: "unknown"
  };
  
  const className = classes[state] || "invalid";
  return (
    <span className={classNames("StateIndicator", className)}>{state}</span>
  );
};

class DeviceViewer extends Component {
  componentDidMount() {
    this.props.onRequireDevice(this.props.deviceName);
  }

  componentDidUpdate(prevProps) {
    const deviceName = this.props.deviceName;
    if (prevProps.deviceName !== deviceName) {
      this.props.onRequireDevice(deviceName);
    }
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
      return <ErrorTable tangoDB={tangoDB} errors={device.errors} />;
    } else if (tab === "attributes") {
      return (
        <AttributeTable
          tangoDB={tangoDB}
          deviceName={device.name}
          attributes={device.attributes}
        />
      );
    } else if (tab === "logs") {
      return <Logs tangoDB={tangoDB} deviceName={device.name} />;
    } else {
      return <ServerInfo device={device} server={device.server} />;
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

    const selectedTab = this.props.selectedTab || "server";
    const {
      device,
      displevels,
      disabledDisplevels,
      onDisplevelChange,
      location
    } = this.props;

    // Disable the displevel chooser until its role in the user interface has been worked out properly. Currently it doesn't add much except distraction
    const enableDisplevelChooser = false;

    return (
      <div>
        <Helmet title={device.name} />
        <div className="device-header">
          <StateIndicator state={device.state} /> {device.name}
          {enableDisplevelChooser && displevels.length > 1 && (
            <DisplevelChooser
              displevels={[] /*displevels*/}
              disabledDisplevels={disabledDisplevels}
              onChange={onDisplevelChange}
            />
          )}
        </div>
        <div className="device-body">
          <DeviceMenu
            device={device}
            selectedTab={selectedTab}
            location={location}
          />
          <div className="device-view">{this.innerView(selectedTab)}</div>
        </div>
      </div>
    );
  }

  render() {
    return <div className="DeviceViewer">{this.innerContent()}</div>;
  }
}

function mapStateToProps(state, ownProps) {
  const getCurrentDevice = getDevice(ownProps.deviceName);
  return {
    loading: getDeviceIsLoading(state),
    device: getCurrentDevice(state),
    disabledDisplevels: getDisabledDisplevels(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB } = ownProps;
  return {
    onRequireDevice: device => dispatch(fetchDevice(tangoDB, device)),
    onDisplevelChange: (displevel, value) => {
      const action = value
        ? enableDisplevel(displevel)
        : disableDisplevel(displevel);
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
