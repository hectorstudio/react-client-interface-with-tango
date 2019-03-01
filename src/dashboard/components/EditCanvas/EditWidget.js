import React, { Component } from "react";

import WarningBadge from "./WarningBadge";

/* Resizing was difficult/impractical to implement with React features and react-dnd, so
   an approach using vanilla JavaScript event listeners was used instead. Subject to change
   at a later stage if a better solution is found. */

class ResizeArea extends Component {
  render() {
    const { location } = this.props;
    const cursorPrefix =
      location === "nw" || location === "se"
        ? "nwse"
        : location === "ne" || location === "sw"
        ? "nesw"
        : location === "n" || location === "s"
        ? "ns"
        : "ew";

    const stuckToTop = !location.includes("s");
    const stuckToBottom = !location.includes("n");
    const stuckToLeft = !location.includes("e");
    const stuckToRight = !location.includes("w");

    const topStyle = stuckToTop ? { top: 0 } : {};
    const bottomStyle = stuckToBottom ? { bottom: 0 } : {};
    const verticalStyle = { ...topStyle, ...bottomStyle };

    const leftStyle = stuckToLeft ? { left: 0 } : {};
    const rightStyle = stuckToRight ? { right: 0 } : {};
    const horizontalStyle = { ...leftStyle, ...rightStyle };

    const size = 16;

    const isVerticalEdge = location === "n" || location === "s";
    const isHorizontalEdge = location === "e" || location === "w";

    const horizontalFactor = isVerticalEdge ? 1 : -1;
    const verticalFactor = isHorizontalEdge ? 1 : -1;
    const horizontalMargin = (horizontalFactor * size) / 2;
    const verticalMargin = (verticalFactor * size) / 2;

    const locationStyle = {
      ...horizontalStyle,
      ...verticalStyle,
      marginTop: verticalMargin,
      marginBottom: verticalMargin,
      marginLeft: horizontalMargin,
      marginRight: horizontalMargin
    };

    const width = isVerticalEdge ? "auto" : size;
    const height = isHorizontalEdge ? "auto" : size;

    return (
      <div
        className="ResizeArea"
        onDrag={
          () => false /* Necessary to prevent default behaviour of dragging */
        }
        onMouseDown={event => {
          event.stopPropagation();
          this.props.onBeginResize(location, event.screenX, event.screenY);
        }}
        style={{
          position: "absolute",
          ...locationStyle,
          zIndex: 1,
          cursor: `${cursorPrefix}-resize`,
          width,
          height
        }}
      />
    );
  }
}

export default class EditWidget extends Component {
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
    const [adjustX, adjustY] = this.positionAdjustmentForOngoingResize();
    this.props.onResize(adjustX, adjustY, diffX, diffY);

    this.setState({ resizingLocation: null });
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleBeginResize(areaLocation, startX, startY) {
    const [currentX, currentY] = [startX, startY];
    this.setState({
      resizingLocation: areaLocation,
      startX,
      startY,
      currentX,
      currentY
    });
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  sizeFactors() {
    const { resizingLocation } = this.state;

    if (resizingLocation == null) {
      return [0, 0];
    } else if (resizingLocation.length === 2) {
      const [vertical, horizontal] = resizingLocation;
      const factorX = horizontal === "w" ? -1 : 1;
      const factorY = vertical === "n" ? -1 : 1;
      return [factorX, factorY];
    } else {
      return resizingLocation === "e"
        ? [1, 0]
        : resizingLocation === "w"
        ? [-1, 0]
        : resizingLocation === "s"
        ? [0, 1]
        : [0, -1];
    }
  }

  sizeDifference() {
    const [factorX, factorY] = this.sizeFactors();
    const { currentX, currentY, startX, startY } = this.state;
    const diffX = factorX * (currentX - startX);
    const diffY = factorY * (currentY - startY);
    return [diffX, diffY];
  }

  positionAdjustmentForOngoingResize() {
    const { resizingLocation } = this.state;

    if (resizingLocation == null) {
      return [0, 0];
    }

    const [diffX, diffY] = this.sizeDifference();

    if (resizingLocation.length === 2) {
      const [vertical, horizontal] = resizingLocation;
      const adjustX = horizontal === "w" ? -diffX : 0;
      const adjustY = vertical === "n" ? -diffY : 0;
      return [adjustX, adjustY];
    } else {
      const adjustX = resizingLocation === "w" ? -diffX : 0;
      const adjustY = resizingLocation === "n" ? -diffY : 0;
      return [adjustX, adjustY];
    }
  }

  render() {
    if (this.props.isDragging) {
      return null;
    }

    const { width, height, canResize } = this.props;

    const resizeAreas =
      canResize === false
        ? []
        : ["nw", "ne", "sw", "se", "w", "e", "s", "n"].map(areaLocation => (
            <ResizeArea
              key={areaLocation}
              location={areaLocation}
              onBeginResize={(areaLocation, x, y) => {
                this.handleBeginResize(areaLocation, x, y);
              }}
            />
          ));

    const { x, y, isSelected } = this.props;
    const [adjustX, adjustY] = this.positionAdjustmentForOngoingResize();
    const [diffX, diffY] = this.sizeDifference();

    const actualWidth = width + diffX - 1;
    const actualHeight = height + diffY - 1;
    const render = React.cloneElement(this.props.render, {
      actualWidth,
      actualHeight
    });

    return (
      <div
        className={isSelected ? "Widget selected" : "Widget"}
        style={{
          left: x + adjustX,
          top: y + adjustY,
          width: actualWidth,
          height: actualHeight,
          outline: isSelected ? "2px solid lightskyblue" : "1px solid #ccc",
          zIndex: (isSelected ? 20000 : 10000) + y
        }}
        onMouseDown={event => {
          event.stopPropagation();
          this.props.onMouseDown(event);
        }}
        onMouseUp={event => void this.props.onMouseUp(event)}
      >
        {resizeAreas}
        <WarningBadge visible={this.props.warning} />
        <div
          style={{
            overflow: "hidden",
            height: "inherit",
            width: "inherit",
            backgroundColor: "white",
            pointerEvents: "none"
          }}
        >
          {render}
        </div>
      </div>
    );
  }
}
