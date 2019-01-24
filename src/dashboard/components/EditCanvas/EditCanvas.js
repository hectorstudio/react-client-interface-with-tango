import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import dndTypes from "../../dndTypes";
import { componentForWidget } from "../../newWidgets";
import { TILE_SIZE } from "../constants";

import EditWidget from "./EditWidget";
import {
  moveWidget,
  selectWidget,
  addWidget,
  resizeWidget
} from "src/dashboard/state/actionCreators";

const BACKSPACE = 8;
const DELETE = 46;

const editCanvasTarget = {
  canDrop(props, monitor) {
    return true;
  },

  drop(props, monitor, component) {
    const { x, y } = monitor.getDifferenceFromInitialOffset();
    // const { index, warning } = monitor.getItem();
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

          {this.props.widgets.map((widget, index) => {
            const { x, y, width, height, inputs, valid } = widget;
            const actualWidth = TILE_SIZE * width;
            const actualHeight = TILE_SIZE * height;
            const props = { inputs, mode: "edit", actualWidth, actualHeight };

            const component = componentForWidget(widget);
            const element = React.createElement(component, props);

            return (
              <EditWidget
                index={index}
                key={index}
                isSelected={index === this.props.selectedIndex}
                x={1 + TILE_SIZE * x}
                y={1 + TILE_SIZE * y}
                width={actualWidth}
                height={actualHeight}
                onDelete={() => this.props.onDeleteWidget(index)}
                onClick={() => this.props.onSelectWidget(index)}
                onMove={(dx, dy) => this.props.onMoveWidget(index, dx, dy)}
                onResize={(moveX, moveY, dx, dy) => this.props.onResizeWidget(index, moveX, moveY, dx, dy)}
                warning={!valid}
              >
                {element}
              </EditWidget>
            );
          })}
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
      props.onAddWidget(monitor.getItem().type, x2 - x1, y2 - y1);
    }
  },
  (connect, monitor) => ({
    connectLibraryDropTarget: connect.dropTarget()
  })
);

function mapStateToProps(state) {
  return {
    widgets: state.widgets.widgets,
    selectedIndex: state.widgets.selectedIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onMoveWidget: (index, dx, dy) => {
      const adx = Math.floor(dx / TILE_SIZE);
      const ady = Math.floor(dy / TILE_SIZE);
      dispatch(moveWidget(index, adx, ady));
    },
    onSelectWidget: index => dispatch(selectWidget(index)),
    onDeleteWidget: index => dispatch({ type: "DELETE_WIDGET", index }),
    onAddWidget: (type, x, y) => {
      const ax = Math.floor(x / TILE_SIZE);
      const ay = Math.floor(y / TILE_SIZE);
      dispatch(addWidget(ax, ay, type, 0))
    },
    onResizeWidget: (index, mx, my, dx, dy) => {
      const amx = Math.floor(mx / TILE_SIZE);
      const amy = Math.floor(my / TILE_SIZE);
      const adx = Math.floor(dx / TILE_SIZE);
      const ady = Math.floor(dy / TILE_SIZE);
      dispatch(resizeWidget(index, amx, amy, adx, ady));
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
