import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {getModalInstance, getEntity, getIsShowing} from '../selectors/modals'
import { connect } from 'react-redux';
import {setDeviceProperty, deleteDeviceProperty} from '../actions/tango'
import {CREATE_PROPERTY, EDIT_PROPERTY, DELETE_PROPERTY, setModal, clearModal} from '../actions/modal'
import { getCurrentDeviceName } from '../selectors/currentDevice';
import DeleteProperty from './DeleteProperty'
import AddProperty from './AddProperty'
import EditProperty from './EditProperty'
import PropTypes from 'prop-types'
import Login from './Login';

/**
 * Observes the the state of 'modal' and renders the associated modal dialog.
 */
class ModalDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            isShowing,
            entity,
            modalInstance,
            currentDevice,
        } = this.props;

        switch (modalInstance) {
            case CREATE_PROPERTY:
            return (
                <AddProperty
                    entity={entity}
                    currentDevice={currentDevice}
                    closeDialog={this.props.closeDialog}
                    tangoDB={this.props.tangoDB}
                />
              );
              case EDIT_PROPERTY:
              return (
                <EditProperty
                    entity={entity}
                    currentDevice={currentDevice}
                    closeDialog={this.props.closeDialog}
                    tangoDB={this.props.tangoDB}
                />
              );
              case DELETE_PROPERTY:
              return (
                <DeleteProperty
                    entity={entity}
                    currentDevice={currentDevice}
                    closeDialog={this.props.closeDialog}
                    tangoDB={this.props.tangoDB}
                />
              );
              case "LOGIN":
                return <Login closeDialog={this.props.closeDialog}/>
            default:
              return null;
          }
    }
}
ModalDialog.propTypes = {
    isShowing: PropTypes.bool,
    entity: PropTypes.string,
    modalInstance:  PropTypes.string,
    currentDevice: PropTypes.string,
}
function mapStateToProps(state) {
    return {
      isShowing: getIsShowing(state),
      entity: getEntity(state),
      modalInstance: getModalInstance(state),
      currentDevice: getCurrentDeviceName(state),
    };
  }

function mapDispatchToProps(dispatch) {
    return {
        closeDialog: () => dispatch(clearModal()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDialog);