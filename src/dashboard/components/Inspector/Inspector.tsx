import React, { Component } from "react";
import { getWidgetDefinition } from "../../utils";

interface IBaseInputDefinition {
  label: string;
}

interface IBooleanInputDefinition extends IBaseInputDefinition {
  type: "boolean";
  default: boolean;
}

interface INumberInputDefinition extends IBaseInputDefinition {
  type: "number";
  default: number;
}

interface IStringInputDefinition extends IBaseInputDefinition {
  type: "string";
  default: string;
}

interface IComplexInputDefinition extends IBaseInputDefinition {
  type: "complex";
  inputs: IInputDefinitionMapping;
  default: object;
}

interface ISelectInputDefinition extends IBaseInputDefinition {
  type: "select";
  default: string;
  options: Array<{
    name: string;
    value: any;
  }>;
}

interface IAttributeInputDefinition extends IBaseInputDefinition {
  type: "attribute";
  default: null;
}

type IInputDefinition =
  | IBooleanInputDefinition
  | INumberInputDefinition
  | IStringInputDefinition
  | IComplexInputDefinition
  | IAttributeInputDefinition
  | ISelectInputDefinition;

interface IInputDefinitionMapping {
  [name: string]: IInputDefinition;
}

interface INewDefinition {
  inputs: IInputDefinitionMapping;
}

interface IWidget {
  [input: string]: any;
}

class InputList extends Component<{
  inputDefinitions: IInputDefinitionMapping;
  widget: IWidget;
}> {
  public render() {
    const { inputDefinitions, widget } = this.props;
    const inputNames = Object.keys(inputDefinitions);

    return inputNames.map((inputName, i) => {
      const input = inputDefinitions[inputName];
      const label = input.label || inputName;

      const value = widget[inputName] || input.default; // Later, default value will always be set on widget creation

      if (input.type === "number") {
        return (
          <div>
            {label}: <input type="text" value={value} />
          </div>
        );
      } else if (input.type === "boolean") {
        return (
          <div>
            {label}: <input type="checkbox" checked={value} />
          </div>
        );
      } else if (input.type === "string") {
        return (
          <div>
            {label}: <input type="text" value={value} />;
          </div>
        );
      } else if (input.type === "attribute") {
        return <div>{label}: ATTRIBUTE</div>;
      } else if (input.type === "complex") {
        return (
          <div>
            {label}:{" "}
            <div style={{ marginLeft: "1em" }}>
              <InputList inputDefinitions={input.inputs} widget={widget} />
              [+]
            </div>
          </div>
        );
      } else if (input.type === "select") {
        return (
          <div>
            {label}:{" "}
            <select>
              {input.options.map(({ name }) => (
                <option selected={name === value}>{name}</option>
              ))}
            </select>
          </div>
        );
      }

      return <pre key={i}>{JSON.stringify(input)}</pre>;
    });
  }
}

interface IProps {
  tangoDB: string;
  onDeviceChange: any;
  onAttributeChange: any;
  onDeviceRemove: any;
  onParamChange: any;
  widget: any;
  widgetDefinitions: any;
  isRootCanvas: boolean;

  newDefinition: INewDefinition;
  newWidget: IWidget;
}

interface IState {
  attributes: any;
  fetchingDeviceNames: any;
  deviceNames: any;
  fetchingAttributes: any;
}

export default class Inspector extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      fetchingDeviceNames: true,
      deviceNames: [], // Should be lifted out to higher component in order to reduce data fetching
      fetchingAttributes: false,
      attributes: {}
    };

    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
    this.handleAddDevice = this.handleAddDevice.bind(this);
    this.handleRemoveDevice = this.handleRemoveDevice.bind(this);
    this.deviceChooser = this.deviceChooser.bind(this);
    this.attributeChooser = this.attributeChooser.bind(this);
  }

  public handleSelectDevice(event, index) {
    this.props.onDeviceChange(event.target.value, index);
    this.fetchAttributes(event.target.value);
  }

  public handleSelectAttribute(event, index) {
    this.props.onAttributeChange(event.target.value, index);
  }

  public handleAddDevice(index) {
    this.props.onDeviceChange(null, index);
  }

  public handleRemoveDevice(index) {
    this.props.onDeviceRemove(index);
  }

  public componentDidUpdate(prevProps) {
    const oldWidget = prevProps.widget;
    const newWidget = this.props.widget;
    const oldDevice = oldWidget ? oldWidget.device : null;
    const newDevice = newWidget ? newWidget.device : null;

    if (newDevice && newDevice !== oldDevice) {
      newDevice.forEach(device => {
        this.fetchAttributes(device);
      });
    }
  }

  public sortedDeviceNames(deviceNames) {
    return [...deviceNames].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  public fetchAttributes(device) {
    /*this.setState({
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
        this.setState({
          fetchingAttributes: false,
          attributes: { ...this.state.attributes, [device]: attributes }
        })
      );
    */
  }

  public inputForParam(param, value) {
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

  public componentDidMount() {
    /*this.callServiceGraphQL(
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
      widget.device.forEach(device => {
        if (device !== "__parent__") {
          this.fetchAttributes(device);
        }
      });
    }*/
  }

  public filteredAttributes(definition, device) {
    return this.state.attributes[device]
      .filter(({ dataformat }) => {
        const field = definition.fields.find(
          field2 => field2.type === "attribute"
        );
        const dataformats = (field || {}).dataformats;
        return dataformats == null || dataformats.indexOf(dataformat) !== -1;
      })
      .filter(({ datatype }) => {
        const field = definition.fields.find(
          field2 => field2.type === "attribute"
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

  public deviceChooser(deviceName, index) {
    return (
      <td>
        <select
          className="form-control"
          value={deviceName || ""}
          onChange={e => this.handleSelectDevice(e, index)}
        >
          {deviceName == null && (
            <option value="none" disabled={true}>
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
    );
  }

  public attributeChooser(device, attribute, definition, index) {
    return device === "__parent__" ? (
      <input
        className="form-control"
        type="text"
        value={attribute || ""}
        onChange={e => this.handleSelectAttribute(e, index)}
      />
    ) : (
      <select
        className="form-control"
        value={attribute || ""}
        onChange={e => this.handleSelectAttribute(e, index)}
        disabled={device == null}
      >
        {attribute == null && (
          <option value="" disabled={true}>
            {device ? "None" : "Select Device First"}
          </option>
        )}
        {this.state.attributes[device] &&
          this.filteredAttributes(definition, device).map(({ name }, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
      </select>
    );
  }

  public render() {
    const { newDefinition: definition, newWidget: widget } = this.props;
    return <InputList inputDefinitions={definition.inputs} widget={widget} />;

    // const { widget, widgetDefinitions } = this.props;

    // if (widget == null) {
    //   return null;
    // }

    // const { type, params, device, attribute } = widget;
    // const definition = getWidgetDefinition(widgetDefinitions, type);
    // const fields = definition.fields;
    // const paramDefinitions = definition.params;

    // const fieldTypes = fields.map(field => field.type);

    // return (
    //   <div className="Inspector">
    //     <h1>Inspector</h1>
    //     {fields.length > 0 &&
    //       [...Array(device.length || 1)].map((e, i) => (
    //         <Fragment key={i}>
    //           {i !== 0 && fieldTypes.indexOf("multi") !== -1 && (
    //             <i
    //               className="fa fa-times"
    //               onClick={() => this.handleRemoveDevice(i)}
    //             />
    //           )}
    //           <table>
    //             <tbody>
    //               {fieldTypes.indexOf("device") !== -1 && (
    //                 <tr>
    //                   <td>Device: </td>
    //                   {this.deviceChooser(device[i], i)}
    //                 </tr>
    //               )}
    //               {fieldTypes.indexOf("attribute") !== -1 && (
    //                 <tr>
    //                   <td>Attribute:</td>
    //                   <td>
    //                     {this.attributeChooser(
    //                       device[i],
    //                       attribute[i],
    //                       definition,
    //                       i
    //                     )}
    //                   </td>
    //                 </tr>
    //               )}
    //             </tbody>
    //           </table>
    //           <hr />
    //         </Fragment>
    //       ))}
    //     {fieldTypes.indexOf("multi") !== -1 && (
    //       <button onClick={() => this.handleAddDevice(device.length)}>
    //         Add device
    //       </button>
    //     )}
    //     {paramDefinitions.length * fields.length > 0 && <hr />}
    //     <table>
    //       <tbody>
    //         {paramDefinitions.map(({ name, description }) => (
    //           <tr key={name}>
    //             <td>{description || name}: </td>
    //             <td>{this.inputForParam(name, params[name])}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // );
  }
}
