import React, { Component } from "react";
import { DragSource } from "react-dnd";

import WarningBadge from "./WarningBadge";

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
        style={{ left: this.props.x, top: this.props.y, width, height }}
        onClick={event => {
          event.stopPropagation();
          this.props.onClick();
        }}
      >
        {this.props.warning && <WarningBadge />}
        {this.props.children}
      </div>
    );
  }
}

export default DragSource("EDIT_WIDGET", editWidgetSource, editWidgetCollect)(
  EditWidget
);
