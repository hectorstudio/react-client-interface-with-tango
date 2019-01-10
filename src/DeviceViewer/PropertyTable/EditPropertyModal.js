import React, { Component } from "react";
import { Button } from "react-bootstrap";

import Modal from "../../Modal/Modal";

export default class EditPropertyModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: this.props.initialValue };
  }

  render() {
    const { name, onClose, onEdit } = this.props;
    return (
      <Modal title={"Edit Property"}>
        <Modal.Body>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">{name}</span>
            </div>
            <input
              type="text"
              className="form-control"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
          <div
            style={{
              whiteSpace: "normal",
              fontStyle: "italic",
              paddingTop: "0.5em"
            }}
          >
            WARNING: Property values will currently be set as singular values,
            i.e., arrays of strings are not yet supported.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-outline-secondary"
            onClick={() => onEdit(this.props.name, this.state.value)}
          >
            Save
          </Button>
          <Button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ value: event.target.value });
  }
}
