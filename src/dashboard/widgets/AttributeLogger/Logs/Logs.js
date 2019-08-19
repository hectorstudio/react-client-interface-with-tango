import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import "./Logs.css";

export class AttributeLog extends Component {

  //Assumes the heading rows are a similar dimension to the data rows.
  captureRowHeight = element => {
    if (element) {
      const rows = element.getElementsByTagName("tr")    
      if (rows.length > 0){
        this.rowHeight =  rows[0].clientHeight
      }else {
      }
    } 
  }

  //Ideally we would just call this on the last element added. It  ensure when a 
  //new message comes in the table scrolls to display it.
  lockToBottom = element => {
  if (element) {
    element.scrollIntoView()
    }
  }

  // The box needs to have space to display the information about the attribute and
  // the headings and adjust the table to display a whole number of rows
  adjustDimensions = element => {
    if (element) {

        const logs = element.parentElement
        const pContainer = logs.parentElement
        const thisWidget = pContainer.parentElement
        const rh = this.rowHeight

        element.style.height = Math.ceil(element.clientHeight/rh)*rh +"px"
        logs.style.height = Math.max(logs.clientHeight, (element.clientHeight +50))+"px"
        pContainer.style.height = Math.max(pContainer.clientHeight, (logs.clientHeight+ 50))+"px"

        thisWidget.style.height = Math.max(thisWidget.clientHeight, (pContainer.clientHeight + 50))+"px"
    } 

  };

  render() {
    const { deviceName, values, valueLog, attributeName } = this.props;
    return (
      <div  className="Logs">
        <div>
          <div className={"title"}>
            Recent {attributeName} {deviceName ? "on " + deviceName : ""}
            <div>{values} </div>
          </div>
        </div>
        <div>
        <hr/>
        <table ref={this.captureRowHeight}>
            <tbody>
              <tr>
                <th width = "200px">Time </th>
                <th>Log Message</th>
              </tr>  
            </tbody>
          </table>       
        </div>
        <hr/>
        <div ref={this.adjustDimensions} className={"log-table"}>
          {values != null ? (
            <table >
              <tbody>
                {valueLog.map((value, key) => (
                  <Fragment key={key}>
                    <tr ref= {this.lockToBottom}>
                      <td width="200px">{moment(new Date(value.timestamp)).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
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

