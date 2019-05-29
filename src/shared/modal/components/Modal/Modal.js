import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Modal as BootstrapModal } from "react-bootstrap";

import "./Modal.css";

const modalRoot = document.getElementById("modal");

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
}

Modal.Body = BootstrapModal.Body;
Modal.Footer = BootstrapModal.Footer;
