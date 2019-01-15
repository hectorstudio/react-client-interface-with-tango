import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Modal as BootstrapModal } from "react-bootstrap";

import "./Modal.css";

const modalRoot = document.getElementById("modal");

class ModalPortal extends Component {
  constructor(props) {
    super(props);
    this.hostElement = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.hostElement);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.hostElement);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.hostElement);
  }
}

export default class Modal extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <ModalPortal>
        <BootstrapModal.Dialog>
          {title && (
            <BootstrapModal.Header>
              <BootstrapModal.Title>{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
          )}
          {children}
        </BootstrapModal.Dialog>
      </ModalPortal>
    );
  }
}

Modal.Body = BootstrapModal.Body;
Modal.Footer = BootstrapModal.Footer;
