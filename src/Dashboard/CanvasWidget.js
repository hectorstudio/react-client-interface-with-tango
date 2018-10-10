import React, { Component } from "react";

function canvasWidgetComponent(canvas) {
  return class CanvasWidget extends Component {
    render() {
      if (this.props.mode === "library") {
        return <b>{canvas.name}</b>;
      }
    }
  };
}

export function canvasWidgetDefinition(canvas) {
  const { id, name } = canvas;
  return {
    type: `CANVAS_${id}`,
    name,
    component: canvasWidgetComponent(canvas),
    fields: ["device"],
    params: []
  };
}
