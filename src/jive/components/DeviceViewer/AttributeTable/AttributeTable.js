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
import { NonScalarValueModal } from "./NonScalarValueModal";

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

const AttributeTableRow = ({ tangoDB, deviceName, attribute, allowedToEdit, onEdit }) => {
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

  const [nonScalarOnDisplay, setNonScalarOnDisplay] = useState(null);
  const isWritable = dataformat === "SCALAR" && writable !== "READ";

  return (
    <tr>
      <td className="quality-name">
        <QualityIndicator quality={quality} />
      </td>
      <td>
        {dataformat !== "SCALAR" && (
          <i
            className="fa fa-eye view"
            style={{ marginRight: "1em" }}
            onClick={() => setNonScalarOnDisplay(name)}
          />
        )}
        {name}
      </td>
      {allowedToEdit && (
        <td
          className={classNames("edit", { writable: isWritable })}
          onClick={() => isWritable && onEdit && onEdit(name)}
        >
          {isWritable && <i className="fa fa-pencil" />}
        </td>
      )}
      <td className="value">
        {dataformat === "SCALAR" ? (
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
        ) : nonScalarOnDisplay ? (
          <NonScalarValueModal
          tangoDB={tangoDB}
            device={deviceName}
            attribute={name}
            dataformat={dataformat}
            datatype={datatype}
            onClose={() => setNonScalarOnDisplay(null)}
          />
        ) : null}
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
    isLoggedIn,
    tangoDB
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
              tangoDB={tangoDB}
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
