import React, {useState} from "react";
import { Button } from "react-bootstrap";

import Modal from "../../../shared/modal/components/Modal/Modal";

const ShareDashboardModal = ({ name, id, onShare, userGroups, current, onClose }) => {
    const [selectedGroup, setSelectedGroup] = useState(current);
  return (
    <Modal>
      <Modal.Body>
        <h3>Share dashboard</h3>
        <p>
          Share <span style={{ fontStyle: "italic" }}>{name}</span> with
        </p>
        <select
          className="form-control"
          onChange={e => setSelectedGroup(e.target.value)}
          defaultValue={selectedGroup}
        >
          <option value={""}>No one</option>
          {userGroups.map(group => {
            return (
              <option key={group} value={group}>
                {group}
              </option>
            );
          })}
        </select>
      </Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="btn btn-primary" onClick={() => onShare(id, selectedGroup)}>
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareDashboardModal;
