import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import dndTypes from "../../dndTypes";
import { getWidgetDefinition } from "../../utilsOld";
import { widget, widgetDefinition } from "../../propTypes";
import widgetBundles from "../../newWidgets";

import EditWidget from "./EditWidget";

const BACKSPACE = 8;
const DELETE = 46;

const editCanvasTarget = {
  canDrop(props, monitor) {
    return true;
  },

  drop(props, monitor, component) {
    const { x, y } = monitor.getDifferenceFromInitialOffset();
    const { index, warning } = monitor.getItem();

    // This is a fairly ugly hack to compensate for the fact that
    // a warning badge offsets the position by -10 px hor/ver

    const compensation = warning ? 10 : 0;
    return { dx: x + compensation, dy: y + compensation };
  }
};

class EditCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseIsDown: false
    };
  }

  bundleForWidget(widget) {
    return widgetBundles.find(bundle => bundle.definition.type === widget.type);
  }

  componentForWidget(widget) {
    return this.definitionForWidget(widget).component;
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;
    const hasWidgets = this.props.widgetsNew.length > 0;

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

          {this.props.widgetsNew.map((widget, index) => {
            const { x, y } = widget;
            const { component } = this.bundleForWidget(widget);
            const { inputs } = widget;
            const element = React.createElement(component, { inputs, mode: "edit" });
            const warning = true; // TODO: Is any required field missing?

            return (
              <EditWidget
                index={index}
                key={index}
                isSelected={index === this.props.selectedIndex}
                x={x}
                y={y}
                onDelete={() => this.props.onDeleteWidget(index)}
                onClick={() => this.props.onSelectWidget(index)}
                onMove={(dx, dy) => this.props.onMoveWidget(index, dx, dy)}
                warning={warning}
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
      props.onAddWidget(monitor.getItem().definition, x2 - x1, y2 - y1);
    }
  },
  (connect, monitor) => ({
    connectLibraryDropTarget: connect.dropTarget()
  })
);

function mapStateToProps(state) {
  return {
    widgetsNew: state.widgets.widgets,
    selectedIndex: state.widgets.selectedIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onMoveWidget: (index, dx, dy) => dispatch({ type: "MOVE_WIDGET", index, dx, dy }),
    onSelectWidget: index => dispatch({ type: "SELECT_WIDGET", index }),
    onDeleteWidget: () => dispatch({ type: "DELETE_WIDGET" })
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
