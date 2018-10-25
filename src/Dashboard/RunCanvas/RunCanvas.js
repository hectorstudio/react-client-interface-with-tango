import React, { Component } from "react";
import { getWidgetDefinition } from "../utils";
import PropTypes from "prop-types";
import { widget, widgetDefinition, subCanvas } from "../../propTypes/propTypes";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error == null) {
      return this.props.children;
    }

    return (
      <div style={{ backgroundColor: "#ff8888" }}>
        {String(this.state.error)}
      </div>
    );
  }
}

export default class RunCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: {}
    };
  }

  modelsForSubcanvas(canvas, parent) {
    return canvas.widgets
      .map(widget => {
        const deviceSource = widget.device === "__parent__" ? parent : widget;
        return [deviceSource.device, widget.attribute];
      })
      .filter(([device, attribute]) => device != null && attribute != null)
      .map(([device, attribute]) => `${device}/${attribute}`);
  }

  isSubcanvasWidget(widget) {
    return this.definitionForWidget(widget).__canvas__ != null;
  }

  connect() {
    const canvasModels = this.props.widgets
      .filter(widget => widget.device != null)
      .filter(widget => this.isSubcanvasWidget(widget))
      .map(widget => {
        const canvasIndex = this.definitionForWidget(widget).__canvas__;
        const canvas = this.props.subCanvases[canvasIndex];
        return this.modelsForSubcanvas(canvas, widget);
      })
      .reduce((accum, curr) => [...accum, ...curr], []);

    const widgetModels = this.props.widgets
      .filter(({ canvas }) => canvas == null)
      .filter(({ device, attribute }) => device != null && attribute != null) // Skip widgets without device -- revise this
      .map(({ device, attribute }) => `${device}/${attribute}`);

    const models = [...canvasModels, ...widgetModels].filter(
      // Unique
      (val, idx, arr) => arr.indexOf(val) === idx
    );

    function socketUrl() {
      const loc = window.location;
      const protocol = loc.protocol.replace("http", "ws");
      return protocol + "//" + loc.host + "/socket";
    }

    this.socket = new WebSocket(socketUrl() + "?dashboard", "graphql-ws");

    const query = `
          subscription newChangeEvent($models: [String]!) {
            changeEvent(models: $models) {
              eventType
              device
              name
              data {
                value
                time
              }
            }
          }`;
    const variables = { models };
    const payload = { query, variables };

    this.socket.addEventListener("message", msg => {
      const data = JSON.parse(msg.data);
      if (data.type === "data") {
        const changeEvent = data.payload.data.changeEvent;
        if (changeEvent == null) {
          return;
        }

        const updatedAttributes = changeEvent.reduce((accum, event) => {
          const { value, time } = event.data;
          const model = event.device + "/" + event.name;
          return {
            ...accum,
            [model]: {
              value,
              time
            }
          };
        }, {});

        const oldAttributes = this.state.attributes;
        const attributes = { ...oldAttributes, ...updatedAttributes };
        this.setState({ attributes });
      }
    });

    this.socket.addEventListener("open", () => {
      const request = JSON.stringify({ type: "start", payload });
      this.socket.send(request);
    });
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  definitionForWidget(widget) {
    return getWidgetDefinition(this.props.widgetDefinitions, widget.type);
  }

  entryForModel(device, attribute) {
    const model = device + "/" + attribute;
    return this.state.attributes[model] || {};
  }

  valueForModel(device, attribute) {
    return this.entryForModel(device, attribute).value;
  }

  timeForModel(device, attribute) {
    const { time } = this.entryForModel(device, attribute);
    return new Date(time);
  }

  render() {
    return (
      <div className="Canvas run">
        {this.props.widgets.map((widget, i) => {
          const definition = this.definitionForWidget(widget);
          const Widget = definition.component;
          const { x, y, device, attribute, params } = widget;
          const value = this.valueForModel(device, attribute);
          const time = this.timeForModel(device, attribute);

          const extraProps =
            definition.__canvas__ != null
              ? { attributes: this.state.attributes }
              : {};

          return (
            <div key={i} className="Widget" style={{ left: x, top: y }}>
              <ErrorBoundary>
                <Widget
                  mode="run"
                  device={device}
                  attribute={attribute}
                  value={value}
                  time={time}
                  params={params}
                  {...extraProps}
                />
              </ErrorBoundary>
            </div>
          );
        })}
      </div>
    );
  }
}

RunCanvas.propTypes = {
  subCanvases: PropTypes.arrayOf(subCanvas),
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition),
  widgets: PropTypes.arrayOf(widget)
};
