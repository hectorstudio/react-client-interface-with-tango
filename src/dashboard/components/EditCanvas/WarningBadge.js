import React from "react";

export default function WarningBadge() {
  return (
    <div
      style={{
        position: "fixed",
        marginLeft: "-10px",
        marginTop: "-10px",
        backgroundColor: "red",
        borderRadius: "10px",
        width: "20px",
        height: "20px",
        color: "white",
        textAlign: "center",
        zIndex: 1000
      }}
    >
      <span className="fa fa-exclamation" />
    </div>
  );
}
