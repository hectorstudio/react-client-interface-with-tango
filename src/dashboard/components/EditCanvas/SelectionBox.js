import React from "react";

function cornersToBox(corner1, corner2) {
  const [startX, startY] = corner1;
  const [currentX, currentY] = corner2;
  const width = currentX - startX;
  const height = currentY - startY;

  return [
    startX + (width < 0 ? width : 0),
    startY + (height < 0 ? height : 0),
    Math.abs(width),
    Math.abs(height)
  ];
}

export default function SelectionBox({ start, current }) {
  const [left, top, width, height] = cornersToBox(start, current);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        border: "2px dashed rgba(0,0,0,0.25)",
        zIndex: 100000
      }}
    />
  );
}
