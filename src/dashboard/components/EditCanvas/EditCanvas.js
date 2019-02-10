import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DropTarget } from "react-dnd";
import { connect } from "react-redux";
import cx from "classnames";

import dndTypes from "../../dndTypes";
import { componentForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import EditWidget from "./EditWidget";
import {
  moveWidget,
  selectWidget,
  addWidget,
  resizeWidget,
  deleteWidget
} from "src/dashboard/state/actionCreators";

import {
  getSelectedWidget,
  getCurrentCanvasWidgets
} from "src/dashboard/state/selectors";

const BACKSPACE = 8;
const DELETE = 46;

const editCanvasTarget = {
  canDrop(props, monitor) {
    return true;
  },

  drop(props, monitor, component) {
    const { x, y } = monitor.getDifferenceFromInitialOffset();
    // const { id, warning } = monitor.getItem();
    return { dx: x, dy: y };
  }
};

const SelectionBox = ({ start, current }) => {
  const [startX, startY] = start;
  const [currentX, currentY] = current;

  const width = currentX - startX;
  const height = currentY - startY;

  return (
    <div
      style={{
        position: "absolute",
        left: startX + (width < 0 ? width : 0),
        top: startY + (height < 0 ? height : 0),
        width: Math.abs(width),
        height: Math.abs(height),
        border: "2px dashed rgba(0,0,0,0.25)",
        zIndex: 1000
      }}
    />
  );
};

class EditCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseIsDown: false,
      selectionStartLocation: null,
      selectionCurrentLocation: null
    };

    this.canvasRef = null;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentForWidget(widget) {
    return this.definitionForWidget(widget).component;
  }

  handleMouseDown(event) {
    const { left, top } = this.canvasRef.getBoundingClientRect();
    const selectionStartLocation = [event.clientX - left, event.clientY - top];
    this.setState({
      selectionStartLocation,
      selectionCurrentLocation: selectionStartLocation
    });

    document.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(event) {
    const { left, top } = this.canvasRef.getBoundingClientRect();
    const selectionCurrentLocation = [
      event.clientX - left,
      event.clientY - top
    ];
    this.setState({ selectionCurrentLocation });
  }

  handleMouseUp() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.props.onSelectWidget(null);
    this.setState({
      selectionStartLocation: null,
      selectionCurrentLocation: null
    });
  }

  render() {
    const {
      connectMoveDropTarget,
      connectLibraryDropTarget,
      selectedWidget
    } = this.props;
    const hasWidgets = this.props.widgets.length > 0;

    const isSelecting = this.state.selectionStartLocation != null;
    const selectionBox = !isSelecting ? null : (
      <SelectionBox
        start={this.state.selectionStartLocation}
        current={this.state.selectionCurrentLocation}
      />
    );

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          ref={ref => (this.canvasRef = ref)}
          className={cx("Canvas", "edit", { isSelecting })}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onKeyDown={event => {
            if ([BACKSPACE, DELETE].indexOf(event.keyCode) !== -1) {
              event.preventDefault();
              this.props.onDeleteWidget();
            }
          }}
          tabIndex="0"
        >
          {selectionBox}

          <div className="Placeholder" style={{ opacity: hasWidgets ? 0 : 1 }}>
            Add widgets by dragging them from the library and dropping them on
            the canvas.
          </div>

          <div className="grid">
            {this.props.widgets.map(widget => {
              const { x, y, id, width, height, inputs, valid } = widget;
              const actualWidth = TILE_SIZE * width;
              const actualHeight = TILE_SIZE * height;
              const props = { inputs, mode: "edit", actualWidth, actualHeight };

              const component = componentForWidget(widget);
              const element = React.createElement(component, props);

              return (
                <EditWidget
                  id={id}
                  key={id}
                  isSelected={
                    selectedWidget != null && id === selectedWidget.id
                  }
                  x={1 + TILE_SIZE * x}
                  y={1 + TILE_SIZE * y}
                  width={actualWidth}
                  height={actualHeight}
                  onDelete={() => this.props.onDeleteWidget(id)}
                  onClick={() => this.props.onSelectWidget(id)}
                  onMove={(dx, dy) => this.props.onMoveWidget(id, dx, dy)}
                  onResize={(moveX, moveY, dx, dy) =>
                    this.props.onResizeWidget(id, moveX, moveY, dx, dy)
                  }
                  warning={!valid}
                  render={element}
                />
              );
            })}
          </div>
        </div>
      )
    );
  }
}

const moveDropTarget = DropTarget(
  dndTypes.EDIT_WIDGET,
  editCanvasTarget,
  (connect, monitor) => ({
    connectMoveDropTarget: connect.dropTarget()
  })
);

const addFromLibraryDropTarget = DropTarget(
  dndTypes.LIBRARY_WIDGET,
  {
    canDrop(props, monitor) {
      return true;
    },
    drop(props, monitor, component) {
      const { x: x1, y: y1 } = findDOMNode(component).getBoundingClientRect();
      const { x: x2, y: y2 } = monitor.getClientOffset();
      const { type, dragOffset } = monitor.getItem();
      props.onAddWidget(type, x2 - x1 - dragOffset.x, y2 - y1 - dragOffset.y);
    }
  },
  (connect, monitor) => ({
    connectLibraryDropTarget: connect.dropTarget()
  })
);

function mapStateToProps(state) {
  return {
    widgets: getCurrentCanvasWidgets(state),
    selectedWidget: getSelectedWidget(state)
  };
}

function toTile(value) {
  return Math.floor(0.5 + value / TILE_SIZE);
}

function mapDispatchToProps(dispatch) {
  return {
    onMoveWidget: (id, dx, dy) => {
      dispatch(moveWidget(id, toTile(dx), toTile(dy)));
    },
    onSelectWidget: id => dispatch(selectWidget(id)),
    onDeleteWidget: id => dispatch(deleteWidget(id)),
    onAddWidget: (type, x, y) => {
      dispatch(addWidget(toTile(x), toTile(y), type, "0"));
    },
    onResizeWidget: (id, mx, my, dx, dy) => {
      dispatch(
        resizeWidget(id, toTile(mx), toTile(my), toTile(dx), toTile(dy))
      );
    }
  };
}

const connectWithState = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default [
  moveDropTarget,
  addFromLibraryDropTarget,
  connectWithState
].reduce((cls, decorator) => decorator(cls), EditCanvas);
