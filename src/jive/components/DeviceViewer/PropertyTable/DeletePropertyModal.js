import React from "react";
import { Button } from "react-bootstrap";

import Modal from "../../../../shared/modal/components/Modal/Modal";

const DeletePropertyModal = ({ name, onDelete, onClose }) => (
  <Modal>
    <Modal.Body>
      <p>
        Are you sure you want to delete property{" "}
        <span style={{ fontWeight: "bold" }}>{name}</span>?
      </p>
    </Modal.Body>

    <Modal.Footer>
      <Button className="btn btn-outline-secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button className="btn btn-primary" onClick={() => onDelete(name)}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeletePropertyModal;
