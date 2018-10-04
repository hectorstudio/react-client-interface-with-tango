import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";

import { WIDGET_DEFINITIONS, getWidgetDefinition } from "./widgetDefinitions";

import "./Dashboard.css";

class Inspector extends Component {
  inputForParam(param, value) {
    const type = this.props.widget.type;
    const widgetDefinition = getWidgetDefinition(type);
    const paramDefinition = widgetDefinition.params.find(
      paramDef => paramDef.name === param
    );

    switch (paramDefinition.type) {
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={e => this.props.onParamChange(param, e.target.checked)}
          />
        );
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={e => this.props.onParamChange(param, e.target.value)}
          />
        );
      default:
        return <input type="text" />;
    }
  }

  render() {
    const { type, params, device, attribute } = this.props.widget;
    const definition = getWidgetDefinition(type)
    const fields = definition.fields;
    const paramDefinitions = definition.params;

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        {fields.length > 0 && (
          <table>
            <tbody>
              {fields.indexOf("device") !== -1 && (
                <tr>
                  <td>Device:</td>
                  <td>
                    <input type="text" value={device} onChange={e => this.props.onDeviceChange(e.target.value)}/>
                  </td>
                </tr>
              )}
              {fields.indexOf("attribute") !== -1 && (
                <tr>
                  <td>Attribute:</td>
                  <td>
                    <input type="text" value={attribute}  nChange={e => this.props.onAttributeChange(e.target.value)}/>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {fields.length > 0 && <hr />}
        <table>
          <tbody>
            {paramDefinitions.map(({name, description}) => (
              <tr key={name}>
                <td>{description || name}: </td><td>{this.inputForParam(name, params[name])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

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
            showName: false,
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
            showName: true,
            scientific: false
          }
        },

        {
          type: "LABEL",
          x: 340,
          y: 180,
          params: {
            text: "sdfsdf"
          }
        }
      ]
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleMoveWidget = this.handleMoveWidget.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
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
      device: "",
      attribute: "",
      params
    };
    const widgets = [...this.state.widgets, widget];
    this.setState({ widgets });
  }

  handleParamChange(param, value) {
    const index = this.state.selectedWidgetIndex;
    const widget = this.state.widgets[index];
    const params = { ...widget.params, [param]: value };
    const updatedWidget = { ...widget, params };
    const widgets = [...this.state.widgets];
    widgets.splice(index, 1, updatedWidget);
    this.setState({ widgets });
  }

  updateSelectedDevice(changes) {
    const index = this.state.selectedWidgetIndex;
    const widgets = [...this.state.widgets];
    const widget = {...widgets[index], ...changes};
    widgets.splice(index, 1, widget);
    this.setState({ widgets });
  }

  handleDeviceChange(device) {
    this.updateSelectedDevice({ device });
  }
  
  handleAttributeChange(attribute) {
    const index = this.state.selectedWidgetIndex;
    const widgets = [...this.state.widgets];
    const widget = {...widgets[index], attribute};
    widgets.splice(index, 1, widget);
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
            onSelectWidget={index =>
              this.setState({ selectedWidgetIndex: index })
            }
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
                onParamChange={(param, value) =>
                  this.handleParamChange(param, value)
                }
                onDeviceChange={device => this.handleDeviceChange(device)}
                onAttributeChange={attribute => this.handleAttributeChange(attribute)}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
