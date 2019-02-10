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
  moveWidget,
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
    const { selectionStartLocation, selectionCurrentLocation } = this.state;

    if (selectionStartLocation != null) {
      const [x1, y1] = selectionStartLocation;
      const [x2, y2] = selectionCurrentLocation;
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

    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({
      selectionStartLocation: null,
      selectionCurrentLocation: null
    });
  }

  isSelecting() {
    const {
      selectionStartLocation: start,
      selectionCurrentLocation: current
    } = this.state;

    if (start == null) {
      return false;
    } else {
      return start[0] !== current[0] || start[1] !== current[1];
    }
  }

  render() {
    const {
      connectMoveDropTarget,
      connectLibraryDropTarget,
      selectedWidgets
    } = this.props;
    const hasWidgets = this.props.widgets.length > 0;

    const isSelecting = this.isSelecting();
    const selectionBox = isSelecting && (
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
                  isSelected={selectedWidgets.indexOf(widget) !== -1}
                  x={1 + TILE_SIZE * x}
                  y={1 + TILE_SIZE * y}
                  width={actualWidth}
                  height={actualHeight}
                  onDelete={() => this.props.onDeleteWidget(id)}
                  onClick={() => this.props.onSelectWidgets([id])}
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
    selectedWidgets: getSelectedWidgets(state)
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

export default [
  moveDropTarget,
  addFromLibraryDropTarget,
  connectWithState
].reduce((cls, decorator) => decorator(cls), EditCanvas);
