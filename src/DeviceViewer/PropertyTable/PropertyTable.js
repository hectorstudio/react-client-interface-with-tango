import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {isMobile} from 'react-device-detect';
import PropTypes from 'prop-types'

import {
    getCurrentDeviceProperties,
} from '../../selectors/currentDevice';

import {
    DELETE_PROPERTY,
    CREATE_PROPERTY,
    EDIT_PROPERTY,
    setModal,
} from '../../actions/modal'

import './PropertyTable.css';

const PropertyTable = ({ properties, deviceName, showDeletePropertyDialog, showEditPropertyDialog, showAddPropertyDialog}) =>
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
                            showDeletePropertyDialog={showDeletePropertyDialog}
                            showEditPropertyDialog={showEditPropertyDialog}
                            
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
            showAddPropertyDialog={showAddPropertyDialog}
        />
    </div>;

PropertyTable.propTypes = {
    properties: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string, 
        value: PropTypes.arrayOf(PropTypes.string)
    })),
    deviceName: PropTypes.string,
    showDeletePropertyDialog: PropTypes.func,
    showEditPropertyDialog: PropTypes.func,
    showAddPropertyDialog: PropTypes.func,
}

class EditProperty extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.removeShow = this.removeShow.bind(this);
    }

    handleShow() {
        this.props.showEditPropertyDialog(this.props.name);
    }

    removeShow() {
        this.props.showDeletePropertyDialog(this.props.name);
    }

    render() {
        return (
            <Fragment>
                <i className={"fa fa-trash " + (isMobile ? "visible" : "")} onClick={this.removeShow}></i> &nbsp;
                <i className={"fa fa-pencil " + (isMobile ? "visible" : "")} onClick={this.handleShow}></i>
            </Fragment>
        );
    }
}

EditProperty.propTypes = {
    name: PropTypes.string,
    showEditPropertyDialog: PropTypes.func,
    showDeletePropertyDialog: PropTypes.func,
}

class SetProperty extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
    }

    handleShow() {
        this.props.showAddPropertyDialog(this.props.deviceName);
    }

    render() {
        return (
            <div className="static-modal">
                <button className="btn btn-outline-secondary" type="button" onClick={this.handleShow}>Add new property</button>
            </div>
        );
    }
}

SetProperty.propTypes = {
    deviceName: PropTypes.string,
    showAddPropertyDialog: PropTypes.func,
}

function mapStateToProps(state) {
    return {
        properties: getCurrentDeviceProperties(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        showDeletePropertyDialog: (name) => dispatch(setModal(DELETE_PROPERTY, name)),
        showAddPropertyDialog: () => dispatch(setModal(CREATE_PROPERTY)),
        showEditPropertyDialog: (name) => dispatch(setModal(EDIT_PROPERTY, name)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyTable);
