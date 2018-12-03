import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteDeviceProperty } from '../actions/tango'
import PropTypes from 'prop-types'
import './modal.css';

/**
 * Renders a modal dialog for deleting  properties from a device. Rendered in Layout iff state.modal.modalInstance === 'DELETE_PROPERTY'
 */
class DeleteProperty extends Component{
    constructor(props){
        super(props);
        this.onDeleteProperty = this.onDeleteProperty.bind(this);
    }
    render(){
        const {entity, closeDialog} = this.props; 
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Remove property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to remove property {entity}?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn btn-outline-secondary" onClick={this.onDeleteProperty}>Yes</Button>
                    <Button className="btn btn-outline-secondary" onClick={closeDialog}>No</Button>
                </Modal.Footer>
            </Modal.Dialog>
          );
    }

    onDeleteProperty(event){
        event.preventDefault();
        this.props.deleteProperty(this.props.tangoDB, this.props.currentDevice, this.props.entity);
        this.props.closeDialog();

    }
}

DeleteProperty.PropTypes = {
    entity : PropTypes.string,
    closeDialog :  PropTypes.func,
}

function mapDispatchToProps(dispatch) {
    return {
        deleteProperty: (tangoDB, device, name) => dispatch(deleteDeviceProperty(tangoDB, device, name)),
    };
}

export default connect(null, mapDispatchToProps)(DeleteProperty);