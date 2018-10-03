import React, { Component } from "react";
import classNames from "classnames";

import "./Dashboard.css";
import { connect } from "react-redux";
import { subscribeDevice } from "../actions/tango";

const WIDGET_DEFINITIONS = {
  ATTRIBUTE_READ_ONLY: {
    name: "Read-Only Attribute",
    component: ({ value, params: { scientific } }) => (
      <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
        {scientific ? Number(value).toExponential(2) : value}
      </div>
    ),
    libraryProps: {
      value: 0,
      params: {}
    },
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false
      }
    ]
  },

  MOTOR_CONTROL: {
    name: "Motor Control",
    component: ({ value }) => (
      <div>
        <button>+</button>
        <button>-</button> <span>Position: </span>
        <span>{value}</span>
      </div>
    ),
    libraryProps: {
      value: 0
    }
  }
};

class RunCanvas extends Component {
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
    return WIDGET_DEFINITIONS[widget.type].component;
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

class EditCanvas extends Component {
  constructor(props) {
    super(props);
  }

  componentForWidget(widget) {
    return WIDGET_DEFINITIONS[widget.type].component;
  }

  placeholderValueForWidget(widget) {
    return WIDGET_DEFINITIONS[widget.type].libraryProps.value;
  }

  handleSelectWidget(i, event) {
    event.stopPropagation();
    if (this.props.onSelectWidget) {
      this.props.onSelectWidget(i);
    }
  }

  render() {
    return (
      <div
        className="Canvas edit"
        onClick={this.handleSelectWidget.bind(this, -1)}
      >
        {this.props.widgets.map((widget, i) => {
          const Widget = this.componentForWidget(widget);
          const { x, y, device, attribute, params } = widget;
          const value = this.placeholderValueForWidget(widget);
          const className = classNames("Widget", {
            selected: this.props.selectedWidgetIndex === i
          });

          return (
            <div
              key={i}
              className={className}
              style={{ left: x, top: y }}
              onClick={this.handleSelectWidget.bind(this, i)}
              onMouseMove={e => console.log(e.r)}
            >
              <Widget value={value} params={params} />
            </div>
          );
        })}
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
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
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
            onSelectWidget={i => this.setState({ selectedWidgetIndex: i })}
            selectedWidgetIndex={this.state.selectedWidgetIndex}
            onAddWidget={() => alert("Added!")}
          />
        ) : (
          <RunCanvas widgets={this.state.widgets} />
        )}
        {mode === "edit" && (
          <div className="Inspector">
            {Object.keys(WIDGET_DEFINITIONS).map(key => {
              const definition = WIDGET_DEFINITIONS[key];
              const Widget = definition.component;
              const props = definition.libraryProps;
              return (
                <div key={key}>
                  <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {definition.name}
                  </span>
                  <Widget {...props} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
