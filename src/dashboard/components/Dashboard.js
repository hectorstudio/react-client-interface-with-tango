import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import queryString from "query-string";
import { connect } from "react-redux";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";

import { save as saveToRepo } from "../dashboardRepo";
import { load as loadFromRepo } from "../dashboardRepo";

import {
  WIDGET_DEFINITIONS,
  getWidgetDefinition,
  normalizeWidgetDefinitions
} from "../widgets/widgetDefinitions";

import { complexWidgetDefinition } from "./ComplexWidget/ComplexWidget";

const GRID_TILE_SIZE = 15;
import "./Dashboard.css";

import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import { SELECT_WIDGET } from "../state/actionTypes";

const DEFAULT_CANVASES = [
  {
    id: 0,
    name: "Root",
    widgets: []
  },
  {
    id: 1,
    name: "Subcanvas 1",
    widgets: []
  },
  {
    id: 2,
    name: "Subcanvas 2",
    widgets: []
  },
  {
    id: 3,
    name: "Subcanvas 3",
    widgets: []
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedWidgetIndex: -1, // Belongs in edit component
      selectedCanvasIndex: 0,
      canvases: DEFAULT_CANVASES,
      deviceNames: [] // Not used?
    };

    const id = this.parseId();
    if (id) {
      loadFromRepo(id).then(res => {
        if (res) {
          this.setState({ canvases: res.canvases });
        }
      });
    }

    this.toggleMode = this.toggleMode.bind(this);
    this.handleMoveWidget = this.handleMoveWidget.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
    this.handleSelectWidget = this.handleSelectWidget.bind(this);
    this.handleDeleteWidget = this.handleDeleteWidget.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleDeviceRemove = this.handleDeviceRemove.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleChangeCanvas = this.handleChangeCanvas.bind(this);
  }

  parseId() {
    const search = this.props.location.search;
    const parsed = queryString.parse(search);
    return parsed.id || "";
  }

  componentDidUpdate() {
    var id = this.parseId();
    saveToRepo(id, this.state.canvases)
      .then(res => {
        if (res.created) {
          this.props.history.replace("?id=" + res.id);
        }
      })
      .catch(function() {
        console.log("Couldn't reach dashboard repo");
      });
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
  }

  handleSelectWidget(index) {
    this.props.dispatch({ type: SELECT_WIDGET, index });
    this.setState({ selectedWidgetIndex: index });
  }

  handleDeleteWidget(index) {
    this.props.dispatch({ type: DELETE_WIDGET, index });

    const widgets = [...this.currentWidgets()];
    widgets.splice(index, 1);
    this.updateWidgets(widgets, -1);
  }

  handleAddWidget(definition, x, y) {
    this.props.dispatch({ type: ADD_WIDGET, x, y, definition });

    const params = definition.params.reduce(
      (accum, param) => ({
        ...accum,
        [param.name]: param.default
      }),
      {}
    );

    const device = this.isRootCanvas() ? [null] : ["__parent__"];
    const widget = {
      type: definition.type,
      device,
      x: roundToGrid(x),
      y: roundToGrid(y),
      attribute: [null],
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
      x: Math.max(0, roundToGrid(proposedPos.x)),
      y: Math.max(0, roundToGrid(proposedPos.y))
    };
    this.updateWidget(index, newPos);
  }

  handleDeviceChange(deviceName, index) {
    let device = [...this.selectedWidget().device];
    let attribute = [...this.selectedWidget().attribute];
    attribute[index] = null;
    device[index] = deviceName;
    this.updateWidget(this.state.selectedWidgetIndex, { attribute, device });
  }

  handleAttributeChange(attributeName, index) {
    let attribute = [...this.selectedWidget().attribute];
    attribute[index] = attributeName;
    this.updateWidget(this.state.selectedWidgetIndex, { attribute });
  }

  handleDeviceRemove(index) {
    let device = [...this.selectedWidget().device];
    let attribute = [...this.selectedWidget().attribute];
    attribute.splice(index, 1);
    device.splice(index, 1);
    this.updateWidget(this.state.selectedWidgetIndex, { attribute, device });
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

    const widgetDefinitions = normalizeWidgetDefinitions([
      ...WIDGET_DEFINITIONS,
      ...complexWidgetDefinitions
    ]);

    return (
      <div className="Dashboard">
        <LogInOut />
        <LoginDialog />
        <div className="TopBar">
          <form className="form-inline">
            <button
              type="button"
              onClick={this.toggleMode}
              style={{ fontSize: "small", width: "2.5em", textAlign: "center" }}
              className={classNames("form-control fa", {
                "fa-play": mode === "edit",
                "fa-pause": mode === "run"
              })}
              disabled={!this.isRootCanvas()}
            />
            <select
              className="form-control"
              style={{
                marginLeft: "0.5em",
                height: "2em"
              }}
              onChange={this.handleChangeCanvas}
            >
              {this.state.canvases.map((canvas, i) => (
                <option key={i} value={i}>
                  {i === 0 ? "Root" : canvas.name}
                </option>
              ))}
            </select>
            {false && (
              <button
                onClick={() => alert(JSON.stringify(this.state.canvases))}
              >
                Dump
              </button>
            )}
          </form>
        </div>
        <div className={classNames("CanvasArea", mode)}>
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
              tangoDB={this.props.match.params.tangoDB}
              subCanvases={[null, ...this.state.canvases.slice(1)]}
            />
          )}
        </div>
        {mode === "edit" && (
          <div className="Sidebar">
            {this.state.selectedWidgetIndex === -1 ? (
              <Library
                widgetDefinitions={widgetDefinitions}
                showCustom={this.state.selectedCanvasIndex === 0}
              />
            ) : (
              <Inspector
                widget={widgets[this.state.selectedWidgetIndex]}
                widgetDefinitions={widgetDefinitions}
                deviceNames={this.state.deviceNames}
                onParamChange={this.handleParamChange}
                onDeviceChange={this.handleDeviceChange}
                onDeviceRemove={this.handleDeviceRemove}
                onAttributeChange={this.handleAttributeChange}
                isRootCanvas={this.isRootCanvas()}
                tangoDB={this.props.match.params.tangoDB}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export function roundToGrid(val) {
  return val % GRID_TILE_SIZE >= GRID_TILE_SIZE / 2
    ? val + (GRID_TILE_SIZE - (val % GRID_TILE_SIZE))
    : val - (val % GRID_TILE_SIZE);
}

export function expandToGrid(val) {
  return val + (GRID_TILE_SIZE - (val % GRID_TILE_SIZE));
}

export default connect()(DragDropContext(HTML5Backend)(Dashboard));
