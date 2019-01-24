import React, { Component } from "react";
import { DragSource } from "react-dnd";

import WarningBadge from "./WarningBadge";

/* Resizing was difficult/impractical to implement with React features and react-dnd, so
   an approach using vanilla JavaScript event listeners was used instead. Subject to change
   at a later stage if a better solution is found. */

class ResizeKnob extends Component {
  render() {
    const { location } = this.props;
    const cursorPrefix =
      location === "nw" || location === "se" ? "nwse" : "nesw";

    const isLeft = location === "nw" || location === "sw";
    const isTop = location === "nw" || location === "ne";

    const horizontalStyle = isLeft ? { left: 0 } : { right: 0 };
    const verticalStyle = isTop ? { top: 0 } : { bottom: 0 };
    const locationStyle = { ...horizontalStyle, ...verticalStyle };

    return (
      <div
        onMouseDown={e =>
          this.props.onMouseDown(location, e.screenX, e.screenY)
        }
        style={{
          position: "absolute",
          ...locationStyle,
          zIndex: 1,
          cursor: `${cursorPrefix}-resize`,
          width: "15px",
          height: "15px"
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
  constructor(props) {
    super(props);
    this.state = {
      resizingLocation: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseMove(event) {
    const { screenX: currentX, screenY: currentY } = event;
    this.setState({ currentX, currentY });
  }

  handleMouseUp() {
    const [diffX, diffY] = this.sizeDifference();
    const [moveX, moveY] = this.positionAdjustedForOngoingResize();
    const { x, y } = this.props;
    this.props.onResize(moveX - x, moveY - y, diffX, diffY);

    this.setState({ resizingLocation: null });
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleBeginResize(knobLocation, startX, startY) {
    const [currentX, currentY] = [startX, startY];
    this.setState({
      resizingLocation: knobLocation,
      startX,
      startY,
      currentX,
      currentY
    });
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  sizeDifference() {
    const { resizingLocation } = this.state;
    if (resizingLocation == null) {
      return [0, 0];
    }

    const [vertical, horizontal] = resizingLocation;
    const factorX = horizontal === "w" ? -1 : 1;
    const factorY = vertical === "n" ? -1 : 1;

    const { currentX, currentY, startX, startY } = this.state;
    const diffX = factorX * (currentX - startX);
    const diffY = factorY * (currentY - startY);
    
    return [diffX, diffY];
  }

  positionAdjustedForOngoingResize() {
    const { x, y } = this.props;
    const { resizingLocation } = this.state;

    if (resizingLocation == null) {
      return [x, y];
    }

    const [diffX, diffY] = this.sizeDifference();
    const [vertical, horizontal] = resizingLocation;
    const adjustX = horizontal === "w" ? -diffX : 0;
    const adjustY = vertical === "n" ? -diffY : 0;
    return [x + adjustX, y + adjustY];
  }

  render() {
    if (this.props.isDragging) {
      return null;
    }

    const { width, height, connectDragSource } = this.props;

    const knobs = ["nw", "ne", "sw", "se"].map(knobLocation => (
      <ResizeKnob
        key={knobLocation}
        location={knobLocation}
        onMouseDown={(knobLocation, x, y) =>
          this.handleBeginResize(knobLocation, x, y)
        }
      />
    ));

    const [x, y] = this.positionAdjustedForOngoingResize();
    const [diffX, diffY] = this.sizeDifference();

    return (
      <div
        className={this.props.isSelected ? "Widget selected" : "Widget"}
        style={{
          left: x,
          top: y,
          width: width + diffX,
          height: height + diffY,
          overflow: "hidden"
        }}
        onClick={event => {
          event.stopPropagation();
          this.props.onClick();
        }}
      >
        {knobs}
        {this.props.warning && <WarningBadge />}
        {connectDragSource(<div>{this.props.children}</div>)}
      </div>
    );
  }
}

export default DragSource("EDIT_WIDGET", editWidgetSource, editWidgetCollect)(
  EditWidget
);
