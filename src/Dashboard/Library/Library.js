import React, { Component } from "react";
import { DragSource } from "react-dnd";

import dndTypes from "../dndTypes";
import PropTypes from 'prop-types'
import {libraryWidgetDefinition, widgetDefinition} from "../../propTypes/propTypes"

class LibraryWidget extends Component {
  render() {
    const definition = this.props.definition;
    const Widget = definition.component;
    const defaultParams = definition.params.reduce(
      (accum, param) => ({ ...accum, [param.name]: param.default }),
      {}
    );

    return (
      <div className="LibraryWidget">
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
          {definition.name}
        </span>
        {this.props.connectDragSource(
          <div>
            <Widget params={defaultParams} mode="library" />
          </div>
        )}
      </div>
    );
  }
}

LibraryWidget.propTypes = {
  connectDragSource: PropTypes.func,
  definition: libraryWidgetDefinition,
  isDraggning: PropTypes.bool,
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
    // Ugly:
    const builtIn = this.props.widgetDefinitions.filter(
      definition => definition.type.indexOf("CANVAS_") === -1
    );
    const custom = this.props.widgetDefinitions.filter(
      definition => definition.type.indexOf("CANVAS_") === 0
    );

    return (
      <div className="Library">
        <h1>Built-In</h1>
        {builtIn.map((definition, i) => {
          return <LibraryWidget key={i} definition={definition} />;
        })}
        {this.props.showCustom && (
          <React.Fragment>
            <h1>Custom</h1>
            {custom.map((definition, i) => {
              return <LibraryWidget key={i} definition={definition} />;
            })}
          </React.Fragment>
        )}
      </div>
    );
  }
}

Library.propTypes = {
  showCustom: PropTypes.bool,
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition),
}