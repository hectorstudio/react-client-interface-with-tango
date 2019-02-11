import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DropTarget } from "react-dnd";
import { connect } from "react-redux";
import cx from "classnames";
import boxIntersect from "box-intersect";

import dndTypes from "../../dndTypes";
import { componentForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import SelectionBox from "./SelectionBox";
import EditWidget from "./EditWidget";

import {
  moveWidgets,
  addWidget,
  resizeWidget,
  deleteWidget,
  selectWidgets
} from "src/dashboard/state/actionCreators";

import {
  getSelectedWidgets,
  getCurrentCanvasWidgets
} from "src/dashboard/state/selectors";

const BACKSPACE = 8;
const DELETE = 46;

const MOVE = "MOVE";
const SELECT = "SELECT";

class EditCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseActionType: null,
      mouseActionStartLocation: null,
      mouseActionCurrentLocation: null
    };

    this.canvasRef = null;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentForWidget(widget) {
    return this.definitionForWidget(widget).component;
  }

  initiateMouseEvent(type, event) {
    const { left, top } = this.canvasRef.getBoundingClientRect();
    const mouseActionStartLocation = [
      event.clientX - left,
      event.clientY - top
    ];

    this.setState({
      mouseActionType: type,
      mouseActionStartLocation,
      mouseActionCurrentLocation: mouseActionStartLocation
    });

    document.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseDown(event) {
    if (event.button === 0) { // Left click
      this.initiateMouseEvent(SELECT, event);
    }
  }

  handleMouseMove(event) {
    const { left, top } = this.canvasRef.getBoundingClientRect();
    const mouseActionCurrentLocation = [
      event.clientX - left,
      event.clientY - top
    ];
    this.setState({ mouseActionCurrentLocation });
  }

  handleMouseUp(event) {
    const {
      mouseActionType,
      mouseActionStartLocation,
      mouseActionCurrentLocation
    } = this.state;

    if (mouseActionType === SELECT) {
      if (mouseActionStartLocation != null) {
        const [x1, y1] = mouseActionStartLocation;
        const [x2, y2] = mouseActionCurrentLocation;
        const smallX = x1 < x2 ? x1 : x2;
        const largeX = x1 > x2 ? x1 : x2;
        const smallY = y1 < y2 ? y1 : y2;
        const largeY = y1 > y2 ? y1 : y2;
        const selectionBox = [smallX, smallY, largeX, largeY];

        const widgetBoxes = this.props.widgets.map(widget => {
          const { x, y, width, height } = widget;
          return [x, y, x + width, y + height].map(val => val * TILE_SIZE);
        });

        const overlaps = boxIntersect([selectionBox], widgetBoxes);
        const selectedWidgetIds = overlaps
          .map(([i, j]) => j)
          .map(i => this.props.widgets[i])
          .map(({ id }) => id);
        this.props.onSelectWidgets(selectedWidgetIds);
      }
    } else if (mouseActionType === MOVE) {
      const [dx, dy] = this.moveDelta();
      if (dx !== 0 || dy !== 0) {
        const ids = this.props.selectedWidgets.map(({ id }) => id);
        this.props.onMoveWidgets(ids, dx, dy);
      }
    }

    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({
      mouseActionType: null,
      mouseActionStartLocation: null,
      mouseActionCurrentLocation: null
    });
  }

  isSelecting() {
    const {
      mouseActionType,
      mouseActionStartLocation: start,
      mouseActionCurrentLocation: current
    } = this.state;

    if (mouseActionType !== SELECT) {
      return false;
    }

    return start[0] !== current[0] || start[1] !== current[1];
  }

  moveDelta() {
    const {
      mouseActionStartLocation: start,
      mouseActionCurrentLocation: current,
      mouseActionType
    } = this.state;

    if (mouseActionType !== MOVE || start == null || current == null) {
      return [0, 0];
    }

    const [x1, y1] = start;
    const [x2, y2] = current;
    return [x2 - x1, y2 - y1];
  }

  render() {
    const { connectLibraryDropTarget, selectedWidgets } = this.props;
    const hasWidgets = this.props.widgets.length > 0;

    const isMoving = this.state.mouseActionType === MOVE;
    const isSelecting = this.isSelecting();
    const selectionBox = isSelecting && (
      <SelectionBox
        start={this.state.mouseActionStartLocation}
        current={this.state.mouseActionCurrentLocation}
      />
    );

    return connectLibraryDropTarget(
      <div
        ref={ref => (this.canvasRef = ref)}
        className={cx("Canvas", "edit", { isSelecting, isMoving })}
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
          Add widgets by dragging them from the library and dropping them on the
          canvas.
        </div>

        <div className="grid">
          {this.props.widgets.map(widget => {
            const { x, y, id, width, height, inputs, valid } = widget;
            const actualWidth = TILE_SIZE * width;
            const actualHeight = TILE_SIZE * height;
            const props = { inputs, mode: "edit", actualWidth, actualHeight };

            const isSelected = selectedWidgets.indexOf(widget) !== -1;
            const [moveX, moveY] = isSelected ? this.moveDelta() : [0, 0];

            const component = componentForWidget(widget);
            const element = React.createElement(component, props);

            return (
              <EditWidget
                id={id}
                key={id}
                isSelected={isSelected}
                x={1 + TILE_SIZE * x + moveX}
                y={1 + TILE_SIZE * y + moveY}
                width={actualWidth}
                height={actualHeight}
                onDelete={() => this.props.onDeleteWidget(id)}
                onMouseDown={event => {
                  if (!isSelected) {
                    this.props.onSelectWidgets([id]);
                  }
                  this.initiateMouseEvent(MOVE, event);
                }}
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
    );
  }
}

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
    selectedWidgets: getSelectedWidgets(state)
  };
}

function toTile(value) {
  return Math.floor(0.5 + value / TILE_SIZE);
}

function mapDispatchToProps(dispatch) {
  return {
    onMoveWidgets: (ids, dx, dy) => {
      dispatch(moveWidgets(ids, toTile(dx), toTile(dy)));
    },
    onSelectWidgets: ids => dispatch(selectWidgets(ids)),
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

export default [addFromLibraryDropTarget, connectWithState].reduce(
  (cls, decorator) => decorator(cls),
  EditCanvas
);
