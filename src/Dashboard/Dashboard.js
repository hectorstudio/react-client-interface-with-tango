import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import queryString from "query-string";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";

import { WIDGET_DEFINITIONS, getWidgetDefinition } from "./widgetDefinitions";

import "./Dashboard.css";

const GRID_TILE_SIZE = 15;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const w = queryString.parse(props.location.search).w;
    const widgets = w ? JSON.parse(decodeURI(w)) : [];

    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedWidgetIndex: -1, // Belongs in edit component
      widgets,
      deviceNames: []
    };

    this.toggleMode = this.toggleMode.bind(this);
    this.handleMoveWidget = this.handleMoveWidget.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
    this.handleSelectWidget = this.handleSelectWidget.bind(this);
    this.handleDeleteWidget = this.handleDeleteWidget.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
  }

  handleSelectWidget(index) {
    this.setState({ selectedWidgetIndex: index });
  }

  handleDeleteWidget(index) {
    const widgets = [...this.state.widgets];
    widgets.splice(index, 1);
    this.updateWidgets(widgets);
    this.setState({ selectedWidgetIndex: -1 });
  }

  handleAddWidget(definition, x, y) {
    const params = definition.params.reduce(
      (accum, param) => ({
        ...accum,
        [param.name]: param.default
      }),
      {}
    );
    const widget = {
      type: definition.type,
      x: roundToGrid(x),
      y: roundToGrid(y),
      device: null,
      attribute: null,
      params
    };
    const widgets = [...this.state.widgets, widget];
    this.updateWidgets(widgets);
    this.setState({ selectedWidgetIndex: widgets.length - 1 });
  }

  handleParamChange(param, value) {
    const index = this.state.selectedWidgetIndex;
    const widget = this.state.widgets[index];
    const params = { ...widget.params, [param]: value };
    const updatedWidget = { ...widget, params };
    const widgets = [...this.state.widgets];
    widgets.splice(index, 1, updatedWidget);
    this.updateWidgets(widgets);
  }

  updateWidgets(widgets) {
    this.setState({ widgets });

    const w = encodeURI(JSON.stringify(widgets));
    this.props.history.replace("?w=" + w);
  }

  // Convenience method used by handler methods
  updateWidget(index, changes) {
    const widgets = [...this.state.widgets];
    const widget = { ...widgets[index], ...changes };
    widgets.splice(index, 1, widget);
    this.updateWidgets(widgets);
  }


  handleMoveWidget(index, x, y) {
    const widget = this.state.widgets[index];
    const proposedPos = { x: widget.x + x, y: widget.y + y };
    const newPos = {
      x: Math.max(0, roundToGrid(proposedPos.x)),
      y: Math.max(0, roundToGrid(proposedPos.y)) 
    };
    this.updateWidget(index, newPos);
  }

  handleDeviceChange(device) {
    this.updateWidget(this.state.selectedWidgetIndex, { device });
  }

  handleAttributeChange(attribute) {
    this.updateWidget(this.state.selectedWidgetIndex, { attribute });
  }

  render() {
    const mode = this.state.mode;
    return (
      <div className="Dashboard">
        <div className="Header">
          <button
            onClick={this.toggleMode}
            style={{ fontSize: "small", padding: "0.5em", width: "2em" }}
            className={classNames("fa", {
              "fa-play": mode === "edit",
              "fa-pause": mode === "run"
            })}
          />
        </div>
        {mode === "edit" ? (
          <EditCanvas
            widgets={this.state.widgets}
            onMoveWidget={this.handleMoveWidget}
            onSelectWidget={this.handleSelectWidget}
            onDeleteWidget={this.handleDeleteWidget}
            selectedWidgetIndex={this.state.selectedWidgetIndex}
            onAddWidget={this.handleAddWidget}
          />
        ) : (
          <RunCanvas widgets={this.state.widgets} />
        )}
        {mode === "edit" && (
          <div className="Sidebar">
            {this.state.selectedWidgetIndex === -1 ? (
              <Library widgetDefinitions={WIDGET_DEFINITIONS} />
            ) : (
              <Inspector
                widget={this.state.widgets[this.state.selectedWidgetIndex]}
                widgetDefinitions={WIDGET_DEFINITIONS}
                deviceNames={this.state.deviceNames}
                onParamChange={(param, value) =>
                  this.handleParamChange(param, value)
                }
                onDeviceChange={device => this.handleDeviceChange(device)}
                onAttributeChange={attribute =>
                  this.handleAttributeChange(attribute)
                }
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export function roundToGrid(val){
  return val % GRID_TILE_SIZE >= GRID_TILE_SIZE/2 ? val + (GRID_TILE_SIZE - ((val) % GRID_TILE_SIZE)) : val - (val % GRID_TILE_SIZE);
}

export function expandToGrid(val){
  return val + (GRID_TILE_SIZE - ((val) % GRID_TILE_SIZE));
}

export default DragDropContext(HTML5Backend)(Dashboard);
