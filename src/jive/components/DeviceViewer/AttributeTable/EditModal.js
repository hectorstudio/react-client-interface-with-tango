import React, { useState, useEffect } from "react";
import cx from "classnames";

import Modal from "../../../../shared/modal/components/Modal/Modal";

function NumericInput({ attribute, onChange }) {
  const { writeValue, minvalue, maxvalue } = attribute;

  const [editValue, setEditValue] = useState(writeValue);

  const asNumber = Number(editValue);
  const isNumeric = editValue !== "" && !isNaN(asNumber);
  const hasBounds = minvalue != null && maxvalue != null;

  let isWithinBounds =
    isNumeric && hasBounds
      ? asNumber >= minvalue && asNumber <= maxvalue
      : true;

  const warningMessage = !isNumeric
    ? "The input value is not numeric."
    : hasBounds && !isWithinBounds
    ? "The input value is not in the permitted range."
    : null;

  const bounds = hasBounds ? `${minvalue}, ${maxvalue}` : null;
  const isValid = isNumeric && (!hasBounds || isWithinBounds);

  useEffect(() => {
    onChange(asNumber, isValid);
  }, [asNumber, isValid, onChange]);

  return (
    <>
      <div className="form-group">
        <label>Write Value:</label>
        <input
          className={cx("form-control", isValid ? "is-valid" : "is-invalid")}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          autoComplete="off"
        />
        <div className="invalid-feedback">{warningMessage}</div>
      </div>
      {bounds && (
        <div className="alert alert-info">Permitted Range: {bounds}</div>
      )}
    </>
  );
}

function BooleanInput({ attribute, onChange }) {
  function onSelect(event) {
    const value = event.target.value === "t";
    onChange(value);
  }

  return (
    <div className="form-group">
      <label>Write Value:</label>
      <select
        className="form-control"
        defaultValue={attribute.writeValue ? "t" : "f"}
        onChange={onSelect}
      >
        <option value="t">true</option>
        <option value="f">false</option>
      </select>
    </div>
  );
}

export default function EditModal({ attribute, onClose, onWrite }) {
  const { name, datatype } = attribute;

  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState();

  const numericTypes = [
    "DevDouble",
    "DevFloat",
    "DevLong",
    "DevLong64",
    "DevShort",
    "DevUChar",
    "DevULong",
    "DevULong64",
    "DevUShort"
  ];

  const attributeIsNumeric = numericTypes.includes(datatype);
  const attributeIsBoolean = datatype === "DevBoolean";
  const attributeIsScalar = attribute.dataformat === "SCALAR";

  function onChange(_value, _isValid) {
    setValue(_value);
    setIsValid(_isValid === undefined ? true : _isValid);
  }

  function trigger() {
    if (isValid) {
      onWrite(value);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    trigger();
  }

  function onClick() {
    trigger();
  }

  const input =
    attributeIsScalar &&
    (attributeIsNumeric ? (
      <NumericInput attribute={attribute} onChange={onChange} />
    ) : attributeIsBoolean ? (
      <BooleanInput attribute={attribute} onChange={onChange} />
    ) : null);

  const body = input ? (
    <form onSubmit={onSubmit}>{input}</form>
  ) : (
    <div>
      Currently only numeric and boolean scalar attributes can be edited.
    </div>
  );

  return (
    <Modal title={name}>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={onClick}
          disabled={!isValid}
        >
          Write
        </button>
      </Modal.Footer>
    </Modal>
  );
}
