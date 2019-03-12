import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import {
  setDeviceProperty,
  deleteDeviceProperty
} from "../../../state/actions/tango";
import { getIsLoggedIn } from "../../../../shared/user/state/selectors";

import AddPropertyModal from "./AddPropertyModal";
import DeletePropertyModal from "./DeletePropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import NotLoggedIn from "../NotLoggedIn/NotLoggedIn";

import "./PropertyTable.css";

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

const ActionButtons = ({ onPressEdit, onPressDelete }) => (
  <Fragment>
    <EditButton onClick={onPressEdit} />
    &nbsp;
    <DeleteButton onClick={onPressDelete} />
  </Fragment>
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
    const { properties, isLoggedIn } = this.props;
    const { addProperty, deleteProperty, editProperty } = this.state;
    const hasNoProperties = properties.length === 0;

    return (
      <div className="PropertyTable">
        <NotLoggedIn>
          You are currently not logged in and cannot create, edit or delete
          properties.
        </NotLoggedIn>
        {addProperty && (
          <AddPropertyModal
            onClose={() => this.setState({ addProperty: false })}
            onAdd={this.handleAddProperty}
          />
        )}
        {hasNoProperties ? (
          <div>There are no properties defined for this device.</div>
        ) : (
          <table className="separated">
            <tbody>
              {properties.map(({ name, value }, i) => (
                <Fragment key={i}>
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
                      {isLoggedIn && (
                        <ActionButtons
                          onPressDelete={() =>
                            this.setState({ deleteProperty: name })
                          }
                          onPressEdit={() =>
                            this.setState({ editProperty: name })
                          }
                        />
                      )}
                    </td>
                    <td>{value.join("\n")}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
        {isLoggedIn && (
          <button
            className="btn btn-outline-secondary fa fa-plus"
            type="button"
            onClick={() => this.setState({ addProperty: true })}
          />
        )}
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
  return { isLoggedIn: getIsLoggedIn(state) };
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
