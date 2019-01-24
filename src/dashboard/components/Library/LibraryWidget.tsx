import React, { Component } from "react";
import {
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";

import { IWidgetBundle } from "../../types";
import dndTypes from "../../dndTypes";
import { defaultInputs } from "../../utils";

interface IProps {
  bundle: IWidgetBundle;
  connectDragSource: ConnectDragSource;
}

const libraryWidgetSource = {
  beginDrag(props) {
    return {
      type: props.bundle.definition.type
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

class LibraryWidget extends Component<IProps> {
  private ref: HTMLDivElement;

  public constructor(props: IProps) {
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
      >
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>
          {definition.name}
        </span>
        {this.props.connectDragSource(<div>{widget}</div>)}
      </div>
    );
  }
}

export default DragSource(
  dndTypes.LIBRARY_WIDGET,
  libraryWidgetSource,
  libraryWidgetCollect
)(LibraryWidget);
