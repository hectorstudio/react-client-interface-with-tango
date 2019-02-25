import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import * as Datetime from "react-datetime";

import { fetchLoggedActions } from "../../../state/actions/tango";

import { getLoggedActions } from "../../../state/selectors/loggedActions";
import {
  ILoggedActionState,
  IExecuteCommandState,
  ISetAttributeStateState,
  IPutDevicePropertyState
} from "../../../state/reducers/loggedActions";

import "./Logs.css";

const ENTER_KEY = 13;

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 100
    };
    this.reload = this.reload.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.reload();
  }

  render() {
    let { logs, deviceName } = this.props;
    const { limit } = this.state;
    return (
      <div>
        <div>
          <div className={"title"}>Recent user actions on {deviceName}</div>
          <div className={"reload-panel"}>
            Showing the latest{" "}
            <input
              className={"nbr-entry-input"}
              defaultValue={limit}
              onKeyUp={event => this.onLimitChange(event)}
            />{" "}
            entries
            <button
              style={{ width: "100px", height: "35px", marginLeft: "10px" }}
              className={"btn btn-outline-secondary"}
              type="button"
              onClick={() => {
                this.reload();
              }}
            >
              Reload
            </button>
          </div>
        </div>
        <div>
          <table className={"log-table"}>
            <tbody>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Name</th>
                <th>Action</th>
                <th>Addtional info</th>
              </tr>
              {logs &&
                logs.map((value, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>{value.timestamp}</td>
                      <td>{value.user}</td>
                      <td>{value.name}</td>
                      <td>{getActionDescription(value)}</td>
                      <td>{getAdditionalInfo(value)}</td>
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  reload() {
    const { limit } = this.state;
    this.props.onFetchLoggedActions(limit);
  }
  onLimitChange(event) {
    if ([ENTER_KEY].includes(event.keyCode)){
      this.reload();
    }else{
      this.setState({ limit: event.target.value });
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    logs: getLoggedActions(state, ownProps.deviceName)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB, deviceName } = ownProps;
  return {
    onFetchLoggedActions: limit =>
      dispatch(fetchLoggedActions(tangoDB, deviceName, limit))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logs);

const getAdditionalInfo = log => {
  switch (log.__typename) {
    case "DeleteDevicePropertyUserAction":
      return "-";
    case "PutDevicePropertyUserAction":
      return "Value: " + log.value;
    case "SetAttributeValueUserAction":
      return (
        "Value before: " +
        log.valueBefore +
        ". Value after: " +
        log.valueAfter +
        ". Current value: " +
        log.value
      );
    case "ExcuteCommandUserAction":
      return "Command: " + log.argin;
    default:
      return "-";
  }
};
const getActionDescription = log => {
  switch (log.__typename) {
    case "DeleteDevicePropertyUserAction":
      return "Property deleted";
    case "PutDevicePropertyUserAction":
      return "Property changed";
    case "SetAttributeValueUserAction":
      return "Attribute value changed";
    case "ExcuteCommandUserAction":
      return "Command Executed";
    default:
      return "Unknown (" + log.__typename + ")";
  }
};