import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { fetchLoggedActions } from "../../../../jive/state/actions/tango";
import * as moment from "moment";
import { getLoggedActions } from "../../../../jive/state/selectors/loggedActions";

import "./Logs.css";
import { getCommandOutputsLoading } from "../../../../jive/state/selectors/loadingStatus";
import { timeout } from "q";

const ENTER_KEY = 13;

class AttributeLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 5
    };
    this.reload = this.reload.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.reload();
  }
 
  render() {
    const { deviceName, values, valueLog} = this.props;
    console.log(valueLog); 
    const { limit } = this.state;
    return (
      <div className="Logs">
        <div>
          <div className={"title"}>
            Recent user actions {deviceName ? "on " + deviceName : ""}
            <div>{values} </div>
          </div>          
        </div>
        <div>
          
          {values != null ? (
            <table className={"log-table"}>
              <tbody>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  {!deviceName && <th>Device</th>}
                  <th>Name</th>
                  <th>Action</th>
                  <th>Addtional info</th>
                </tr>
                  {valueLog.map((value, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>{value}</td>
                      <td>{value}</td>
                      <td>{value}</td>
                      <td>{value}</td>
                      <td>{value}</td>
                      <td>{value}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={"no-logs-message"}>No logs available </div>
          )}
        </div>
      </div>
    );
  }
  reload() {
    const { limit } = this.state;
    this.props.onFetchLoggedActions(limit);
  }
  onLimitChange(event) {
    if ([ENTER_KEY].includes(event.keyCode)) {
      this.reload();
    } else {
      this.setState({ limit: event.target.value });
    }
  }
}

function mapStateToProps(state, ownProps) {
  console.log("state e props"); 
  console.log(state); 
  console.log(ownProps); 
  return {
    logs: mockGetLoggedActions(state, ownProps.deviceName)
  };
}

 function mockGetLoggedActions(state, deviceName){
  const obj = JSON.parse('{ "__typename": "ExcuteCommandUserAction", "timestamp": "2019-07-31T09:49:27.535031", "user": "user1", "device": "sys/tg_test/1", "name": "CrashFromOmniThread"}'); 
  console.log("funzione mock"); 
  console.log(obj); 
  return obj
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
)(AttributeLog);

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
