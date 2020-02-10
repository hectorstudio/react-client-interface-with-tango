<<<<<<< HEAD
import React, { useRef, useEffect } from "react";
=======
import React, { Component } from "react";
>>>>>>> origin/master
import ReactDOM from "react-dom";
import { Modal as BootstrapModal } from "react-bootstrap";

import "./Modal.css";

const modalRoot = document.getElementById("modal");

<<<<<<< HEAD
function ModalPortal({ children }) {
  const hostRef = useRef(document.createElement("div"));

  useEffect(() => {
    const element = hostRef.current;
    modalRoot.appendChild(element);
    return () => {
      modalRoot.removeChild(element);
    };
  }, []);

  return ReactDOM.createPortal(children, hostRef.current);
}

export default function Modal({ title, children }) {
  return (
    <ModalPortal>
      <BootstrapModal.Dialog style={{ zIndex: 100000 }}>
        {title && (
          <BootstrapModal.Header>
            <BootstrapModal.Title>{title}</BootstrapModal.Title>
          </BootstrapModal.Header>
        )}
        {children}
      </BootstrapModal.Dialog>
    </ModalPortal>
  );
=======
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
        <BootstrapModal.Dialog style={{zIndex: 100000}}>
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
>>>>>>> origin/master
}

Modal.Body = BootstrapModal.Body;
Modal.Footer = BootstrapModal.Footer;
