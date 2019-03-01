import React, { Component } from "react";
import Modal from "../../../../shared/modal/components/Modal/Modal";

export default class AddPropertyModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", value: "", valid: false };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  render() {
    return (
      <Modal title={"Add Property"}>
        <form>
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
                ref={ref => this.nameInput = ref}
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
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => this.props.onClose()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.handleAdd}
              disabled={!this.state.valid}
            >
              Add
            </button>
          </Modal.Footer>
        </form>
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

  handleAdd(event) {
    event.preventDefault();
    const { name, value } = this.state;
    this.props.onAdd(name, value);
  }
}
