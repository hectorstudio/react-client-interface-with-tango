import React, { Component, Fragment } from "react";
import createGQLClient from "graphql-client";
import { getWidgetDefinition } from "../utils";
import PropTypes from "prop-types";
import { widget, widgetDefinition } from "../../propTypes/propTypes";

export default class Inspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingDeviceNames: true,
      deviceNames: [], // Should be lifted out to higher component in order to reduce data fetching
      fetchingAttributes: false,
      attributes: {},
    };

    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
    this.handleAddDevice = this.handleAddDevice.bind(this);
    this.handleRemoveDevice = this.handleRemoveDevice.bind(this);
    this.deviceChooser = this.deviceChooser.bind(this);
    this.attributeChooser = this.attributeChooser.bind(this);
    this.gqlClient = createGQLClient({ url: "/db " });
  }

  handleSelectDevice(event, index) {
    this.props.onDeviceChange(event.target.value, index);
    this.fetchAttributes(event.target.value);
  }

  handleSelectAttribute(event, index) {
    this.props.onAttributeChange(event.target.value, index);
  }

  handleAddDevice(index){
    this.props.onDeviceChange(null, index);
  }

  handleRemoveDevice(index){
    this.props.onDeviceRemove(index);
  }

  componentDidUpdate(prevProps) {
    const oldWidget = prevProps.widget;
    const newWidget = this.props.widget;
    const oldDevice = oldWidget ? oldWidget.device : null;
    const newDevice = newWidget ? newWidget.device : null;

    if (newDevice && newDevice !== oldDevice) {
      newDevice.forEach((device) => {
        this.fetchAttributes(device);
      });
    }
  }

  sortedDeviceNames(deviceNames) {
    return [...deviceNames].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  fetchAttributes(device) {
    this.setState({
      fetchingAttributes: true
    });

    this.callServiceGraphQL(
      `
      query FetchNames($device: String!) {
        device(name: $device) {
          attributes {
            name
            dataformat
            datatype
          }
        }
      }
  `,
      { device }
    )
      .then(res => res.data.device.attributes)
      .catch(() => [])
      .then(attributes =>
        this.setState({ fetchingAttributes: false, attributes : {...this.state.attributes, [device]: attributes} })
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
        this.setState({
          deviceNames: this.sortedDeviceNames(deviceNames),
          fetchingDeviceNames: false
        })
      );

    const widget = this.props.widget;
    if (widget != null && widget.device != null) {
      widget.device.forEach((device) => {
        this.fetchAttributes(device);
      });
    }
  }

  filteredAttributes(definition, device) {
    return this.state.attributes[device]
      .filter(({ dataformat }) => {
        const field = definition.fields.find(
          field => field.type === "attribute"
        );
        const dataformats = (field || {}).dataformats;
        return dataformats == null || dataformats.indexOf(dataformat) !== -1;
      })
      .filter(({ datatype }) => {
        const field = definition.fields.find(
          field => field.type === "attribute"
        );
        const onlyNumeric = field != null && field.onlyNumeric;
        if (!onlyNumeric) {
          return true;
        } else {
          const numericTypes = [
            "DevDouble",
            "DevFloat",
            "DevLong",
            "DevLong64",
            "DevShort",
            "DevUChar",
            "DevULong",
            "DevULong64",
            "DevUShort"
          ];
          return numericTypes.indexOf(datatype) !== -1;
        }
      });
  }

  deviceChooser(deviceName, index){
    return (
      <td>
        <select
          className="form-control"
          value={deviceName || ""}
          onChange={(e) => this.handleSelectDevice(e, index)}
        >
          {deviceName == null && (
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
      </td>);
  }

  attributeChooser(device, attribute, definition, index){
    return(
    device === "__parent__" ? (
      <input
        className="form-control"
        type="text"
        value={attribute || ""}
        onChange={(e) => this.handleSelectAttribute(e, index)}
      />
    ) : (
      <select
        className="form-control"
        value={attribute || ""}
        onChange={(e) => this.handleSelectAttribute(e, index)}
        disabled={device == null}
      >
        {attribute == null && (
          <option value="" disabled>
            {device ? "None" : "Select Device First"}
          </option>
        )}
        {this.state.attributes[device] && this.filteredAttributes(definition, device).map(({ name }, i) => (
          <option key={i} value={name}>
            {name}
          </option>
        ))}
      </select>
    )
    );
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

    const fieldTypes = fields.map(field => field.type);

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        {fields.length > 0 && [...Array(device.length || 1)].map((e, i) =>
          <Fragment key={i}>
          {i !== 0 && fieldTypes.indexOf("multi") !== -1 && <i className="fa fa-times" onClick={() => this.handleRemoveDevice(i)}/>}
          <table>
            <tbody>
                {fieldTypes.indexOf("device") !== -1 && (
                  <tr>
                    <td>Device: </td>
                    {this.deviceChooser(device[i], i)}
                  </tr>
                )}
                {fieldTypes.indexOf("attribute") !== -1 && (
                  <tr>
                    <td>Attribute:</td>
                    <td>{this.attributeChooser(device[i], attribute[i], definition, i)}</td>
                  </tr>
                )}
            </tbody>
          </table>
          <hr />
          </Fragment>
        )}
        {fieldTypes.indexOf("multi") !== -1 && (
          <button onClick={() => this.handleAddDevice(device.length)}>Add device</button>
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
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition)
};
