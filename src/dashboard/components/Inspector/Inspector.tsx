import React, { Component } from "react";
import { connect } from "react-redux";

import { IndexPath, Widget } from "../../types";

import { bundles } from "../../widgets";

import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";
import InputList from "./InputList";

interface Props {
  tangoDB: string;
  widget: Widget;
  isRootCanvas: boolean;
  onSetInput: (path: IndexPath, value: any) => void;
  onDeleteInput: (path: IndexPath) => void;
  onAddInput: (path: IndexPath) => void;
}

class Inspector extends Component<Props> {
  public render() {
    const { widget, tangoDB } = this.props;
    const definitions = bundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widget.type);

    if (definition == null) {
      return null;
    }

    return (
      <div className="Inspector">
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
