
import React, { Component } from 'react';
import {
  getCommandValue, getCurrentDeviceCommands, getCurrentDeviceName, getCommandsDisplevel, getEnableDisplevels
} from '../../selectors/devices';

import { submitCommand, enableDisplevel } from '../../actions/tango';
import { connect } from 'react-redux';

var array = []

const CommandsTable = ({ commands, submitCommand, getValue, currentDeviceName, enabledList, enableDisplevel }) =>
  <div>
    <table className="commands">
      <tbody>
        <tr>
          {console.log("commandTable ", enabledList)}
        <DisplevelBox array={array} commands={commands} enabledList={enabledList} enableDisplevel={enableDisplevel} />
        </tr>
        {Object.keys(enabledList).length > 0 ?
        commands && commands.map(({ name, displevel, intype }, i) => (displevel in enabledList) &&
          <tr key={i}>
          <td>{name}</td>
            <td>{displevel}</td>
            <td>{intype}</td>
            <td>{getDisplevel(displevel, array)}</td>
            <td><InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={intype} getValue={getValue} /></td>
            <td>{getSubmittedValue(name, getValue, currentDeviceName)}</td>
          </tr>
      )  :
      commands && commands.map(({ name, displevel, intype }, i) =>
      <tr key={i}>
      <td>{name}</td>
        <td>{displevel}</td>
        <td>{intype}</td>
        <td>{getDisplevel(displevel, array)}</td>
        <td><InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={intype} getValue={getValue} /></td>
        <td>{getSubmittedValue(name, getValue, currentDeviceName)}</td>
      </tr>
        )
        }
      </tbody>
    </table>
  </div>;

class DisplevelBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleInputChange(event) {
   // const target = event.target;
    //const value = target.type === 'checkbox' ? target.checked : target.value;
    //const name = target.name;
    event.preventDefault()
    this.props.enableDisplevel(event.target.value)
  }

  render() {
    const listItems = array.map((name) => 
      <tr key={name.toString()}>
        <td>
          <input name="isGoing" type="checkbox" value={name} onChange={this.handleInputChange} />
          {name}
        </td>
      </tr>
    );
    return(
      listItems 

   )   

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

function getDisplevel(displevel, array) {
  var array = array
  const level = displevel
  if (array.indexOf(level) == -1) {
    array.push(level)
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
    }else if(this.props.name === 'DevBoolean' && (this.state.value ==="true" || (this.state.value === "false"))){
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }else{
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
    displevel: getCommandsDisplevel(state),
    enabledList: getEnableDisplevels(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitCommand: (command, value, device) => dispatch(submitCommand(command, value, device)),
    enableDisplevel: (displevel) => dispatch(enableDisplevel(displevel))
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommandsTable);
