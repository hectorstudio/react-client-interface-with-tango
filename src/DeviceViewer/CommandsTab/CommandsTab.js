
import React, { Component } from 'react';
import {
  getCommandValue, getCurrentDeviceCommands, getCurrentDeviceName, getEnableDisplevels, getCommandDisplevels
} from '../../selectors/devices';

import { submitCommand, enableDisplevel, disableDisplevel, enableAllDisplevel } from '../../actions/tango';
import { connect } from 'react-redux';
import './CommandsTab.css';

class CommandsTable extends Component {
  render(){
const {commands, submitCommand, getValue, currentDeviceName, displevels, enabledList, enableDisplevel, disableDisplevel } = this.props;
 return(
 <div>
   {displevels.length > 1 &&
    <DisplevelBox displevels={displevels} enabledList={enabledList} enableDisplevel={enableDisplevel} disableDisplevel={disableDisplevel} />
  }
    <table className="commands">
      <tbody>
        {commands && commands.map(({ name, displevel, intype }, i) => (Object.values(enabledList).indexOf(displevel) > -1) &&
          <tr key={i}>
            <td>{name}</td>
            <td>{intype}</td>
            <td><InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={intype} getValue={getValue} /></td>
            <td>{getSubmittedValue(name, getValue, currentDeviceName)}</td>
          </tr>
      ) }
      </tbody>
    </table>
  </div>
 )
  }
      }

class DisplevelBox extends Component {

  handleInputChange(name, e) {
    if (e.target.checked) {
      this.props.enableDisplevel(name);
    } else {
      this.props.disableDisplevel(name);
    }
  }

  render() {
    const inputs = this.props.displevels.map((name, i) => 
      <span className="checkboxes">
      <label>
        <input key={i} type="checkbox" checked={this.props.enabledList.indexOf(name) !== -1} onChange={this.handleInputChange.bind(this, name)} /> 
        {name}
        </label>
      </span>
    );

    return <span className="layout">
      {inputs}
    </span>;
  }
}

function getSubmittedValue(name, getValue, currentDeviceName) {
  const result = getValue;
  if (typeof result !== 'undefined' && name in result && result['deviceName'] === currentDeviceName) {
    return 'Output: ' + result[name]
  } else {
    return "";
  }
}


class InputField extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { value: '' };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    if(this.props.name === 'DevString'){
      this.props.submitCommand(this.props.name, JSON.stringify(this.state.value), this.props.currentDeviceName)
    }/*else if(this.props.name === 'DevBoolean' && (this.state.value ==="true" || (this.state.value === "false"))){
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }*/else{
        console.log("jfie ", this.state.value)
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }

    this.setState({
      value: ''
    });
  }

  render() {
    if (this.props.name === 'DevVoid') {
      return "";
    }
    else if(this.props.name === 'DevBoolean'){
      return(
        <label>
        <select value={this.state.value} onChange={this.handleChange}>
        <option value="grapefruit">Grapefruit</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

    <input type="submit" value="Submit" onClick={this.handleSubmit} />
    </label>
      )
    }
    else{
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
  }
}


function mapStateToProps(state) {
  return {
    commands: getCurrentDeviceCommands(state),
    currentDeviceName: getCurrentDeviceName(state),
    getValue: getCommandValue(state),
    displevels: getCommandDisplevels(state),
    enabledList: getEnableDisplevels(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitCommand: (command, value, device) => dispatch(submitCommand(command, value, device)),
    enableDisplevel: (displevel) => dispatch(enableDisplevel(displevel)),
    disableDisplevel: (displevel) => dispatch(disableDisplevel(displevel)),
    allDisplevel: (device) => dispatch(enableAllDisplevel(device))

  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommandsTable);