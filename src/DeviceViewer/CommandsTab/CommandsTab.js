
import React, { Component } from 'react';
import {  getCommandValue, getCurrentDeviceCommands, getCurrentDeviceName
} from '../../selectors/devices';

import { submitCommand } from '../../actions/tango';
import { connect } from 'react-redux';

const CommandsTable = ({commands, submitCommand, getValue, currentDeviceName}) => 
<div>
  <table className="commands">
    <tbody>
    {commands && commands.map(({name, displevel,outtype, intype, intypedesc, outtypedesc}, i) =>
      <tr key={i}>
        <td>{name}</td>
        <td>{displevel}</td>
        <td>{intype}</td>
        <td><Calculator submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={intype} getValue={getValue} /></td>
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

 class Calculator extends Component {
  
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
      this.props.submitCommand(this.props.name, this.state.value.toString, this.props.currentDeviceName)
    } if(this.props.name === 'DevBoolean' && this.state.value === (true || false)){
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }else{
        this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
        console.log('asdsadads234', this.props.value);
    }
    this.setState({
        value: ''
      });
   //alert('A name was submitted: ' + output);
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
    render() {
    const {comDisplevel} = this.props;
    {JSON.stringify(comDisplevel)}
    return "";
    }
  }

function mapStateToProps(state) {
    return {
        commands: getCurrentDeviceCommands(state),
        currentDeviceName: getCurrentDeviceName(state),
        getValue: getCommandValue(state)
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
