import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import dndTypes from "../../dndTypes";
import { getWidgetDefinition } from "../../utilsOld";
import { widget, widgetDefinition } from "../../propTypes";
import WarningBadge from "./WarningBadge";

import widgetBundles from "../../newWidgets";

const BACKSPACE = 8;
const DELETE = 46;

class EditWidget extends Component {
  render() {
    if (this.props.isDragging) {
      return null;
    }
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div
        className={this.props.isSelected ? "Widget selected" : "Widget"}
        style={{ left: this.props.x, top: this.props.y }}
        onClick={this.props.onClick}
      >
        {this.props.warning && <WarningBadge />}
        {this.props.children}
      </div>
    );
  }
}
EditWidget.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  isDragging: PropTypes.bool,
  onClick: PropTypes.func,
  warning: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number
};

const editWidgetSource = {
  beginDrag(props) {
    return {
      index: props.index,
      warning: props.warning
    };
  }
};

function editWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

EditWidget = DragSource("EDIT_WIDGET", editWidgetSource, editWidgetCollect)(
  EditWidget
);

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
    props.onMoveWidget(index, x + compensation, y + compensation);
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

  handleSelectWidget(i, event) {
    event.stopPropagation();
    if (this.props.onSelectWidget) {
      this.props.onSelectWidget(i);
    }
  }

  handleKeyDown(event) {
    if ([BACKSPACE, DELETE].indexOf(event.keyCode) !== -1) {
      event.preventDefault();
      this.props.onDeleteWidget(this.props.selectedWidgetIndex);
    }
  }

  onMoveWidget(index, x, y) {
    this.props.onMoveWidget(index, x, y);
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;
    const hasWidgets = this.props.widgetsNew.length > 0;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={this.handleSelectWidget.bind(this, -1)}
          onKeyDown={this.handleKeyDown.bind(this)}
          tabIndex="0"
        >
          <div className="Placeholder" style={{ opacity: hasWidgets ? 0 : 1 }}>
            Add widgets by dragging them from the library and dropping them on
            the canvas.
          </div>

          {this.props.widgetsNew.map((widget, i) => {
            /*const Widget = this.componentForWidget(widget);
            const { x, y, device, attribute, params } = widget;

            const definition = this.definitionForWidget(widget);
            const fieldTypes = definition.fields.map(field => field.type);
            const warning =
              (device == null && fieldTypes.indexOf("device") !== -1) ||
              (attribute == null && fieldTypes.indexOf("attribute") !== -1);

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={this.props.selectedWidgetIndex === i}
                x={x}
                y={y}
                onClick={this.handleSelectWidget.bind(this, i)}
                warning={warning}
              >
                <Widget
                  device={device}
                  attribute={attribute}
                  params={params}
                  mode="edit"
                />
              </EditWidget>
            );
            */

            const { x, y } = widget;
            const { component } = this.bundleForWidget(widget);
            const { inputs } = widget;
            const element = React.createElement(component, { inputs });
            const warning = true; // Is any required field missing?

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={false}
                x={x}
                y={y}
                onClick={() => null}
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
EditCanvas.propTypes = {
  connectLibraryDropTarget: PropTypes.func,
  connectMoveDropTarget: PropTypes.func,
  onAddWidget: PropTypes.func,
  onDeleteWidget: PropTypes.func,
  onMoveWidget: PropTypes.func,
  onSelectWidget: PropTypes.func,
  selectedWidgetIndex: PropTypes.number,
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition),
  widgets: PropTypes.arrayOf(widget)
};

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
    widgetsNew: state.widgets
  };
}

const connectWithState = connect(mapStateToProps);

export default [
  moveDropTarget,
  addFromLibraryDropTarget,
  connectWithState
].reduce((cls, decorator) => decorator(cls), EditCanvas);
