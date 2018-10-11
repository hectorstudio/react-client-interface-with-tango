import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";

import { DashboardDNDTypes, getWidgetDefinition } from "../widgetDefinitions";
import dndTypes from "../dndTypes";

const BACKSPACE = 8;
const DELETE = 46;

class EditWidget extends Component {
  render() {
    if (this.props.isDragging){
      return null;
    }
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div
        className={this.props.isSelected ? "Widget selected" : "Widget"}
        style={{ left: this.props.x, top: this.props.y }}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

const editWidgetSource = {
  beginDrag(props) {
    return {
      index: props.index
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
    const { index } = monitor.getItem();
    props.onMoveWidget(index, x, y);
  }
};

class EditCanvas extends Component {
  constructor(props) {
    super(props);
  }

  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  handleSelectWidget(i, event) {
    event.stopPropagation();
    if (this.props.onSelectWidget) {
      this.props.onSelectWidget(i);
    }
  }

  handleKeyDown(event) {
    if ([BACKSPACE, DELETE].indexOf(event.keyCode) !== -1) {
      this.props.onDeleteWidget(this.props.selectedWidgetIndex);
    }
  }

  onMoveWidget(index, x, y) {
    this.props.onMoveWidget(index, x, y);
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;
    const hasWidgets = this.props.widgets.length > 0;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={this.handleSelectWidget.bind(this, -1)}
          onKeyDown={this.handleKeyDown.bind(this)}
          tabIndex="0"
        >
          <div className="Placeholder" style={{opacity: hasWidgets ? 0 : 1}}>
            Add widgets by dragging them from the library and dropping them on
            the canvas.
          </div>

          {this.props.widgets.map((widget, i) => {
            const Widget = this.componentForWidget(widget);
            const { x, y, device, attribute, params } = widget;

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={this.props.selectedWidgetIndex === i}
                x={x}
                y={y}
                onClick={this.handleSelectWidget.bind(this, i)}
              >
                <Widget
                  device={device}
                  attribute={attribute}
                  params={params}
                  editMode={true}
                />
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

export default [moveDropTarget, addFromLibraryDropTarget].reduce(
  (cls, decorator) => decorator(cls),
  EditCanvas
);
