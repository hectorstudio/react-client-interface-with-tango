import React, { Component } from "react";
import {
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";

import { WidgetBundle } from "../../types";
import dndTypes from "../../dndTypes";
import { defaultInputs } from "../../utils";

interface Props {
  bundle: WidgetBundle;
  connectDragSource: ConnectDragSource;
}

const libraryWidgetSource = {
  beginDrag(props, monitor) {
    const c1 = monitor.getInitialSourceClientOffset();
    const c2 = monitor.getInitialClientOffset();
    const dragOffset = {
      x: c2.x - c1.x,
      y: c2.y - c1.y
    };

    return {
      type: props.bundle.definition.type,
      dragOffset
    };
  }
};

function libraryWidgetCollect(
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class LibraryWidget extends Component<Props> {
  private ref: HTMLDivElement;

  public constructor(props: Props) {
    super(props);
    this.state = { hasWidth: false };
  }

  public render() {
    const { definition, component } = this.props.bundle;
    const inputs = defaultInputs(definition.inputs);

    const actualSize = this.ref
      ? {
          actualWidth: this.ref.clientWidth
        }
      : {};

    // What's the correct way to perform the cast?
    // See e.g. https://github.com/Microsoft/TypeScript/issues/15019
    const widget = React.createElement(component as any, {
      mode: "library",
      inputs,
      ...actualSize
    });

    return (
      <div
        ref={ref => {
          if (ref != null && ref !== this.ref) {
            this.ref = ref;
            this.setState({ hasWidth: true });
          }
        }}
        className="LibraryWidget"
        style={{
          border: "1px solid #eee",
          borderRadius: "0.5em",
          boxShadow: "0 0 0.5em rgba(0, 0, 0, 0.05)"
        }}
      >
        <span
          style={{
            borderRadius: "0.5em 0 0.5em 0",
            padding: "0.25em",
            backgroundColor: "#eee"
          }}
        >
          {definition.name}
        </span>
        {this.props.connectDragSource(
          <div className="Widget" style={{ cursor: "grab" }}>
            <div style={{ pointerEvents: "none" }}>{widget}</div>
          </div>
        )}
      </div>
    );
  }
}

export default DragSource(
  dndTypes.LIBRARY_WIDGET,
  libraryWidgetSource,
  libraryWidgetCollect
)(LibraryWidget);
