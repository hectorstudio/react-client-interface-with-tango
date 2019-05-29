import React, { useState } from "react";
import Modal from "../../../../shared/modal/components/Modal/Modal";

export default function EditModal({ attribute, onClose, onWrite }) {
  const { name, datatype, writeValue, minvalue, maxvalue } = attribute;

  const [editValue, setEditValue] = useState(writeValue);

  const asNumber = Number(editValue);
  const isNumeric = editValue !== "" && !isNaN(asNumber);
  const hasBounds = minvalue != null && maxvalue != null;

  let isWithinBounds =
    isNumeric && hasBounds
      ? asNumber >= minvalue && asNumber <= maxvalue
      : true;

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
  const isValid = isNumeric && (!hasBounds || isWithinBounds);

  function onSubmit(event) {
    if (isValid) {
      event.preventDefault();
      onWrite(asNumber);
    }
  }

  function onChange(event) {
    setEditValue(event.target.value);
  }

  function onClick() {
    onWrite(asNumber);
  }

  const warningMessage = !isNumeric
    ? "The input value is not numeric."
    : hasBounds && !isWithinBounds
    ? "The input value is not between the permitted bounds."
    : null;

  const bounds = hasBounds ? `[${minvalue}, ${maxvalue}]` : null;

  const body = attributeIsNumeric ? (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label for="write-value">Write Value {bounds}</label>
        <input
          name="write-value"
          className={"form-control " + (isValid ? "is-valid" : "is-invalid")}
          value={editValue}
          onChange={onChange}
        />
        <div className="invalid-feedback">{warningMessage}</div>
      </div>
    </form>
  ) : (
    <div>Currently only numeric attributes can be edited.</div>
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
