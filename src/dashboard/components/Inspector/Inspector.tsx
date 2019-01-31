import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import {
  IInputDefinitionMapping,
  IInputMapping,
  IWidget,
  IndexPath
} from "../../types";

import { bundles } from "../../newWidgets";

import AttributeSelect from "./AttributeSelect";
import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";

class InputList extends Component<{
  tangoDB: string;
  inputDefinitions: IInputDefinitionMapping;
  inputs: IInputMapping;
  onChange: (path: IndexPath, value) => void;
  onAdd: (path: IndexPath) => void;
  onDelete: (path: IndexPath) => void;
  basePath?: IndexPath;
}> {
  public render() {
    const { inputDefinitions, inputs, tangoDB } = this.props;
    const inputNames = Object.keys(inputDefinitions);

    const inner = inputNames.map((inputName, i) => {
      const inputDefinition = inputDefinitions[inputName];
      const definitionLabel = inputDefinition.label;
      const label = definitionLabel == null ? inputName : definitionLabel;

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
      } else if (inputDefinition.type === "color") {
        const value = inputs[inputName] as string;
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <input
                type="color"
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
              <AttributeSelect
                tangoDB={tangoDB}
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
            </td>
          </tr>
        );
      } else if (
        inputDefinition.type === "complex" &&
        inputDefinition.repeat === true
      ) {
        const value = inputs[inputName] as IInputMapping[];
        return (
          <Fragment>
            <tr key={i}>
              <td>{label}</td>
              <td>
                <button
                  className="btn btn-outline-dark"
                  type="button"
                  onClick={() => {
                    // Doesn't support more than one degree of nesting
                    this.props.onAdd([inputName]);
                  }}
                >
                  <span className="fa fa-plus" />
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                {value.map((each, j) => (
                  <div className="ComplexInput" key={j}>
                    <button
                      className="close"
                      type="button"
                      onClick={() => this.props.onDelete([inputName, j])}
                      style={{
                        width: "1em",
                        height: "1em",
                        borderRadius: "0.5em",
                        position: "absolute",
                        right: "-0.25em",
                        top: "-0.5em",
                        paddingTop: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        outline: "none",
                        zIndex: 2
                      }}
                    >
                      &times;
                    </button>
                    <InputList
                      tangoDB={tangoDB}
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
              </td>
            </tr>
          </Fragment>
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
  public render() {
    const { widget, tangoDB } = this.props;
    const definitions = bundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widget.type);

    if (definition == null) {
      return null;
    }

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        <InputList
          tangoDB={tangoDB}
          inputDefinitions={definition.inputs}
          inputs={widget.inputs}
          onChange={(path, value) => this.props.onSetInput(path, value)}
          onDelete={path => this.props.onDeleteInput(path)}
          onAdd={path => this.props.onAddInput(path)}
        />
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
