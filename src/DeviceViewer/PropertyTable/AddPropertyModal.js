import React, { Component } from "react";
import { Button } from "react-bootstrap";

import Modal from "../../Modal/Modal";

export default class AddPropertyModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", value: "", valid: false };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  render() {
    return (
      <Modal title={"Add Property"}>
        <Modal.Body>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Name</span>
            </div>
            <input
              type="text"
              name="name"
              className="form-control"
              autoComplete="off"
              value={this.state.name}
              onChange={this.handleChangeName}
            />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Value</span>
            </div>
            <input
              type="text"
              name="value"
              className="form-control"
              value={this.state.value}
              onChange={this.handleChangeValue}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn btn-outline-secondary"
            onClick={this.handleAdd}
            disabled={!this.state.valid}
          >
            Create
          </Button>
          <Button
            className="btn btn-outline-secondary"
            onClick={() => this.props.onClose()}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleChangeName(event) {
    const name = event.target.value;
    const valid = name.length > 0;
    this.setState({ name, valid });
  }

  handleChangeValue(event) {
    const value = event.target.value;
    this.setState({ value });
  }

  handleAdd() {
    const { name, value } = this.state;
    this.props.onAdd(name, value);
  }
}
