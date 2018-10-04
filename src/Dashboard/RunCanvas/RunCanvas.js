import React, { Component } from "react";
import { getWidgetDefinition } from "../widgetDefinitions";

export default class RunCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: {}
    };
  }

  connect() {
    const models = this.props.widgets.map(
      ({ device, attribute }) => `${device}/${attribute}`
    );

    this.socket = new WebSocket(
      "ws://localhost:3000/socket?dashboard",
      "graphql-ws"
    );

    const query = `
          subscription newChangeEvent($models: [String]!) {
            changeEvent(models: $models) {
              eventType
              device
              name
              data {
                value
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
          return {
            [event.device + "/" + event.name]: event.data.value
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

  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  valueForModel(device, attribute) {
    const model = device + "/" + attribute;
    return this.state.attributes[model];
  }

  render() {
    return (
      <div className="Canvas">
        {this.props.widgets.map((widget, i) => {
          const Widget = this.componentForWidget(widget);
          const { x, y, device, attribute, params } = widget;
          const value = this.valueForModel(device, attribute);

          return (
            <div key={i} className="Widget" style={{ left: x, top: y }}>
              <Widget value={value} params={params} />
            </div>
          );
        })}
      </div>
    );
  }
}
