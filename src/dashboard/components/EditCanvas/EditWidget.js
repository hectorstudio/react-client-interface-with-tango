import React, { Component } from "react";
import { DragSource } from "react-dnd";

import WarningBadge from "./WarningBadge";

class ResizeKnob extends Component {
  render() {
    const { position } = this.props; // nw, ne, sw, se
    const cursorPrefix = position === "nw" || position === "se" ? "nwse" : "nesw";

    const isLeft = position === "nw" || position === "sw";
    const isTop = position === "nw" || position === "ne";

    const horizontalStyle = isLeft ? { left: 0 } : { right: 0 };
    const verticalStyle = isTop ? { top: 0 } : { bottom : 0 };
    const locationStyle = { ...horizontalStyle, ...verticalStyle };

    return (
      <div
        style={{
          position: "absolute",
          ...locationStyle,
          zIndex: 1,
          backgroundColor: "magenta",
          cursor: `${cursorPrefix}-resize`,
          width: "10px",
          height: "10px"
        }}
      />
    );
  }
}

const editWidgetSource = {
  beginDrag(props) {
    return {
      index: props.index,
      warning: props.warning
    };
  },

  endDrag(props, monitor) {
    const { dx, dy } = monitor.getDropResult();
    props.onMove(dx, dy);
  }
};

function editWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class EditWidget extends Component {
  render() {
    if (this.props.isDragging) {
      return null;
    }

    const { width, height } = this.props;

    return this.props.connectDragSource(
      <div
        className={this.props.isSelected ? "Widget selected" : "Widget"}
        style={{
          left: this.props.x,
          top: this.props.y,
          width,
          height,
          overflow: "hidden"
        }}
        onClick={event => {
          event.stopPropagation();
          this.props.onClick();
        }}
      >
        <ResizeKnob position="nw"/>
        <ResizeKnob position="ne"/>
        <ResizeKnob position="sw"/>
        <ResizeKnob position="se"/>
        {this.props.warning && <WarningBadge />}
        {this.props.children}
      </div>
    );
  }
}

export default DragSource("EDIT_WIDGET", editWidgetSource, editWidgetCollect)(
  EditWidget
);
