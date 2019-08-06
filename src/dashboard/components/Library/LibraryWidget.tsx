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
import { enrichedInputs } from "../../runtime/enrichment";

function NameLabel({ name }: { name: string }) {
  return (
    <span
      style={{
        borderRadius: "0.45em 0 0.45em 0",
        padding: "0 0.25em",
        backgroundColor: "#eee",
        display: "inline-block"
      }}
    >
      {name}
    </span>
  );
}

interface Props {
  bundle: WidgetBundle<{}>;
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
  private ref?: HTMLDivElement;

  public constructor(props: Props) {
    super(props);
    this.state = { hasWidth: false };
  }

  public render() {
    const { definition, component } = this.props.bundle;

    // Q: should defaults be determined and injected using enrichment instead?
    const withDefaults = defaultInputs(definition.inputs);
    const inputs = enrichedInputs(withDefaults, definition.inputs);

    const actualSize = this.ref
      ? {
          actualWidth: this.ref.clientWidth
        }
      : {};

    const widget = React.createElement(component, {
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
        style={{ position: "relative" }}
      >
        <NameLabel name={definition.name} />

        {this.props.connectDragSource(
          <div className="Widget" style={{ cursor: "grab" }}>
            {widget}
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
