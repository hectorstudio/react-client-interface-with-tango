import React, { Component } from "react";
import { connect } from "react-redux";

import {
  IInputDefinitionMapping,
  IInputMapping,
  IWidget,
  IndexPath
} from "../../types";
import widgetBundles from "../../newWidgets";

import AttributeSelect from "./AttributeSelect";
import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";

class InputList extends Component<{
  inputDefinitions: IInputDefinitionMapping;
  inputs: IInputMapping;
  onChange: (path: IndexPath, value) => void;
  onAdd: (path: IndexPath) => void;
  onDelete: (path: IndexPath) => void;
  basePath?: IndexPath;
}> {
  public render() {
    const { inputDefinitions, inputs } = this.props;
    const inputNames = Object.keys(inputDefinitions);

    const inner = inputNames.map((inputName, i) => {
      const inputDefinition = inputDefinitions[inputName];
      const label = inputDefinition.label || inputName;

      if (inputDefinition.type === "number") {
        const value = inputs[inputName] as number;
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <input
                className="form-control"
                type="text"
                value={value}
                onChange={e =>
                  this.props.onChange([inputName], Number(e.target.value) || 0)
                }
              />
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "boolean") {
        const value = inputs[inputName] as boolean;
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <input
                type="checkbox"
                checked={value}
                onChange={e =>
                  this.props.onChange([inputName], e.target.checked)
                }
              />
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "string") {
        const value = inputs[inputName] as string;
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <input
                className="form-control"
                type="text"
                value={value}
                onChange={e => this.props.onChange([inputName], e.target.value)}
              />
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "attribute") {
        const value = inputs[inputName] as {
          device: string;
          attribute: string;
        };
        return (
          <tr key={i}>
            <td colSpan={2}>
              {label}
              <div style={{ marginLeft: "0.5em" }}>
                <AttributeSelect
                  device={value.device}
                  attribute={value.attribute}
                  dataFormat={inputDefinition.dataFormat}
                  dataType={inputDefinition.dataType}
                  onSelect={(device, attribute) =>
                    this.props.onChange([inputName], {
                      device,
                      attribute
                    })
                  }
                />
              </div>
            </td>
          </tr>
        );
      } else if (
        inputDefinition.type === "complex" &&
        inputDefinition.repeat === true
      ) {
        const value = inputs[inputName] as IInputMapping[];
        return (
          <tr key={i}>
            <td colSpan={2}>
              {label}
              {value.map((each, j) => (
                <div
                  key={j}
                  style={{
                    padding: "0.5em",
                    backgroundColor: "#f4f4f4",
                    borderRadius: "0.25em",
                    marginBottom: "0.5em"
                  }}
                >
                  <button
                    className="close float-left"
                    type="button"
                    onClick={() => this.props.onDelete([inputName, j])}
                  >
                    <span>&times;</span>
                  </button>
                  <InputList
                    inputDefinitions={inputDefinition.inputs}
                    inputs={each}
                    onChange={(path2, value2) => {
                      this.props.onChange([inputName, j, ...path2], value2);
                    }}
                    onDelete={path2 =>
                      this.props.onDelete([inputName, j, ...path2])
                    }
                    onAdd={path => null /* ??? */}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  // Doesn't support more than one degree of nesting
                  this.props.onAdd([inputName]);
                }}
              >
                +
              </button>
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "select") {
        const value = inputs[inputName] as string[];
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <select
                className="form-control"
                value={value}
                onChange={e =>
                  this.props.onChange([inputName], e.currentTarget.value)
                }
              >
                {inputDefinition.options.map((option, j) => (
                  <option key={j} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        );
      }

      return <pre key={i}>{JSON.stringify(inputDefinition)}</pre>;
    });

    return (
      <table style={{ width: "100%" }}>
        <tbody>{inner}</tbody>
      </table>
    );
  }
}

interface IProps {
  tangoDB: string;
  onDeviceChange: any;
  onAttributeChange: any;
  onDeviceRemove: any;
  onParamChange: any;
  widget: IWidget;
  widgetDefinitions: any;
  isRootCanvas: boolean;
  onSetInput: (path: IndexPath, value: any) => void;
  onDeleteInput: (path: IndexPath) => void;
  onAddInput: (path: IndexPath) => void;
}

class Inspector extends Component<IProps> {
  // public deviceChooser(deviceName, index) {
  //   return (
  //     <td>
  //       <select
  //         className="form-control"
  //         value={deviceName || ""}
  //         onChange={e => this.handleSelectDevice(e, index)}
  //       >
  //         {deviceName == null && (
  //           <option value="none" disabled={true}>
  //             None
  //           </option>
  //         )}
  //         {this.props.isRootCanvas === false && (
  //           <option value="__parent__">Parent Device</option>
  //         )}
  //         {this.state.deviceNames.map((name, i) => (
  //           <option key={i} value={name}>
  //             {name}
  //           </option>
  //         ))}
  //       </select>
  //     </td>
  //   );
  // }

  // public attributeChooser(device, attribute, definition, index) {
  //   return device === "__parent__" ? (
  //     <input
  //       className="form-control"
  //       type="text"
  //       value={attribute || ""}
  //       onChange={e => this.handleSelectAttribute(e, index)}
  //     />
  //   ) : (
  //     <select
  //       className="form-control"
  //       value={attribute || ""}
  //       onChange={e => this.handleSelectAttribute(e, index)}
  //       disabled={device == null}
  //     >
  //       {attribute == null && (
  //         <option value="" disabled={true}>
  //           {device ? "None" : "Select Device First"}
  //         </option>
  //       )}
  //       {this.state.attributes[device] &&
  //         this.filteredAttributes(definition, device).map(({ name }, i) => (
  //           <option key={i} value={name}>
  //             {name}
  //           </option>
  //         ))}
  //     </select>
  //   );
  // }

  public render() {
    const { widget } = this.props;
    const definitions = widgetBundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widget.type);

    if (definition == null) {
      return null;
    }

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        <InputList
          inputDefinitions={definition.inputs}
          inputs={widget.inputs}
          onChange={(path, value) => this.props.onSetInput(path, value)}
          onDelete={path => this.props.onDeleteInput(path)}
          onAdd={path => this.props.onAddInput(path)}
        />
        <hr />
        <pre>{JSON.stringify(this.props.widget, null, 2)}</pre>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetInput: (path: IndexPath, value: any) =>
      dispatch({ type: SET_INPUT, path, value }),
    onAddInput: (path: IndexPath) => dispatch({ type: ADD_INPUT, path }),
    onDeleteInput: (path: IndexPath) => dispatch({ type: DELETE_INPUT, path })
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Inspector);
