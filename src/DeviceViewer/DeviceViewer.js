import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import 'font-awesome/css/font-awesome.min.css';
import { Modal, Button } from 'react-bootstrap';

import CommandsTable from './CommandsTab/CommandsTab';

import {
  selectDevice,
  submitCommand,
  setDeviceProperty,
  deleteDeviceProperty
} from '../actions/tango';

import Spinner from '../Spinner/Spinner';
import ValueDisplay from './ValueDisplay/ValueDisplay';

import './DeviceViewer.css';

import {
  getCurrentDeviceProperties,
  getCurrentDeviceCommands,
  getCurrentDeviceName,
  getCurrentDeviceStateValue,
  getAvailableDataFormats,
} from '../selectors/currentDevice';

import { getDeviceIsLoading } from '../selectors/loadingStatus';

import {
  getFilteredCurrentDeviceAttributes,
  getActiveDataFormat,
  getActiveTab,
} from '../selectors/deviceDetail';

import { setDataFormat, setTab} from '../actions/deviceList';

const PropertyTable = ({ properties, setDeviceProperty, deviceName, deleteDeviceProperty }) =>
  <div>
    <table className="properties">
      <tbody>
        {properties && properties.map(({ name, value }, i) =>
          <tr key={i}>
            <td>
              <EditProperty setDeviceProperty={setDeviceProperty} deleteDeviceProperty={deleteDeviceProperty} deviceName={deviceName} name={name} value={value} />
            </td>
            <td>{name}</td>
            <td>{value.join('\n')}</td>
          </tr>
        )}
      </tbody>
    </table>
    <br></br>
    <SetProperty setDeviceProperty={setDeviceProperty} deviceName={deviceName} />
  </div>;

class EditProperty extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeShow = this.removeShow.bind(this);
    this.removeClose = this.removeClose.bind(this);
    this.removeProp = this.removeProp.bind(this);
    this.state = { value: this.props.value, show: false, remove: false };
  }

  handleClose() {
    this.setState({ value: this.props.value, show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  removeClose() {
    this.setState({ remove: false });
  }

  removeShow() {
    this.setState({ remove: true });
  }

  removeProp() {
    event.preventDefault()
    this.props.deleteDeviceProperty(this.props.deviceName, this.props.name)
    this.removeClose();
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.setDeviceProperty(this.props.deviceName, this.props.name, [this.state.value])
    this.handleClose();
    this.setState({ value: this.state.value });
  }
  render() {
    return (
      <div>
        <i className="fa fa-trash" onClick={this.removeShow}></i> &nbsp;
        <i className="fa fa-pencil" onClick={this.handleShow}></i>

        {this.state.remove &&
          <Modal.Dialog className="modal-style">
            <Modal.Header>
              <Modal.Title>Remove property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to remove property {this.props.name}?
            </p>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-outline-secondary" onClick={this.removeProp}>Yes</Button>
              <Button className="btn btn-outline-secondary" onClick={this.removeClose}>No</Button>
            </Modal.Footer>
          </Modal.Dialog>

        }

        {this.state.show &&
          <Modal.Dialog className="modal-style">
            <Modal.Header>
              <Modal.Title>Edit property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label><span>Name: </span>
                {this.props.name}</label> <br></br>
              <label><span>Value: </span>
                <input type="text" name="value" value={this.state.value} onChange={this.handleChange} />
              </label>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-outline-secondary" onClick={this.handleSubmit}>Save</Button>
              <Button className="btn btn-outline-secondary" onClick={this.handleClose}>Cancel</Button>
            </Modal.Footer>
          </Modal.Dialog>
        }
      </div>

    )
  }
}


class SetProperty extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { formValues: {}, show: false, valid: false };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange(event) {
    event.preventDefault();
    let formValues = this.state.formValues;
    let name = event.target.name;
    let value = event.target.value;
    formValues[name] = value;
    this.setState({ formValues })
    if (this.state.formValues["name"].length > 0) {
      this.setState({ valid: true })
    } else {
      this.setState({ valid: false })
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.setDeviceProperty(this.props.deviceName, this.state.formValues.name, [this.state.formValues.value])
    this.handleClose();
    let formValues = this.state.formValues;
    this.state.formValues["name"] = "";
    this.state.formValues["value"] = "";
    this.setState({ formValues, valid: false });
  }

  render() {

    return (
      <div className="static-modal">
        <button className="btn btn-outline-secondary" type="button" onClick={this.handleShow}>Add new property</button>

        {this.state.show &&
          <Modal.Dialog className='modal-style'>
            <Modal.Header>
              <Modal.Title>Create new property</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <label><span>Name: </span>
                <input type="text" name="name" autoComplete="off" value={this.state.formValues["name"]} onChange={this.handleChange} />
              </label>
              <label><span>Value: </span>
                <input type="text" name="value" value={this.state.formValues["value"]} onChange={this.handleChange} />
              </label>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-outline-secondary" onClick={this.handleSubmit} disabled={!this.state.valid}>Save</Button>
              <Button className="btn btn-outline-secondary" onClick={this.handleClose}>Cancel</Button>
            </Modal.Footer>
          </Modal.Dialog>
        }
      </div>
    );
  }
}

const AttributeTable = ({ attributes, dataFormat, dataFormats, onSetDataFormat }) => {
  const QualityIndicator = ({ quality }) => {
    const sub = {
      'ATTR_VALID': 'valid',
      'ATTR_INVALID': 'invalid',
      'ATTR_CHANGING': 'changing',
      'ATTR_ALARM': 'alarm',
      'ATTR_WARNING': 'warning'
    }[quality] || 'invalid';

    return <span
      className={`quality quality-${sub}`}
      title={quality}>● </span>;
  };

  return (
    <div>

      <table className="attributes">
        <tbody>
          {attributes && attributes.map(({ name, value, quality, datatype, dataformat }, i) =>
            <tr key={i}>
              <td>
                <QualityIndicator quality={quality} />
                {name}
              </td>
              <td>
                <ValueDisplay name={name} value={value} datatype={datatype} dataformat={dataformat} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};



class DeviceMenu extends Component {
  handleSelectDataFormat(format, event) {
    event.preventDefault();
    this.props.onSetDataFormat(format);
  }

  handleSelectTab(tab) {
    this.props.onSetTab(tab);
  }

  render() {
    const { properties, attributes, commands, dataFormat, dataFormats, onSetDataFormat, onSetTab, selectedTab } = this.props;

    const hasAttrs = attributes.length > 0;
    const hasProps = properties.length > 0;
    const hasCommands = commands.length > 0;

    const dataTabs = selectedTab === "attributes" && dataFormats.length > 1 ?
      <ul className='nav nav-pills format-chooser'>
        {dataFormats.map((format, i) =>
          <li
            className='nav-item'
            key={i} onClick={this.handleSelectDataFormat.bind(this, format)}>
            <a className={classNames('nav-link', { active: format === dataFormat })} href='#'>
              {format}
            </a>
          </li>
        )}
      </ul> : null;

    const Tab = ({ name, title }) => <li className='nav-item'>
      <a href={`#${name}`} className={classNames('nav-link', { active: selectedTab === name })} onClick={this.handleSelectTab.bind(this, name)}>
        {title}
      </a>
    </li>;

    return (
      <div className="device-menu">
        <ul className='nav nav-tabs section-chooser'>
          {hasProps && <Tab name='properties' title='Properties' />}
          {hasAttrs && <Tab name='attributes' title='Attributes' />}
          {hasCommands && <Tab name='commands' title='Commands' />}
        </ul>
        {selectedTab === 'attributes' && dataTabs}
      </div>
    );
  }
}

class DeviceTables extends Component {

  render() {
    const { properties, attributes, dataFormat, dataFormats, onSetDataFormat, selectedTab, commands, setDeviceProperty, deviceName, deleteDeviceProperty } = this.props;
    const hasAttrs = attributes.length > 0;
    const hasProps = properties.length > 0;

    return (
      <div className="device-table">
        {hasProps && selectedTab === "properties" && <PropertyTable properties={properties} setDeviceProperty={setDeviceProperty} deviceName={deviceName} deleteDeviceProperty={deleteDeviceProperty} />}
        {selectedTab === "attributes" && <AttributeTable attributes={attributes} dataFormat={dataFormat} dataFormats={dataFormats} onSetDataFormat={onSetDataFormat} />}
        {selectedTab === "commands" && <CommandsTable commands={commands} />}
      </div>
    );
  }
}


class DeviceViewer extends Component {
  parseDevice(props) {
    return (props || this.props).match.params.device;
  }

  parseTab() {
    const { hash } = this.props.history.location;
    const tab = hash.substr(1);
    return tab || undefined;
  }

  componentDidMount() {
    const device = this.parseDevice();
    this.props.selectDevice(device);
  }

  componentDidUpdate(prevProps) {
    const device = this.parseDevice();
    if (device !== this.parseDevice(prevProps)) {
      this.props.selectDevice(device);
    }

    const tab = this.parseTab();
    if (tab && tab !== this.props.activeTab) {
      this.props.selectTab(tab);
    }
  }

  render() {
    const {
      properties,
      attributes,
      loading,
      dataFormat,
      dataFormats,
      selectDataFormat,
      selectTab,
      activeTab,
      currentState,
      commands,
      setDeviceProperty,
      deviceName,
      deleteDeviceProperty
    } = this.props;
    const QualityIndicator = ({ state }) => {
      const sub = {
        'ON': 'on',
        'OFF': 'off',
        'CLOSE': 'close',
        'OPEN': 'open',
        'INSERT': 'insert',
        'EXTRACT': 'extract',
        'MOVING': 'moving',
        'STANDBY': 'standy',
        'FAULT': 'fault',
        'INIT': 'init',
        'RUNNING': 'running',
        'ALARM': 'alarm',
        'DISABLE': 'disable',
        'UNKNOWN': 'unknown'
      }[state] || 'invalid';
      return <span
        className={`state state-${sub}`}
        title={state}>● </span>;
    };

    const content = loading
      ? <Spinner size={4} />
      : <div>
        <Helmet>
          <title>{deviceName}</title>
        </Helmet>
        <div className="device-header">
          <QualityIndicator state={currentState} /> {deviceName}
        </div>
        <div className="device-body">
          <DeviceMenu
            attributes={attributes}
            properties={properties}
            commands={commands}
            dataFormats={dataFormats}
            dataFormat={dataFormat}
            selectedTab={activeTab}
            onSetDataFormat={selectDataFormat}
            onSetTab={selectTab}
          />
          <DeviceTables
            attributes={attributes}
            properties={properties}
            commands={commands}
            dataFormats={dataFormats}
            dataFormat={dataFormat}
            selectedTab={activeTab}
            setDeviceProperty={setDeviceProperty}
            deviceName={deviceName}
            deleteDeviceProperty={deleteDeviceProperty}
          />
        </div>
      </div>;

    return (
      <div className="device-viewer">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    attributes: getFilteredCurrentDeviceAttributes(state),
    properties: getCurrentDeviceProperties(state),
    commands: getCurrentDeviceCommands(state),
    loading: getDeviceIsLoading(state),
    dataFormats: getAvailableDataFormats(state),
    dataFormat: getActiveDataFormat(state),
    activeTab: getActiveTab(state),
    currentState: getCurrentDeviceStateValue(state),
    deviceName: getCurrentDeviceName(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectDevice: device => dispatch(selectDevice(device)),
    selectDataFormat: format => dispatch(setDataFormat(format)),
    selectTab: tab => dispatch(setTab(tab)),
    submitCommand: (command, value) => dispatch(submitCommand(command, value)),
    setDeviceProperty: (device, name, value) => dispatch(setDeviceProperty(device, name, value)),
    deleteDeviceProperty: (device, name) => dispatch(deleteDeviceProperty(device, name))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeviceViewer)
);
