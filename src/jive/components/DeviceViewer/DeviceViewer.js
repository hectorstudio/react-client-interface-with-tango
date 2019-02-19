import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
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
  requireDevice,
  fetchDevice
} from "../../state/actions/tango";

import "./DeviceViewer.css";

class DeviceMenu extends Component {
  render() {
    const { selectedTab, device } = this.props;
    const { properties, attributes, commands, errors } = device;

    const hasProperties = properties.length > 0;
    const hasAttributes = attributes.length > 0;
    const hasCommands = commands.length > 0;
    const hasErrors = errors.length > 0;

    const mask = [true, hasErrors, hasProperties, hasAttributes, hasCommands, true];
    const tabTitles = [
      "Server",
      "Errors",
      "Properties",
      "Attributes",
      "Commands",
      "Logs"
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

const QualityIndicator = ({ state }) => {
  const classSuffixes = {
    ON: "on",
    OFF: "off",
    CLOSE: "close",
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
  const classSuffix = classSuffixes[state] || "invalid";
  return <span className={`state state-${classSuffix}`}>{state}</span>;
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
      return <PropertyTable tangoDB={tangoDB} properties={device.properties} />;
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
    } else if(tab === "logs"){
      return (
        <Logs
          tangoDB={tangoDB}
          deviceName={device.name}
        />
      )
    }else {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceViewer);
