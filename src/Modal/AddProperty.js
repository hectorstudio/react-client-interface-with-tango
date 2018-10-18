import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setDeviceProperty } from '../actions/tango'
import PropTypes from 'prop-types'

/**
 * Renders a modal dialog for adding new properties to a device. Rendered in Layout iff state.modal.modalInstance === 'CREATE_PROPERTY'
 */
class AddProperty extends Component{
    constructor(props){
        super(props);
        this.onAddProperty = this.onAddProperty.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { formValues: {name: "", value: ""}, valid: false };
    }

    render(){
        const {closeDialog} = this.props; 
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Add property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Name</span>
                            </div>
                            <input type="text" name="name" className="form-control" autoComplete="off" value={this.state.formValues["name"]} onChange={this.handleChange} />
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Value</span>
                            </div>
                            <input type="text" name="value" className="form-control" value={this.state.formValues["value"]} onChange={this.handleChange} />
                        </div>
                    </Modal.Body>

                <Modal.Footer>
                    <Button className="btn btn-outline-secondary" onClick={this.onAddProperty} disabled={!this.state.valid}>Create</Button>
                    <Button className="btn btn-outline-secondary" onClick={closeDialog}>Cancel</Button>
                </Modal.Footer>
            </Modal.Dialog>
          );
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

    onAddProperty(event){
        event.preventDefault();
        this.props.addProperty(this.props.currentDevice, this.state.formValues.name, [this.state.formValues.value]);
        this.props.closeDialog();

    }
}

AddProperty.PropTypes = {
        closeDialog :  PropTypes.func,
}

function mapDispatchToProps(dispatch) {
    return {
        addProperty: (device, name, value) => dispatch(setDeviceProperty(device, name, value)),
    };
}

export default connect(null, mapDispatchToProps)(AddProperty);