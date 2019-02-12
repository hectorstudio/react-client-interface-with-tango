import React from "react";

export default function WarningBadge({ visible }) {
  return (
    <div
      className="WarningBadge"
      style={{
        position: "absolute",
        marginLeft: "-10px",
        marginTop: "-10px",
        backgroundColor: "red",
        borderRadius: "10px",
        width: "20px",
        height: "20px",
        color: "white",
        textAlign: "center",
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        pointerEvents: "none"
      }}
    >
      <span className="fa fa-exclamation" />
    </div>
  );
}
