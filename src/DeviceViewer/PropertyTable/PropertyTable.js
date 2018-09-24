import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {isMobile} from 'react-device-detect';

import {
    getCurrentDeviceProperties,
    getCurrentDeviceName
} from '../../selectors/currentDevice';

import {
    setDeviceProperty,
    deleteDeviceProperty
} from '../../actions/tango';

import './PropertyTable.css';

const PropertyTable = ({ properties, deviceName, onSetDeviceProperty, onDeleteDeviceProperty }) =>
    <div className='PropertyTable'>
        <table className='separated'>
            <tbody>
            {properties && properties.map(({ name, value }, i) =>
                <tr key={i}>
                    <td className="name">
                        {name}
                    </td>
                    <td className="actions">
                        <EditProperty
                            deviceName={deviceName}
                            name={name}
                            value={value}
                            onSetDeviceProperty={onSetDeviceProperty}
                            onDeleteDeviceProperty={onDeleteDeviceProperty}
                        />
                    </td>
                    <td>
                        {value.join('\n')}
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        <br></br>
        <SetProperty
            deviceName={deviceName}
            onSetDeviceProperty={onSetDeviceProperty}
        />
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
        this.props.onDeleteDeviceProperty(this.props.deviceName, this.props.name)
        this.removeClose();
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.onSetDeviceProperty(this.props.deviceName, this.props.name, [this.state.value])
        this.handleClose();
        this.setState({ value: this.state.value });
    }

    render() {
        return (
            <Fragment>
                <i className={"fa fa-trash " + (isMobile ? "visible" : "")} onClick={this.removeShow}></i> &nbsp;
                <i className={"fa fa-pencil " + (isMobile ? "visible" : "")} onClick={this.handleShow}></i>

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
                </Modal.Dialog>}

                {this.state.show &&
                <Modal.Dialog className="modal-style">
                    <Modal.Header>
                        <Modal.Title>Edit property</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">{this.props.name}</span>
                            </div>
                            <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange}/>
                        </div>
                        <div style={{whiteSpace: 'normal', fontStyle: 'italic', paddingTop: '0.5em'}}>
                            WARNING: Property values will currently be set as singular values, i.e., arrays of strings are not yet supported.
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-outline-secondary" onClick={this.handleSubmit}>Save</Button>
                        <Button className="btn btn-outline-secondary" onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Dialog>}
            </Fragment>
        );
    }
}

class SetProperty extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = { formValues: {name: "", value: ""}, show: false, valid: false };
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
        this.props.onSetDeviceProperty(this.props.deviceName, this.state.formValues.name, [this.state.formValues.value])
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
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Name</span>
                            </div>
                            <input type="text" name="name" className="form-control" autocomplete="off" value={this.state.formValues["name"]} onChange={this.handleChange} />
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Value</span>
                            </div>
                            <input type="text" name="value" className="form-control" value={this.state.formValues["value"]} onChange={this.handleChange} />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-outline-secondary" onClick={this.handleSubmit} disabled={!this.state.valid}>
                            Save
                        </Button>
                        <Button className="btn btn-outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        properties: getCurrentDeviceProperties(state),
        deviceName: getCurrentDeviceName(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSetDeviceProperty: (device, name, value) => dispatch(setDeviceProperty(device, name, value)),
        onDeleteDeviceProperty: (device, name) => dispatch(deleteDeviceProperty(device, name)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyTable);
