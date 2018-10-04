import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";

import { DashboardDNDTypes, getWidgetDefinition } from "../widgetDefinitions";
import dndTypes from '../dndTypes';

class EditWidget extends Component {
  render() {
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

  placeholderValueForWidget(widget) {
    return getWidgetDefinition(widget.type).libraryProps.value;
  }

  handleSelectWidget(i, event) {
    event.stopPropagation();
    if (this.props.onSelectWidget) {
      this.props.onSelectWidget(i);
    }
  }

  onMoveWidget(index, x, y) {
    this.props.onMoveWidget(index, x, y);
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={this.handleSelectWidget.bind(this, -1)}
        >
          {this.props.widgets.map((widget, i) => {
            const Widget = this.componentForWidget(widget);
            const { x, y, device, attribute, params } = widget;
            const value = this.placeholderValueForWidget(widget);

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={this.props.selectedWidgetIndex === i}
                x={x}
                y={y}
                onClick={this.handleSelectWidget.bind(this, i)}
              >
                <Widget value={value} attribute={attribute} params={params} editMode={true}/>
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
