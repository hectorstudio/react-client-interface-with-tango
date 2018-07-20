
import React, { Component } from 'react';
import {
  getCommandValue, getCurrentDeviceCommands, getCurrentDeviceName, getEnableDisplevels, getCommandDisplevels, getCommandsOutputLoading
} from '../../selectors/devices';

import { submitCommand, enableDisplevel, disableDisplevel, enableAllDisplevel } from '../../actions/tango';
import { connect } from 'react-redux';
import './CommandsTab.css';
import Spinner from '../../Spinner/Spinner';

class CommandsTable extends Component {
  render() {
    const { commands, submitCommand, getValue, currentDeviceName, displevels, enabledList, enableDisplevel, disableDisplevel, loading } = this.props;
    return (
      <div className="commands-table">
        {displevels.length > 1 &&
          <DisplevelBox displevels={displevels} enabledList={enabledList} enableDisplevel={enableDisplevel} disableDisplevel={disableDisplevel} />
        }
        <table className="commands">
          <tbody>
            {commands && commands.map(({ name, displevel, intype }, i) => (Object.values(enabledList).indexOf(displevel) > -1) &&
              <tr key={i}>
                <td>{name}</td>
                <td>{intype}</td>
                <td class="input"><InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={name} intype={intype} getValue={getValue} /></td>
                {getSubmittedValue(name, getValue, currentDeviceName, loading)}
              </tr>
            )}
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

function getSubmittedValue(name, getValue, currentDeviceName, loading) {
  const result = getValue;
  const command= result[currentDeviceName]
  const lodingResult = loading;
  const outputState = lodingResult[currentDeviceName]
  if(typeof command !== 'undefined' && name in command && typeof outputState !== 'undefined' && name in outputState){
    return(
      <td>
        {outputState[name] ? <Spinner size={1}/> : 'Output: ' + command[name]}
        </td>
    )
  }else {
    return "";
  } 
}


class InputField extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { value: '', valid: false};
  }

  handleChange(event) {
    if(this.props.intype === 'DevBoolean' && event.target.value.length > 0){
      this.setState({ value: event.target.value, valid: true });
    }
    else if(event.target.value.length > 0 && this.props.intype !== 'DevString'){
      if(this.props.intype.includes("U") && event.target.value > 0){
        this.setState({ value: parseInt(event.target.value, 10), valid: true });
      }
      if((this.props.intype.includes("Long") || this.props.intype.includes("Short")) && !this.props.intype.includes("U")){
        this.setState({ value: parseInt(event.target.value, 10), valid: true });
      }else if(!this.props.intype.includes("U")){
        this.setState({ value: parseFloat(event.target.value, 10), valid: true });
      }
    }else if(this.props.intype === 'DevString'){
      this.setState({ value: event.target.value});
    }else{
      this.setState({value: '', valid: false });
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    if(this.props.intype === 'DevString'){
      this.props.submitCommand(this.props.name, JSON.stringify(this.state.value), this.props.currentDeviceName)
    }else{
     this.props.submitCommand(this.props.name, this.state.value, this.props.currentDeviceName)
    }
    this.setState({value: '', valid: false });
  }

  render() {
    if (this.props.intype === 'DevVoid') {
      return(
        <button class="btn btn-outline-secondary" type="button" onClick={this.handleSubmit}>Submit</button>
      );
    }
    else if (this.props.intype === 'DevBoolean') {
      return (
        <div class="input-group">
          <select class="custom-select" id="inputGroupSelect04" value={this.state.value} onChange={this.handleChange}>
            <option value="" selected disabled hidden>Choose...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" disabled={!this.state.valid} onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>

      )
    }
    else if (this.props.intype.includes("U")) {
      return (
        <div class="input-group">
          <input type="number" min="0" class="form-control" value={this.state.value} onChange={this.handleChange} />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" onClick={this.handleSubmit} disabled={!this.state.valid}>Submit</button>
          </div>
        </div>
      );
    } else if(this.props.intype === 'DevString') {
      return (
        <div class="input-group">
          <input input type="text" class="form-control" value={this.state.value} onChange={this.handleChange} />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      );
    }else {
      return (
        <div class="input-group">
          <input input type="number" class="form-control" value={this.state.value} onChange={this.handleChange} />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" disabled={!this.state.valid} onClick={this.handleSubmit}>Submit</button>
          </div>
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
    enabledList: getEnableDisplevels(state),
    loading: getCommandsOutputLoading(state)
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