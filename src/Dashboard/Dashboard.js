import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import EditCanvas from './EditCanvas/EditCanvas';
import Library from './Library/Library';
import RunCanvas from './RunCanvas/RunCanvas';

import { WIDGET_DEFINITIONS, getWidgetDefinition } from './widgetDefinitions';

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedWidgetIndex: -1, // Belongs in edit component
      widgets: [
        {
          type: "ATTRIBUTE_READ_ONLY",
          x: 30,
          y: 100,
          device: "sys/tg_test/1",
          attribute: "double_scalar",
          params: {
            scientific: true
          }
        },

        {
          type: "ATTRIBUTE_READ_ONLY",
          x: 70,
          y: 180,
          device: "sys/tg_test/1",
          attribute: "ulong_scalar",
          params: {
            scientific: false
          }
        }
      ]
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleMoveWidget = this.handleMoveWidget.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
  }

  handleMoveWidget(index, x, y) {
    const widgets = [...this.state.widgets];
    const oldWidget = widgets[index];
    const widget = { ...oldWidget, x: oldWidget.x + x, y: oldWidget.y + y };
    widgets.splice(index, 1, widget);
    this.setState({ widgets });
  }

  handleAddWidget(definition, x, y) {
    const params = definition.params.map(param => ({
      [param.name]: param.default
    }));
    const widget = {
      type: definition.type,
      x,
      y,
      device: "",
      attribute: "",
      params
    };
    const widgets = [...this.state.widgets, widget];
    this.setState({ widgets });
  }

  render() {
    const mode = this.state.mode;
    return (
      <div className="Dashboard">
        <div className="Header">
          <button
            onClick={this.toggleMode}
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
            onSelectWidget={i => this.setState({ selectedWidgetIndex: i })}
            selectedWidgetIndex={this.state.selectedWidgetIndex}
            onAddWidget={this.handleAddWidget}
          />
        ) : (
          <RunCanvas widgets={this.state.widgets} />
        )}
        {mode === "edit" && (
          <div className="Inspector">
            <Library widgetDefinitions={WIDGET_DEFINITIONS} />
          </div>
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
