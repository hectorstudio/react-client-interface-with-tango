import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import {
  getCurrentDeviceProperties,
  getCurrentDeviceName
} from "../../selectors/currentDevice";

import { setDeviceProperty, deleteDeviceProperty } from "../../actions/tango";

import "./PropertyTable.css";

import AddPropertyModal from "./AddPropertyModal";
import DeletePropertyModal from "./DeletePropertyModal";
import EditPropertyModal from "./EditPropertyModal";

const EditButton = ({ onClick }) => (
  <i
    className={"fa fa-pencil " + (isMobile ? "visible" : "")}
    onClick={onClick}
  />
);

const DeleteButton = ({ onClick }) => (
  <i
    className={"fa fa-trash " + (isMobile ? "visible" : "")}
    onClick={onClick}
  />
);

class PropertyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addProperty: false,
      deleteProperty: null,
      editProperty: null
    };

    this.handleAddProperty = this.handleAddProperty.bind(this);
    this.handleEditProperty = this.handleEditProperty.bind(this);
    this.handleDeleteProperty = this.handleDeleteProperty.bind(this);
  }

  render() {
    const { properties } = this.props;
    const { addProperty, deleteProperty, editProperty } = this.state;

    return (
      <div className="PropertyTable">
        {addProperty && (
          <AddPropertyModal
            onClose={() => this.setState({ addProperty: false })}
            onAdd={this.handleAddProperty}
          />
        )}
        <table className="separated">
          <tbody>
            {properties &&
              properties.map(({ name, value }, i) => (
                <Fragment>
                  {editProperty === name && (
                    <EditPropertyModal
                      name={name}
                      initialValue={value}
                      onClose={() => this.setState({ editProperty: null })}
                      onEdit={this.handleEditProperty}
                    />
                  )}
                  {deleteProperty === name && (
                    <DeletePropertyModal
                      name={name}
                      onClose={() => this.setState({ deleteProperty: null })}
                      onDelete={this.handleDeleteProperty}
                    />
                  )}
                  <tr key={i}>
                    <td className="name">{name}</td>
                    <td className="actions">
                      <DeleteButton
                        onClick={() => this.setState({ deleteProperty: name })}
                      />
                      &nbsp;
                      <EditButton
                        onClick={() => this.setState({ editProperty: name })}
                      />
                    </td>
                    <td>{value.join("\n")}</td>
                  </tr>
                </Fragment>
              ))}
          </tbody>
        </table>
        <button
          className="btn btn-outline-secondary fa fa-plus"
          type="button"
          onClick={() => this.setState({ addProperty: true })}
        />
      </div>
    );
  }

  handleAddProperty(name, value) {
    this.props.onAddProperty(name, value);
    this.setState({ addProperty: false });
  }

  handleEditProperty(name, value) {
    this.props.onEditProperty(name, value);
    this.setState({ editProperty: null });
  }

  handleDeleteProperty(name) {
    this.props.onDeleteProperty(name);
    this.setState({ deleteProperty: null });
  }
}

function mapStateToProps(state) {
  return {
    deviceName: getCurrentDeviceName(state),
    properties: getCurrentDeviceProperties(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB, deviceName } = ownProps;

  return {
    onAddProperty: (name, value) =>
      dispatch(setDeviceProperty(tangoDB, deviceName, name, [value])),
    onEditProperty: (name, value) =>
      dispatch(setDeviceProperty(tangoDB, deviceName, name, [value])),
    onDeleteProperty: name =>
      dispatch(deleteDeviceProperty(tangoDB, deviceName, name))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTable);
