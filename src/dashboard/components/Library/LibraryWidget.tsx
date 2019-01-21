import React, { Component } from "react";
import {
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";

import {
  IWidgetBundle,
  IInputDefinitionMapping,
  IInputDefinition
} from "../types";
import dndTypes from "../../dndTypes";

interface IProps {
  bundle: IWidgetBundle;
  connectDragSource: ConnectDragSource;
}

function defaultInput(input: IInputDefinition) {
  if (input.type === "complex") {
    if (input.repeat) {
      return [];
    } else {
      return defaultInputs(input.inputs);
    }
  } else {
    return input.default;
  }
}

function defaultInputs(inputs: IInputDefinitionMapping) {
  const inputNames = Object.keys(inputs);
  return inputNames.reduce((accum, name) => {
    const input = inputs[name];
    const value = defaultInput(input);
    return { ...accum, [name]: value };
  }, {});
}

const libraryWidgetSource = {
  beginDrag(props) {
    return {
      definition: props.bundle.definition
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
  public render() {
    const { definition, component } = this.props.bundle;
    const inputs = defaultInputs(definition.inputs);
    // What's the correct way to perform the cast?
    // See e.g. https://github.com/Microsoft/TypeScript/issues/15019

    const widget = React.createElement(component as any, {
      mode: "library",
      inputs
    });

    return (
      <div className="LibraryWidget">
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
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
