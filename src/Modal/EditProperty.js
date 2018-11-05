import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setDeviceProperty } from '../actions/tango'
import { getCurrentDeviceProperties } from '../selectors/currentDevice'
import PropTypes from 'prop-types'
import './modal.css';

/**
 * Renders a modal dialog for deleting  properties from a device. Rendered in Layout iff state.modal.modalInstance === 'EDIT_PROPERTY'
 */
class EditProperty extends Component{
    constructor(props){
        super(props);
        this.onEditProperty = this.onEditProperty.bind(this);
        this.handleChange = this.handleChange.bind(this);
        const prop = this.props.properties.find(prop => prop.name === this.props.entity);
        this.state = { value: prop.value };
    }
    render(){
        const {entity, closeDialog} = this.props; 
        return (
            <Modal.Dialog>
                 <Modal.Header>
                        <Modal.Title>Edit property</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">{this.props.entity}</span>
                            </div>
                            <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange}/>
                        </div>
                        <div style={{whiteSpace: 'normal', fontStyle: 'italic', paddingTop: '0.5em'}}>
                            WARNING: Property values will currently be set as singular values, i.e., arrays of strings are not yet supported.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="btn btn-outline-secondary" onClick={this.onEditProperty}>Save</Button>
                    <Button className="btn btn-outline-secondary" onClick={closeDialog}>Cancel</Button>
                </Modal.Footer>
            </Modal.Dialog>
          );
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({ value: event.target.value })
    }

    onEditProperty(event){
        event.preventDefault();
        this.props.editProperty(this.props.currentDevice, this.props.entity, [this.state.value]);
        this.props.closeDialog();
    }
}
EditProperty.PropTypes = {
    entity : PropTypes.string,
    closeDialog : PropTypes.func,
}

function mapStateToProps(state) {
    return {
        properties: getCurrentDeviceProperties(state),
    };
}
function mapDispatchToProps(dispatch) {
    return {
        editProperty: (device, name, value) => dispatch(setDeviceProperty(device, name, value)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProperty);