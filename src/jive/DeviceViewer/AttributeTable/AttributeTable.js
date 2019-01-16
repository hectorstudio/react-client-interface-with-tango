import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ValueDisplay from "./ValueDisplay/ValueDisplay";
import DescriptionDisplay from "../DescriptionDisplay/DescriptionDisplay";

import { setDeviceAttribute } from "../../actions/tango";

import "./AttributeTable.css";

import {
  getFilteredCurrentDeviceAttributes,
  getActiveDataFormat,
  getDisabledDisplevels
} from "../../selectors/deviceDetail";

import { setDataFormat } from "../../actions/deviceList";
import NotLoggedIn from "../NotLoggedIn/NotLoggedIn";

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
    <span className={`QualityIndicator quality-${sub}`} title={quality}>
      ●{" "}
    </span>
  );
};

const AttributeTableRow = ({
  attribute,
  deviceName, // Make obsolete
  onSetDeviceAttribute
}) => {
  const {
    name,
    value,
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
      <td className="quality">
        <QualityIndicator quality={quality} />
      </td>
      <td className="name">{name}</td>
      <td className="value">
        <ValueDisplay
          name={name}
          value={value}
          datatype={datatype}
          dataformat={dataformat}
          writable={writable}
          maxvalue={maxvalue}
          minvalue={minvalue}
          setDeviceAttribute={onSetDeviceAttribute}
        />
      </td>
      <td className="description">
        <DescriptionDisplay description={description} />
      </td>
    </tr>
  );
};

class AttributeTable extends Component {
  render() {
    const {
      attributes,
      selectedFormat,
      disabledDisplevels,
      onSelectDataFormat,
      onSetDeviceAttribute
    } = this.props;

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

    return (
      <div className="AttributeTable">
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
                key={i}
                attribute={attribute}
                deviceName={this.props.deviceName}
                onSetDeviceAttribute={onSetDeviceAttribute}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
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
