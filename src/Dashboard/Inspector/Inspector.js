import React, { Component } from "react";
import { getWidgetDefinition } from "../widgetDefinitions";

export default class Inspector extends Component {
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
        return <input type="text" />;
    }
  }

  render() {
    const { type, params, device, attribute } = this.props.widget;
    const definition = getWidgetDefinition(type);
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
                    <select value={device} onChange={e => this.props.onDeviceChange(e.target.value)}>
                        {this.props.deviceNames.map((name, i) => <option key={i} value={name}>{name}</option>)}
                    </select>
                  </td>
                </tr>
              )}
              {fields.indexOf("attribute") !== -1 && (
                <tr>
                  <td>Attribute:</td>
                  <td>
                    <input
                      type="text"
                      value={attribute}
                      onChange={e =>
                        this.props.onAttributeChange(e.target.value)
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {fields.length > 0 && <hr />}
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
