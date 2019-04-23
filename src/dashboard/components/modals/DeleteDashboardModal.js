import React from "react";
import { Button } from "react-bootstrap";

import Modal from "../../../shared/modal/components/Modal/Modal";

const DeleteDashboardModal = ({ name, id, onDelete, onClose }) => (
  <Modal>
    <Modal.Body>
      <h3>Delete Dashboard</h3>
      <p>
        Are you sure you want to delete the dashboard {" "}
        <span style={{ fontWeight: "bold" }}>{name}</span>?
      </p>
    </Modal.Body>

    <Modal.Footer>
      <Button className="btn btn-outline-secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button className="btn btn-primary" onClick={() => onDelete(id)}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteDashboardModal;
