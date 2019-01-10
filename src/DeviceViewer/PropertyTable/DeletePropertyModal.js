import React from "react";
import { Button } from "react-bootstrap";

import Modal from "../../Modal/Modal";

const DeletePropertyModal = ({ name, onDelete, onClose }) => (
  <Modal title={"Remove Property"}>
    <Modal.Body>
      <p>
        Are you sure you want to remove property{" "}
        <span style={{ fontWeight: "bold" }}>{name}</span>?
      </p>
    </Modal.Body>

    <Modal.Footer>
      <Button className="btn btn-outline-secondary" onClick={() => onDelete(name)}>
        Yes
      </Button>
      <Button className="btn btn-outline-secondary" onClick={onClose}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeletePropertyModal;
