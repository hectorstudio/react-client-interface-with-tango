import React, { Component } from "react";

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

const WIDGET_INSTANCE_DEFINITIONS = [
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
];

class RunCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: {}
    };
  }

  componentDidMount() {
    const models = this.props.widgetInstanceDefinitions.map(
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

  widgetInstanceDefinitionToWidget(instanceDefinition) {
    return WIDGET_DEFINITIONS[instanceDefinition.type].component;
  }

  valueForModel(device, attribute) {
    const model = device + "/" + attribute;
    return this.state.attributes[model];
  }

  render() {
    return (
      <div
        className="Canvas"
        onClick={() => (this.props.onClick ? this.props.onClick() : null)}
      >
        {this.props.widgetInstanceDefinitions.map((definition, i) => {
          const Widget = this.widgetInstanceDefinitionToWidget(definition);
          const { x, y, device, attribute, params } = definition;
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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "edit",
      sidebar: "library"
    };
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="Header">
          <button style={this.state.mode === 'edit' ? {fontWeight: 'bold'} : {}} onClick={() => this.setState({mode: 'edit'})}>Edit</button>
          <button style={this.state.mode === 'run' ? {fontWeight: 'bold'} : {}} onClick={() => this.setState({mode: 'run'})}>Run</button>
        </div>
        <RunCanvas
          onClick={() => this.setState({mode: "library"})}
          widgetInstanceDefinitions={WIDGET_INSTANCE_DEFINITIONS}
        />
        <div className="Inspector">
          {/*<select>
            <option>Library</option>
            <option>Parameters</option>
          </select>*/}

          {Object.keys(WIDGET_DEFINITIONS).map(key => {
            const definition = WIDGET_DEFINITIONS[key];
            const Widget = definition.component;
            const props = definition.libraryProps;
            return (
              <div>
                <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                  {definition.name}
                </span>
                <Widget {...props} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Dashboard;
