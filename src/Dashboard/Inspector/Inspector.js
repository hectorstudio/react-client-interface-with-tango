import React, { Component } from "react";
import createGQLClient from "graphql-client";
import { getWidgetDefinition } from "../utils";
import PropTypes from 'prop-types'
import { widget, widgetDefinition } from "../../propTypes/propTypes"

export default class Inspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingDeviceNames: true,
      deviceNames: [], // Should be lifted out to higher component in order to reduce data fetching
      fetchingAttributeNames: false,
      attributeNames: []
    };

    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
    this.gqlClient = createGQLClient({ url: "/db " });
  }

  handleSelectDevice(event) {
    this.props.onDeviceChange(event.target.value);
  }

  handleSelectAttribute(event) {
    this.props.onAttributeChange(event.target.value);
  }

  componentDidUpdate(prevProps) {
    const oldWidget = prevProps.widget;
    const newWidget = this.props.widget;
    const oldDevice = oldWidget ? oldWidget.device : null;
    const newDevice = newWidget ? newWidget.device : null;

    if (newDevice && newDevice !== oldDevice) {
      this.fetchAttributeNames(newDevice);
    }
  }

  fetchAttributeNames(device) {
    this.setState({
      fetchingAttributeNames: true,
      attributeNames: []
    });

    this.callServiceGraphQL(
      `
      query FetchNames($device: String!) {
        device(name: $device) {
          attributes {
            name
          }
        }
      }
  `,
      { device }
    )
      .then(res => {
        const attributes = res.data.device.attributes;
        return attributes.map(attribute => attribute.name);
      })
      .catch(() => [])
      .then(attributeNames =>
        this.setState({ attributeNames, fetchingAttributeNames: false })
      );
  }

  inputForParam(param, value) {
    const type = this.props.widget.type;
    const widgetDefinition = getWidgetDefinition(
      this.props.widgetDefinitions,
      type
    );
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
      case "number":
        return (
          <input
            type="text"
            value={value}
            onChange={e =>
              this.props.onParamChange(param, Number(e.target.value))
            }
          />
        );
      default:
        return (
          <span>No input for parameter type "{paramDefinition.type}"</span>
        );
    }
  }

  callServiceGraphQL(query, variables) {
    return this.gqlClient.query(query, variables || {}, (req, res) => {
      if (res.status === 401) {
        throw new Error("Not authorized");
      }
    });
  }

  componentDidMount() {
    this.callServiceGraphQL(
      `
      query {
        devices {
          name
        }
      }
    `
    )
      .then(res => res.data.devices)
      .then(devices => devices.map(device => device.name))
      .catch(() => [])
      .then(deviceNames =>
        this.setState({ deviceNames, fetchingDeviceNames: false })
      );

    const widget = this.props.widget;
    if (widget != null && widget.device != null) {
      this.fetchAttributeNames(widget.device);
    }
  }

  render() {
    const { widget, widgetDefinitions } = this.props;

    if (widget == null) {
      return null;
    }

    const { type, params, device, attribute } = widget;
    const definition = getWidgetDefinition(widgetDefinitions, type);
    const fields = definition.fields;
    const paramDefinitions = definition.params;

    const attributeChooser =
      device === "__parent__" ? (
        <input
          className="form-control"
          type="text"
          value={attribute || ""}
          onChange={this.handleSelectAttribute}
        />
      ) : (
        <select
          className="form-control"
          value={attribute || ""}
          onChange={this.handleSelectAttribute}
          disabled={device == null}
        >
          {attribute == null && (
            <option value="" disabled>
              {device ? "None" : "Select Device First"}
            </option>
          )}
          {this.state.attributeNames.map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
      );

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
                    <select
                      className="form-control"
                      value={device || ""}
                      onChange={this.handleSelectDevice}
                    >
                      {device == null && (
                        <option value="" disabled>
                          None
                        </option>
                      )}
                      {this.props.isRootCanvas === false && (
                        <option value="__parent__">Parent Device</option>
                      )}
                      {this.state.deviceNames.map((name, i) => (
                        <option key={i} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )}
              {fields.indexOf("attribute") !== -1 && (
                <tr>
                  <td>Attribute:</td>
                  <td>{attributeChooser}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {paramDefinitions.length * fields.length > 0 && <hr />}
        <table>
          <tbody>
            {paramDefinitions.map(({ name, description }) => (
              <tr key={name}>
                <td>{description || name}: </td>
                <td>{this.inputForParam(name, params[name])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

Inspector.propTypes = {
  deviceNames: PropTypes.arrayOf(PropTypes.string),
  isRootCanvas: PropTypes.bool,
  onAttributeChange: PropTypes.func,
  onDeviceChange: PropTypes.func,
  onParamChange: PropTypes.func,
  widget: widget,
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition),
}