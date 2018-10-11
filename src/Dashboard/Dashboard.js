import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import queryString from "query-string";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";

import {
  WIDGET_DEFINITIONS,
  getWidgetDefinition
} from "./widgets/widgetDefinitions";

import { complexWidgetDefinition } from "./ComplexWidget";

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // const w = queryString.parse(props.location.search).w;
    // const widgets = w ? JSON.parse(decodeURI(w)) : [];

    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedWidgetIndex: -1, // Belongs in edit component
      selectedCanvasIndex: 0,
      // widgets,
      canvases: [
        { id: 0, name: "Root", widgets: [] },
        { id: 1, name: "Another", widgets: [] },
        { id: 2, name: "Yet another", widgets: [] }
      ],
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
    this.handleChangeCanvas = this.handleChangeCanvas.bind(this);
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
  }

  handleSelectWidget(index) {
    this.setState({ selectedWidgetIndex: index });
  }

  handleDeleteWidget(index) {
    const widgets = [...this.currentWidgets()];
    widgets.splice(index, 1);
    this.updateWidgets(widgets, -1);
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
      x,
      y,
      device: null,
      attribute: null,
      params
    };
    const widgets = [...this.currentWidgets(), widget];
    this.updateWidgets(widgets, widgets.length - 1);
  }

  handleParamChange(param, value) {
    const index = this.state.selectedWidgetIndex;
    const widget = this.selectedWidget();

    const params = { ...widget.params, [param]: value };
    const updatedWidget = { ...widget, params };
    const widgets = this.currentWidgets();
    widgets.splice(index, 1, updatedWidget);
    this.updateWidgets(widgets);
  }

  updateWidgets(widgets, selectedWidgetIndex) {
    selectedWidgetIndex =
      selectedWidgetIndex != null
        ? selectedWidgetIndex
        : this.state.selectedWidgetIndex;

    const canvases = [...this.state.canvases];
    const canvas = { ...canvases[this.state.selectedCanvasIndex], widgets };
    canvases[this.state.selectedCanvasIndex] = canvas;
    this.setState({ canvases, selectedWidgetIndex });

    // const w = encodeURI(JSON.stringify(widgets));
    // this.props.history.replace("?w=" + w);
  }

  // Convenience method used by handler methods
  updateWidget(index, changes) {
    const widgets = this.currentWidgets();
    const widget = { ...widgets[index], ...changes };
    widgets.splice(index, 1, widget);
    this.updateWidgets(widgets);
  }

  currentWidgets() {
    const { canvases, selectedCanvasIndex } = this.state;
    const canvas = canvases[selectedCanvasIndex];
    return [...canvas.widgets];
  }

  selectedWidget() {
    const widgets = this.currentWidgets();
    return widgets[this.state.selectedWidgetIndex];
  }

  handleMoveWidget(index, x, y) {
    const widget = this.currentWidgets()[index];
    const proposedPos = { x: widget.x + x, y: widget.y + y };
    const newPos = {
      x: Math.max(0, proposedPos.x),
      y: Math.max(0, proposedPos.y)
    };
    this.updateWidget(index, newPos);
  }

  handleDeviceChange(device) {
    this.updateWidget(this.state.selectedWidgetIndex, { device });
  }

  handleAttributeChange(attribute) {
    this.updateWidget(this.state.selectedWidgetIndex, { attribute });
  }

  handleChangeCanvas(event) {
    const selectedCanvasIndex = parseInt(event.target.value, 10);
    this.setState({ selectedCanvasIndex });
  }

  isRootCanvas() {
    return this.state.selectedCanvasIndex === 0;
  }

  render() {
    const mode = this.state.mode;
    const widgets = this.currentWidgets();
    const selectedWidget = this.selectedWidget();

    const complexWidgetDefinitions = this.state.canvases
      .slice(1)
      .map(complexWidgetDefinition);
    const widgetDefinitions = [
      ...WIDGET_DEFINITIONS,
      ...complexWidgetDefinitions
    ];

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
          <select
            style={{ marginLeft: "0.5em" }}
            onChange={this.handleChangeCanvas}
          >
            {this.state.canvases.map((canvas, i) => (
              <option key={i} value={i}>
                {i === 0 ? "Root" : canvas.name}
              </option>
            ))}
          </select>
        </div>
        {mode === "edit" ? (
          <EditCanvas
            widgets={widgets}
            widgetDefinitions={widgetDefinitions}
            onMoveWidget={this.handleMoveWidget}
            onSelectWidget={this.handleSelectWidget}
            onDeleteWidget={this.handleDeleteWidget}
            selectedWidgetIndex={this.state.selectedWidgetIndex}
            onAddWidget={this.handleAddWidget}
          />
        ) : (
          <RunCanvas
            widgets={widgets}
            widgetDefinitions={widgetDefinitions}
            subCanvases={this.state.canvases.slice(1)}
          />
        )}
        {mode === "edit" && (
          <div className="Sidebar">
            {this.state.selectedWidgetIndex === -1 ? (
              <Library widgetDefinitions={widgetDefinitions} />
            ) : (
              <Inspector
                widget={widgets[this.state.selectedWidgetIndex]}
                widgetDefinitions={widgetDefinitions}
                deviceNames={this.state.deviceNames}
                onParamChange={this.handleParamChange}
                onDeviceChange={this.handleDeviceChange}
                onAttributeChange={this.handleAttributeChange}
                isRootCanvas={this.isRootCanvas()}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
