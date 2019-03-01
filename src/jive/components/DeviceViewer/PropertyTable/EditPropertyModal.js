import React, { Component } from "react";

import Modal from "../../../../shared/modal/components/Modal/Modal";

export default class EditPropertyModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { value: this.props.initialValue };
  }

  componentDidMount() {
    this.valueInput.focus();
  }

  render() {
    const { name, onClose } = this.props;
    return (
      <Modal title={"Edit Property"}>
        <form>
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
                ref={ref => this.valueInput = ref}
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
              onClick={this.handleSubmit}
            >
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onEdit(this.props.name, this.state.value);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
}
