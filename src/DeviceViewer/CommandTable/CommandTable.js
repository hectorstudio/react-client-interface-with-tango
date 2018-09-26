
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getCurrentDeviceCommands,
  getCurrentDeviceName,
  getCurrentDeviceCommandOutputs,
  getCommandDisplevels,
} from '../../selectors/currentDevice';

import {
  getEnabledDisplevels
} from '../../selectors/deviceDetail';

import {
  getCommandOutputsLoading
} from '../../selectors/loadingStatus';

import {
  executeCommand,
} from '../../actions/tango';

import Spinner from '../../Spinner/Spinner';

import './CommandTable.css';
import DescriptionDisplay from '../DescriptionDisplay/DescriptionDisplay';

const OutputDisplay = ({value, isLoading}) => isLoading
  ? <Spinner size={1}/>
  : (
    value ? (
      <div className='output-display'>
        <div className='arrow'/>
        <div className='output'>{value || ''}</div>
      </div>
    ) : null
  );

class CommandTable extends Component {
  render() {
    const {
      commands,
      onExecute,
      currentDeviceName,
      displevels,
      enabledList,
      outputsLoading,
      commandOutputs
    } = this.props;
    
    return (
      <div className="CommandTable">
        <table className='separated'>
          <tbody>
            {commands && commands.map(({ name, displevel, intype, intypedesc, outtypedesc }, i) => (Object.values(enabledList).indexOf(displevel) > -1) &&
              <tr key={i}>
                <td>
                  {name}
                  <br/>
                  <OutputDisplay value={commandOutputs[name]} isLoading={outputsLoading[name]}/>
                </td>
                <td className="input">
                  <InputField onExecute={onExecute} currentDeviceName={currentDeviceName} commands={commands} name={name} intype={intype}/>
                </td>
                <td className='description'>
                  <DescriptionDisplay description={`Input: ${intypedesc}\nOutput: ${outtypedesc}`}/>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}


class InputField extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.state = {
      value: '',
      valid: this.props.intype === 'DevString'
    };
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
      this.setState({ value: event.target.value, valid: true});
    }else{
      this.setState({value: '', valid: false });
    }
  }

  handleExecute(event) {
    event.preventDefault()
    if(this.props.intype === 'DevString'){
      this.props.onExecute(this.props.name, JSON.stringify(this.state.value), this.props.currentDeviceName)
    }else{
     this.props.onExecute(this.props.name, this.state.value, this.props.currentDeviceName)
    }
    this.setState({value: '', valid: false });
  }

  render() {
    const intype = this.props.intype;
    let inner = null;

    if (intype === 'DevVoid') {
      return (
        <button className="btn btn-outline-secondary" type="button" onClick={this.handleExecute}>Execute</button>
      );
    }

    if (intype === 'DevBoolean') {
      inner = (
        <select className="custom-select" id="inputGroupSelect04" value={this.state.value} onChange={this.handleChange}>
          <option value="" defaultValue disabled hidden>Choose...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    } else if (intype.includes("U")) {
      inner = <input type="number" min="0" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder={intype}/>;
    } else if (intype === 'DevString') {
      inner = <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder={intype}/>;
    } else {
      inner = <input type="number" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder={intype}/>;
    }

    return (
      <div className="input-group">
        {inner}
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" disabled={!this.state.valid} onClick={this.handleExecute}>Execute</button>
        </div>
      </div>
    );
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
    onExecute: (command, value, device) => dispatch(executeCommand(command, value, device)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandTable);
