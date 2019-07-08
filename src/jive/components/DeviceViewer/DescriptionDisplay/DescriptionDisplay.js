import React, { useState } from "react";
import cx from "classnames";
import Tooltip from "react-tooltip-lite";

import Modal from "../../../../shared/modal/components/Modal/Modal";

import "./DescriptionDisplay.css";

function DescriptionDisplay({ name, description }) {
  const [onDisplay, setOnDisplay] = useState(false);

  return (
    <>
      {onDisplay && (
        <Modal title={name}>
          <Modal.Body>
            <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOnDisplay(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
      <Tooltip
        content={description}
        useDefaultStyles={true}
        hoverDelay={0}
        direction="left"
      >
        <i
          className={cx("DescriptionDisplay fa fa-info-circle", {
            "no-description": description === "No description"
          })}
          onClick={() => setOnDisplay(true)}
        />
      </Tooltip>
    </>
  );
}

export default DescriptionDisplay;
