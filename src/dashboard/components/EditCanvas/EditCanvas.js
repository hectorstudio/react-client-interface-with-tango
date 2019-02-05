import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DropTarget } from "react-dnd";
import { connect } from "react-redux";

import dndTypes from "../../dndTypes";
import { componentForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import EditWidget from "./EditWidget";
import {
  moveWidget,
  selectWidget,
  addWidget,
  resizeWidget
} from "src/dashboard/state/actionCreators";
import { getWidgets } from "src/dashboard/state/selectors";

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
      mouseIsDown: false
    };
  }

  componentForWidget(widget) {
    return this.definitionForWidget(widget).component;
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;
    const hasWidgets = this.props.widgets.length > 0;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={() => this.props.onSelectWidget(-1)}
          onKeyDown={event => {
            if ([BACKSPACE, DELETE].indexOf(event.keyCode) !== -1) {
              event.preventDefault();
              this.props.onDeleteWidget();
            }
          }}
          tabIndex="0"
        >
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
                  isSelected={id === this.props.selectedId}
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
    widgets: getWidgets(state),
    selectedId: state.widgets.selectedId
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
    onDeleteWidget: id => dispatch({ type: "DELETE_WIDGET", id }),
    onAddWidget: (type, x, y) => {
      dispatch(addWidget(toTile(x), toTile(y), type, 0));
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
