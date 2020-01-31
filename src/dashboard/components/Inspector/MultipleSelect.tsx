import React, { Component } from "react";
import { IndexPath, Widget } from "../../types";
import { widget } from "../../propTypes";
import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";
import { connect } from "react-redux";
import InputList from "./InputList";
import { bundles } from "../../widgets";
interface Props {
  tangoDB: string;
  widgets: Widget[];
  isRootCanvas: boolean;
  nbrSelectedWidgets: number;
  render: boolean;
  onSetInput: (path: IndexPath, value: any) => void;
  onDeleteInput: (path: IndexPath) => void;
  onAddInput: (path: IndexPath) => void;
}

class MultipleSelection extends Component<Props> {
  public render() {
    if (!this.props.render) {
      return null;
    }
    const { widgets, tangoDB } = this.props;
    const definitions = bundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widgets[0].type);

    if (definition == null) {
      return null;
    }

    let isSameTypeOfWidget = true;
    for (let i = 0; i < this.props.nbrSelectedWidgets; i++) {
      isSameTypeOfWidget =
        (isSameTypeOfWidget && (widgets[i].type === widgets[0].type));
      if (!isSameTypeOfWidget) {
        break;
      }
    }

    return isSameTypeOfWidget ? (
      <div className="Inspector">
        {
          <InputList
            tangoDB={tangoDB}
            inputDefinitions={definition.inputs}
            inputs={widgets[0].inputs}
            onChange={(path, value) => this.props.onSetInput(path, value)}
            onDelete={path => this.props.onDeleteInput(path)}
            onAdd={path => this.props.onAddInput(path)}
          />
        }
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%"
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: "lightgray"
          }}
        >
          Multiple selection of different type of widget
        </span>
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
)(MultipleSelection);
