import React from "react";

export default function WarningBadge({ visible }) {
  const radius = 10;
  return (
    <div
      className="WarningBadge"
      style={{
        position: "absolute",
        marginLeft: -radius,
        marginTop: -radius,
        backgroundColor: "red",
        borderRadius: radius,
        width: 2 * radius,
        height: 2 * radius,
        color: "white",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      <span className="fa fa-exclamation" />
    </div>
  );
}
