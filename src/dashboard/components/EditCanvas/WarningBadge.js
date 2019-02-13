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
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        pointerEvents: "none"
      }}
    >
      <span className="fa fa-exclamation" />
    </div>
  );
}
