
import React, { Component } from 'react';
import {  getCommandValue, getCurrentDeviceCommands, getCurrentDeviceName, getCommandsDisplevel
} from '../../selectors/devices';

import { submitCommand } from '../../actions/tango';
import { connect } from 'react-redux';

var array = []
const CommandsTable = ({commands, submitCommand, getValue, currentDeviceName, displevel}) => 
<div>
  <table className="commands">
    <tbody>
    <tr>
    <DisplevelBox displevel={displevel} array={array} />
    </tr>
    {commands && commands.map(({name, displevel, intype}, i) =>
      <tr key={i}>
        <td>{name}</td>
        <td>{displevel}</td>
        <td>{intype}</td>
        <td>{getDisplevel(displevel, array)}</td>
        <td><InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={intype} getValue={getValue} /></td>
        <td>{getSubmittedValue(name, getValue, currentDeviceName)}</td>
      </tr>
    )}
    </tbody>
  </table>
</div>;

function getSubmittedValue(name, getValue, currentDeviceName){
    const result = getValue;
    if(name in result && result['deviceName'] === currentDeviceName){
        return 'Output: ' + result[name]
    } else{
        return "";
    }
}

function getDisplevel(displevel, array){
  var array = array
  const level = displevel
  if(array.indexOf(level) == -1){
      array.push(level)
  }
  console.log('TestFunction ', array)
}

 class InputField extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {value: ''};
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    var re = /^[a-z][a-z\s]*$/;
    if(this.props.name === 'DevString' && this.state.value.match(re)){
      this.props.submitCommand(this.props.name, JSON.stringify(this.state.value), this.props.currentDeviceName)
    } if(this.props.name === 'DevBoolean' && (this.state.value ==="true" || (this.state.value === "false"))){
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }else{
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }
    this.setState({
        value: ''
      });
  }

  render() {
    if(this.props.name === 'DevVoid'){
      return "";
    }
    else{
    return (
      <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
  }
}

class DisplevelBox extends Component {
  constructor(props) {
      super(props);
      this.state = {
        isGoing: true,
      };
      this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }

  render() {
  var array =this.props.array
  const level = JSON.stringify(this.props.displevel)
  if(array.indexOf(level) == -1){
      array.push(level)
  }
  console.log('Test ', array)
  var i;
    return(
      <td>
      {array[array.length-1]}
      <input name="isGoing" type="checkbox" checked={this.state.isGoing} onChange={this.handleInputChange} />
    </td>
    )
  }
}

function mapStateToProps(state) {
    return {
        commands: getCurrentDeviceCommands(state),
        currentDeviceName: getCurrentDeviceName(state),
        getValue: getCommandValue(state),
        displevel: getCommandsDisplevel(state)
    };
  }

function mapDispatchToProps(dispatch) {
    return {
        submitCommand: (command, value, device) => dispatch(submitCommand(command, value, device))
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CommandsTable);
