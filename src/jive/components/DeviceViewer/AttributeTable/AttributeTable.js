/* eslint-disable jsx-a11y/anchor-is-valid */
//TODO: We should replace the 'links' that don't have a specific destination  with buttons
//      to better signal intention to screen readers etc.

import React, { useState } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ValueDisplay from "./ValueDisplay/ValueDisplay";
import EditModal from "./EditModal";

import DescriptionDisplay from "../DescriptionDisplay/DescriptionDisplay";
import NotLoggedIn from "../NotLoggedIn/NotLoggedIn";

import {
  setDeviceAttribute,
  setDataFormat
} from "../../../state/actions/tango";

import {
  getActiveDataFormat,
  getDisabledDisplevels
} from "../../../state/selectors/deviceDetail";

import "./AttributeTable.css";
import { getIsLoggedIn } from "../../../../shared/user/state/selectors";

const DataFormatChooser = ({ dataFormats, selected, onSelect }) => {
  const order = ["SCALAR", "SPECTRUM", "IMAGE"];
  const sortedFormats = dataFormats
    .slice()
    .sort((f1, f2) => order.indexOf(f1) - order.indexOf(f2));

  return (
    <ul className="DataFormatChooser nav nav-pills">
      {sortedFormats.map(format => (
        <li className="nav-item" key={format}>
          <a
            className={classNames("nav-link", { active: format === selected })}
            href="#"
            onClick={e => {
              e.preventDefault();
              onSelect(format);
            }}
          >
            {format}
          </a>
        </li>
      ))}
    </ul>
  );
};

DataFormatChooser.propTypes = {
  dataFormats: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
  selected: PropTypes.string
};

const QualityIndicator = ({ quality }) => {
  const sub =
    {
      ATTR_VALID: "valid",
      ATTR_INVALID: "invalid",
      ATTR_CHANGING: "changing",
      ATTR_ALARM: "alarm",
      ATTR_WARNING: "warning"
    }[quality] || "invalid";

  return (
    <span className={`QualityIndicator ${sub}`} title={quality}>
      {sub.toUpperCase()}
    </span>
  );
};

const AttributeTableRow = ({ attribute, allowedToEdit, onEdit }) => {
  const {
    name,
    value,
    writeValue,
    datatype,
    dataformat,
    writable,
    maxvalue,
    minvalue,
    description,
    quality
  } = attribute;

  return (
    <tr>
      <td className="quality-name">
        <QualityIndicator quality={quality} /> {name}
      </td>
      {allowedToEdit && (
        <td className="edit">
          {writable !== "READ" && (
            <i
              className="fa fa-pencil"
              onClick={() => onEdit && onEdit(name)}
            />
          )}
        </td>
      )}
      <td className="value">
        <ValueDisplay
          name={name}
          value={value}
          writeValue={writeValue}
          datatype={datatype}
          dataformat={dataformat}
          writable={writable}
          maxvalue={maxvalue}
          minvalue={minvalue}
        />
      </td>
      <td className="description">
        <DescriptionDisplay name={name} description={description} />
      </td>
    </tr>
  );
};

function AttributeTable(props) {
  const {
    attributes,
    selectedFormat,
    disabledDisplevels,
    deviceName,
    onSelectDataFormat,
    onSetDeviceAttribute,
    isLoggedIn
  } = props;

  const [editingName, setEditingName] = useState(null);
  const editingAttribute =
    editingName == null
      ? null
      : attributes.find(({ name }) => name === editingName);

  const dataFormats = Array.from(
    new Set(attributes.map(attr => attr.dataformat))
  );

  const selectedOrFirstFormat =
    dataFormats.indexOf(selectedFormat) !== -1
      ? selectedFormat
      : dataFormats[0];

  const filteredAttributes = attributes.filter(
    attr =>
      attr.dataformat === selectedOrFirstFormat &&
      disabledDisplevels.indexOf(attr.displevel) === -1
  );

  function onWrite(value) {
    onSetDeviceAttribute(editingName, value);
    setEditingName(null);
  }

  function onClose() {
    setEditingName(null);
  }

  return (
    <div className="AttributeTable">
      {editingAttribute && (
        <EditModal
          attribute={editingAttribute}
          onWrite={onWrite}
          onClose={onClose}
        />
      )}
      <NotLoggedIn>
        You are currently not logged in and cannot change attribute values.
      </NotLoggedIn>
      <DataFormatChooser
        dataFormats={dataFormats}
        selected={selectedOrFirstFormat}
        onSelect={onSelectDataFormat}
      />
      <table className="separated">
        <tbody>
          {filteredAttributes.map((attribute, i) => (
            <AttributeTableRow
              key={attribute.name}
              attribute={attribute}
              deviceName={deviceName}
              allowedToEdit={isLoggedIn}
              onEdit={attribute => setEditingName(attribute)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

AttributeTable.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      dataformat: PropTypes.string,
      datatype: PropTypes.string,
      description: PropTypes.string,
      displevel: PropTypes.string,
      maxvalue: PropTypes.any,
      minvalue: PropTypes.any,
      name: PropTypes.string,
      quality: PropTypes.string,
      value: PropTypes.any, //possibly PropTypes.oneOfType(...)
      writeValue: PropTypes.any,
      writable: PropTypes.string
    })
  ),
  deviceName: PropTypes.string,
  disabledDisplevels: PropTypes.arrayOf(PropTypes.string),
  onSelectDataFormat: PropTypes.func,
  onSetDeviceAttribute: PropTypes.func,
  selectedFormat: PropTypes.string
};

function mapStateToProps(state) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    selectedFormat: getActiveDataFormat(state),
    disabledDisplevels: getDisabledDisplevels(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB, deviceName } = ownProps;
  return {
    onSelectDataFormat: format => dispatch(setDataFormat(format)),
    onSetDeviceAttribute: (name, value) =>
      dispatch(setDeviceAttribute(tangoDB, deviceName, name, value))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeTable);
