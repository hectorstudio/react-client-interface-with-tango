import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import * as Datetime from "react-datetime";

import { fetchLoggedActions } from "../../../state/actions/tango";

import { getLoggedActions } from "../../../state/selectors/loggedActions";

import "./Logs.css";

class Logs extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.state = {
      logs: LOGS,
      fromDate: yesterday,
      toDate: today,
      username: "",
      category: "Attribute"
    };

    this.reload = this.reload.bind(this);
    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  render() {
    const { tangoDB, deviceName } = this.props;
    const { logs, fromDate, toDate } = this.state;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <Datetime
                  dateFormat="YYYY-MM-DD"
                  timeFormat="HH:mm"
                  value={fromDate}
                  inputProps={{ placeholder: "From date" }}
                  onChange={moment => this.onChangeFromDate(moment)}
                />
              </td>
              <td>
                <Datetime
                  dateFormat="YYYY-MM-DD"
                  timeFormat="HH:mm"
                  value={toDate}
                  inputProps={{ placeholder: "To date" }}
                  onChange={moment => this.onChangeToDate(moment)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="User"
                  onKeyUp={event => this.onUserChange(event)}
                />
              </td>
              <td>
                <select
                  onChange={event => this.onCategoryChange(event)}
                >
                  <option value="attributes">Attributes</option>
                  <option value="commands">Commands</option>
                  <option value="both">Both</option>
                </select>
              </td>
              <td>
                <button
                  style={{ width: "100px", height: "35px" }}
                  className={"btn btn-outline-secondary"}
                  type="button"
                  onClick={() => {
                    this.reload();
                  }}
                >
                  Reload
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <table className={"log-table"}>
            <tbody>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Type</th>
                <th>Target</th>
                <th>Action</th>
              </tr>
              {this.state.logs &&
                this.state.logs.data.loggedActions.map((value, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>{value.timestamp}</td>
                      <td>{value.username}</td>
                      <td>{value.category}</td>
                      <td>{value.target}</td>
                      <td>{value.action}</td>
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  onChangeFromDate(moment) {
    this.setState({ fromDate: moment.toDate() });
  }
  onChangeToDate(moment) {
    this.setState({ toDate: moment.toDate() });
  }
  reload() {
    const {fromDate, toDate, username, category} = this.state;
    this.props.onFetchLoggedActions(fromDate, toDate, username, category);
  }
  onUserChange(event) {
    this.setState({username: event.target.value});
  }
  onCategoryChange(event){
    this.setState({category: event.target.value});
  }
}

function mapStateToProps(state) {
  return {
    logs: getLoggedActions(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB, deviceName } = ownProps;
    return {
      onFetchLoggedActions: (fromDate, toDate, username, category) =>
      dispatch(fetchLoggedActions(tangoDB, deviceName, fromDate, toDate, username, category))}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logs);

const LOGS = {
  data: {
    loggedActions: [
      {
        username: "jonros",
        timestamp: "2019-01-01T11:00:47Z",
        device: "tg_test",
        category: "Attribute",
        target: "double_scalar_w",
        action: "50.00"
      },
      {
        username: "abdamj",
        timestamp: "2019-01-01T11:00:47Z",
        device: "tg_test",
        category: "Command",
        target: "DevBoolean",
        action: "execute XYZ"
      },
      {
        username: "emiros",
        timestamp: "2019-01-01T11:00:47Z",
        device: "tg_test",
        category: "Command",
        target: "DevFloat",
        action: "execute ABC"
      },
      {
        username: "nilhak",
        timestamp: "2019-01-01T11:00:47Z",
        device: "tg_test",
        category: "Property",
        target: "polled_prop",
        action: "Add"
      },
      {
        username: "jarink",
        timestamp: "2019-01-01T11:00:47Z",
        device: "tg_test",
        category: "Property",
        target: "h2",
        action: "Edit"
      }
    ]
  }
};
