import React, { Component } from "react";
import { DragSource } from "react-dnd";

import dndTypes from "../dndTypes";

class LibraryWidget extends Component {
  render() {
    const definition = this.props.definition;
    const Widget = definition.component;

    return (
      <div className="LibraryWidget">
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
          {definition.name}
        </span>
        {this.props.connectDragSource(
          <div>
            <Widget params={{}} libraryMode={true}/>
          </div>
        )}
      </div>
    );
  }
}

const libraryWidgetSource = {
  beginDrag(props) {
    return {
      definition: props.definition
    };
  }
};

function libraryWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

LibraryWidget = DragSource(
  dndTypes.LIBRARY_WIDGET,
  libraryWidgetSource,
  libraryWidgetCollect
)(LibraryWidget);

export default class Library extends Component {
  render() {
    return (
      <div className="Library">
        <h1>Widget Library</h1>
        {this.props.widgetDefinitions.map((definition, i) => {
          return <LibraryWidget key={i} definition={definition} />;
        })}
      </div>
    );
  }
}
