import React, { Component } from "react";
import { connect } from "react-redux";
<<<<<<< HEAD
import { IndexPath, Widget } from "../../types";
import { bundles } from "../../widgets";
import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";
import InputList from "./InputList";

const MultipleSelection = () => (
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
interface Props {
  tangoDB: string;
  widgets: Widget[];
  isRootCanvas: boolean;
  nbrSelectedWidgets: number;
  render: boolean;
=======

import { IndexPath, Widget } from "../../types";

import { bundles } from "../../widgets";

import { DELETE_INPUT, ADD_INPUT, SET_INPUT } from "../../state/actionTypes";
import InputList from "./InputList";

interface Props {
  tangoDB: string;
  widget: Widget;
  isRootCanvas: boolean;
>>>>>>> origin/master
  onSetInput: (path: IndexPath, value: any) => void;
  onDeleteInput: (path: IndexPath) => void;
  onAddInput: (path: IndexPath) => void;
}

class Inspector extends Component<Props> {
  public render() {
<<<<<<< HEAD
    if (!this.props.render){
      return null;
    }
    const { widgets, tangoDB } = this.props;
    const definitions = bundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widgets[0].type);
    
    if (definition == null) {
      return null;
    }
    const isSameTypeOfWidget = widgets.reduce((acc, curr) => acc && curr.type === widgets[0].type, true);

    return isSameTypeOfWidget? (
=======
    const { widget, tangoDB } = this.props;
    const definitions = bundles.map(bundle => bundle.definition);
    const definition = definitions.find(({ type }) => type === widget.type);

    if (definition == null) {
      return null;
    }

    return (
>>>>>>> origin/master
      <div className="Inspector">
        <InputList
          tangoDB={tangoDB}
          inputDefinitions={definition.inputs}
<<<<<<< HEAD
          inputs={widgets[0].inputs}
=======
          inputs={widget.inputs}
>>>>>>> origin/master
          onChange={(path, value) => this.props.onSetInput(path, value)}
          onDelete={path => this.props.onDeleteInput(path)}
          onAdd={path => this.props.onAddInput(path)}
        />
      </div>
<<<<<<< HEAD
    ):(
      <MultipleSelection/>
    )
=======
    );
>>>>>>> origin/master
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
