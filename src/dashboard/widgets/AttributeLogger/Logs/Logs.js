import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import * as moment from "moment";
import "./Logs.css";

class AttributeLog extends Component {
  render() {


    const { deviceName, values, valueLog } = this.props;
    console.log(valueLog);
    return (
      <div className="Logs">
        <div>
          <div className={"title"}>
            Recent user actions {deviceName ? "on " + deviceName : ""}
            <div>{values} </div>
          </div>
        </div>
        <div>
        <hr/>
        <table>
            <tbody>
              <tr>
                <th>Time &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                  &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</th>
                <th>Log Message</th>
              </tr>  
            </tbody>
          </table>       
        </div>
        <hr/>
        <div className={"log-table"}>

          {values != null ? (
            <table >
              <tbody>
                {valueLog.map((value, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>{moment(new Date(value.timestamp)).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                      <td>{value.value}</td>
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
}

export default connect(
)(AttributeLog);

