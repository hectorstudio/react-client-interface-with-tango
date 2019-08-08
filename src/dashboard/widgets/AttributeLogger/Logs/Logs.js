import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import * as moment from "moment";
import "./Logs.css";

class AttributeLog extends Component {
  render() {


    const { deviceName, values, valueLog, linesDisplayed } = this.props;
    console.log(valueLog);
    return (
      <div className="Logs">
        <div>
          <div className={"title"}>
            Recent user actions {deviceName ? "on " + deviceName : ""}
            <div>{values} </div>
          </div>
        </div>
        <div className={"log-table"}>

          {values != null ? (
            <table >
              <tbody>
                <tr>
                  <th>Time</th>
                  <th>Log Message</th>
                </tr>
                {valueLog.map((value, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>{moment(new Date(value.timestamp)).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                      <td>{value.value}</td>
                    </tr>
                  </Fragment>

                ))}
                {this.createPaddingRows(linesDisplayed - valueLog.length)}
              </tbody>
            </table>
          ) : (
              <div className={"no-logs-message"}>No logs available </div>
            )}
        </div>
      </div>
    );
  }

  createPaddingRows = (nRows) => {
    console.log(nRows)
    let paddingRows = []
    if (nRows > 0) {
      for (let rowIndex = 0; rowIndex < nRows; rowIndex++){
        paddingRows.push(<tr><td>&nbsp;</td><td>&nbsp;</td></tr>)
      }
    }
    return paddingRows
  }
}

export default connect(
)(AttributeLog);

