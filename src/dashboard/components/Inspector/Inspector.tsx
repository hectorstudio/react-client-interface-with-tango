import React, { Component } from "react";

import AttributeSelect from "./AttributeSelect";
import {
  IInputDefinitionMapping,
  IInputMapping,
  INewDefinition,
  IWidget
} from "./types";

type IndexPath = Array<string | number>;

class InputList extends Component<{
  inputDefinitions: IInputDefinitionMapping;
  inputs: IInputMapping;
  onChange: (inputPath: IndexPath, value) => void;
  basePath?: string[];
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
        inputDefinition.repeat === false
      ) {
        const value = inputs[inputName] as IInputMapping;
        return (
          <tr key={i}>
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
                  <InputList
                    inputDefinitions={inputDefinition.inputs}
                    inputs={each}
                    onChange={(path2, value2) => {
                      this.props.onChange([inputName, j, ...path2], value2);
                    }}
                  />
                </div>
              ))}
              <button type="button">+</button>
            </td>
          </tr>
        );
      } else if (inputDefinition.type === "select") {
        const value = inputs[inputName] as string[];
        return (
          <tr key={i}>
            <td>{label}</td>
            <td>
              <select className="form-control" defaultValue={value}>
                {inputDefinition.options.map(({ name }, j) => (
                  <option key={j}>{name}</option>
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
              attribute: {
                device: "sys/tg_test/1",
                attribute: "ampli"
              },
              strokeStyle: "line",
              strokeWidth: 3
            },
            {
              attribute: {
                device: "sys/tg_test/1",
                attribute: "ampli"
              },
              strokeStyle: "dashed",
              strokeWidth: 10
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
            const updatedInputs = copySetWithIndexPath(
              this.state.widget.inputs,
              path,
              value
            );
            const updatedWidget = {
              ...this.state.widget,
              inputs: updatedInputs
            };

            // alert(JSON.stringify(updatedWidget, null, 2));
            this.setState({ widget: updatedWidget });
          }}
        />
        <hr />
        <pre>{JSON.stringify(inputs, null, 2)}</pre>
      </div>
    );
  }
}

function copySetWithIndexPath(obj: object, path: IndexPath, value: any) {
  const [head, ...tail] = path;
  const replacement =
    tail.length > 0 ? copySetWithIndexPath(obj[head], tail, value) : value;
  if (Array.isArray(obj)) {
    const copy = obj.concat();
    copy[head] = replacement;
    return copy;
  } else {
    return { ...obj, [head]: replacement };
  }
}
