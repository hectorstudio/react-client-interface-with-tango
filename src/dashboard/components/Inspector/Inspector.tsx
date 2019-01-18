import React, { Component } from "react";

import AttributeSelect from "./AttributeSelect";

interface IBaseInputDefinition {
  label: string;
  repeat: boolean;
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
  type: string;
  [input: string]: any;
}

interface IInputMapping {
  [name: string]: any;
}

class InputList extends Component<{
  inputDefinitions: IInputDefinitionMapping;
  inputs: IInputMapping;
  onChange: (inputPath: string[], value) => void;
  basePath?: string[];
}> {
  public render() {
    const { inputDefinitions, inputs } = this.props;
    const inputNames = Object.keys(inputDefinitions);

    const inner = inputNames.map((inputName, i) => {
      const inputDefinition = inputDefinitions[inputName];
      const label = inputDefinition.label || inputName;
      const value = inputs[inputName];

      if (inputDefinition.type === "number") {
        return (
          <tr>
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
        return (
          <tr>
            <td>{label}</td>
            <td>
              <input
                className="form-control"
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
        return (
          <tr>
            <td> {label}</td>
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
        return (
          <tr>
            <td colSpan={2}>
              {label}
              <AttributeSelect
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
        inputDefinition.repeat === false
      ) {
        return (
          <tr>
            <td colSpan={2}>
              {label}
              <div style={{ marginLeft: "1em" }}>
                <InputList
                  inputDefinitions={inputDefinition.inputs}
                  inputs={value}
                  onChange={(path2, value2) => {
                    this.props.onChange([inputName, ...path2], value2);
                  }}
                />
              </div>
            </td>
          </tr>
        );
      } else if (
        inputDefinition.type === "complex" &&
        inputDefinition.repeat === true
      ) {
        return (
          <tr>
            <td colSpan={2}>
              {label}
              {value.map((each, j) => (
                <div>
                  <InputList
                    key={j}
                    inputDefinitions={inputDefinition.inputs}
                    inputs={each}
                    onChange={(path2, value2) => {
                      this.props.onChange([inputName, ...path2], value2);
                    }}
                  />
                </div>
              ))}
              <button type="button">+</button>
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "select") {
        return (
          <tr>
            <td>{label}</td>
            <td>
              <select className="form-control" value={value}>
                {inputDefinition.options.map(({ name }) => (
                  <option>{name}</option>
                ))}
              </select>
            </td>
          </tr>
        );
      }

      return <pre key={i}>{JSON.stringify(inputDefinition)}</pre>;
    });

    return <table style={{ width: "100%" }}>{inner}</table>;
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
  widget: any;
}

export default class Inspector extends Component<IProps, IState> {
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

  public constructor(props) {
    super(props);
    this.state = {
      widget: {
        type: "ATTRIBUTE_PLOTTER",
        x: 100,
        y: 200,
        inputs: {
          xMin: -10,
          xMax: 10,
          yMin: -10,
          yMax: 10,
          showGrid: true,
          attributes: [
            {
              device: "sys/tg_test/1",
              attribute: "ampli",
              strokeStyle: "line"
            },
            {
              device: "sys/tg_test/1",
              attribute: "ampli",
              strokeStyle: "dashed"
            }
          ]
        }
      }
    };
  }

  public render() {
    const { newDefinition: definition } = this.props;
    const {
      widget: { inputs }
    } = this.state;

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        <InputList
          inputDefinitions={definition.inputs}
          inputs={inputs}
          onChange={(path, value) => {
            const updatedInputs = copySetWithPath(
              this.state.widget.inputs,
              path,
              value
            );
            const updatedWidget = {
              ...this.state.widget,
              inputs: updatedInputs
            };
            this.setState({ widget: updatedWidget });
          }}
        />
        <hr />
        <pre>{JSON.stringify(this.state.widget, null, 2)}</pre>
      </div>
    );
  }
}

function copySetWithPath(obj, path, value) {
  const [head, ...tail] = path;
  const replacement =
    tail.length > 0 ? copySetWithPath(obj[head], tail, value) : value;
  return { ...obj, [head]: replacement };
}
