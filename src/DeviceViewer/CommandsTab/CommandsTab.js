
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getCurrentDeviceCommands,
  getCurrentDeviceName,
  getCommandValue,
  getCommandDisplevels,
  getCurrentDeviceCommandOutputs,
} from '../../selectors/devices';

import {
  getEnabledDisplevels
} from '../../selectors/deviceDetail';

import {
  getCommandOutputsLoading
} from '../../selectors/loadingStatus';

import {
  submitCommand,
  enableDisplevel,
  disableDisplevel,
  enableAllDisplevel
} from '../../actions/tango';

import Spinner from '../../Spinner/Spinner';

import './CommandsTab.css';

const OutputDisplay = ({value, isLoading}) => isLoading
  ? <Spinner size={1}/>
  : value || '';

class CommandsTable extends Component {
  render() {
    const {
      commands,
      submitCommand,
      currentDeviceName,
      displevels,
      enabledList,
      enableDisplevel,
      disableDisplevel,
      outputsLoading,
      commandOutputs
    } = this.props;
    
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
                <td className="input">
                  <InputField submitCommand={submitCommand} currentDeviceName={currentDeviceName} commands={commands} name={name} intype={intype}/>
                </td>
                <td>
                  <OutputDisplay value={commandOutputs[name]} isLoading={outputsLoading[name]}/>
                </td>
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
      <span className="checkboxes" key={i}>
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
      if(this.props.intype.includes("U") && event.target.value >= 0){
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
        <button className="btn btn-outline-secondary" type="button" onClick={this.handleSubmit}>Submit</button>
      );
    }
    else if (this.props.intype === 'DevBoolean') {
      return (
        <div className="input-group">
          <select className="custom-select" id="inputGroupSelect04" value={this.state.value} onChange={this.handleChange}>
            <option value="" defaultValue disabled hidden>Choose...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" disabled={!this.state.valid} onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>

      )
    }
    else if (this.props.intype.includes("U")) {
      return (
        <div className="input-group">
          <input type="number" min="0" className="form-control" value={this.state.value} onChange={this.handleChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={this.handleSubmit} disabled={!this.state.valid}>Submit</button>
          </div>
        </div>
      );
    } else if(this.props.intype === 'DevString') {
      return (
        <div className="input-group">
          <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      );
    }else {
      return (
        <div className="input-group">
          <input type="number" className="form-control" value={this.state.value} onChange={this.handleChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" disabled={!this.state.valid} onClick={this.handleSubmit}>Submit</button>
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
    displevels: getCommandDisplevels(state),
    enabledList: getEnabledDisplevels(state),
    
    commandOutputs: getCurrentDeviceCommandOutputs(state),
    outputsLoading: getCommandOutputsLoading(state)
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