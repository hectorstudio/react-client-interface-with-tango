import React, { Component } from "react";
import { Widget, Dashboard } from "../types";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DashboardLayers.css";
import { Dispatch } from "redux";
import {
  selectWidgets,
  reorderWidgets,
  deleteWidget
} from "../state/actionCreators";
import { getWidgets, getSelectedDashboard } from "../state/selectors";

interface Props {
  selectedDashboard: Dashboard;
  widgets: Widget[];
  onSelectWidgets: (ids: string[]) => void;
  onReorderWidget: (widgets: Widget[]) => void;
  onDeleteWidget: () => void;
}
/**
 * work in progress, currently only listing the type of each widget. Planned features are described in https://gitlab.com/MaxIV/webjive-features/issues/27
 */
class DashboardLayers extends Component<Props> {
  public render() {
    const { widgets, selectedDashboard } = this.props;
    return (
      <div>
        <small>
          <i>
            WIP, details{" "}
            <a
              href="https://gitlab.com/MaxIV/webjive-features/issues/27"
              target="_blank"
            >
              here
            </a>
          </i>
        </small>
        <div style={{ maxHeight: "400px", overflow: "scroll" }}>
          {widgets
            //.sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .map((widget, index) => (
              <this.WidgetLayer
                key={widget.id}
                id={widget.id}
                widget={widget}
                selected={selectedDashboard.selectedIds.includes(widget.id)}
              />
            ))}
        </div>
        <Button
          title="Delete selected layers"
          onClick={this.props.onDeleteWidget}
          disabled={selectedDashboard.selectedIds.length === 0}
          className="btn btn-outline-secondary btn-sm"
          style={{ fontSize: "1.2em", marginRight: "0.5em", border: "none" }}
        >
          <FontAwesomeIcon icon="trash" />{" "}
        </Button>
        <Button
          title="Group selected layers"
          onClick={() => window.alert("not implemented yet")}
          disabled={selectedDashboard.selectedIds.length < 2}
          className="btn btn-outline-secondary btn-sm"
          style={{ fontSize: "1.2em", marginRight: "0.5em", border: "none" }}
        >
          <FontAwesomeIcon icon="layer-group" />{" "}
        </Button>
      </div>
    );
  }
  // findNearest = (id: string, up: boolean) => {
  //   const { widgets } = this.props;
  //   const sortedObjects = widgets
  //     .map(widget => parseInt(widget.id))
  //     .sort((a, b) => a - b);
  //   const indexOfId = sortedObjects.findIndex(x => x === parseInt(id));
  //   if (up && sortedObjects[indexOfId - 1]) {
  //     return sortedObjects[indexOfId - 1].toString();
  //   }
  //   if (!up && sortedObjects[indexOfId + 1]) {
  //     return sortedObjects[indexOfId + 1].toString();
  //   }
  //   return "-1";
  // };
  selectLayer = (e: any, id: string) => {
    const { selectedIds } = this.props.selectedDashboard;
    let ids: string[] = [];
    if (!e.shiftKey) {
      ids = [id];
    } else {
      if (selectedIds.includes(id)) {
        //deselect the layer
        ids = selectedIds.filter(x => x !== id);
      } else {
        //add the layer
        ids = selectedIds.concat([id]);
      }
    }
    this.props.onSelectWidgets(ids);
    this.setState({ selectedLayers: ids });
  };
  // moveWidget = (id: string, up: boolean) => {
  //   const { widgets, selectedDashboard } = this.props;
  //   const sourceIndex = widgets.findIndex(widget => widget.id === id);
  //   const targetId = up
  //     ? this.findNearest(id, true)
  //     : this.findNearest(id, false);
  //   const targetIndex = widgets.findIndex(widget => widget.id === targetId);
  //   if (!widgets[targetIndex]) {
  //     return;
  //   }
  //   widgets[sourceIndex].id = targetId;
  //   widgets[targetIndex].id = id;

  //   //selection should alway be copied between layers:
  //   const { selectedIds } = selectedDashboard;
  //   const isSourceSelected = selectedIds.includes(id);
  //   const isTargetSelected = selectedIds.includes(targetId);
  //   let newSelectedIds = [...selectedIds]
  //   if (!isSourceSelected){
  //     newSelectedIds = newSelectedIds.filter(x => x !== targetId)
  //   }
  //   if (isSourceSelected && !newSelectedIds.includes(targetId)){
  //     newSelectedIds.push(targetId);
  //   }
  //   if (!isTargetSelected){
  //     newSelectedIds = newSelectedIds.filter(x => x !== id)
  //   }
  //   if (isTargetSelected && !newSelectedIds.includes(id)){
  //     newSelectedIds.push(id);
  //   }
  //   this.props.onReorderWidget(widgets, newSelectedIds);
  // };
  WidgetLayer = ({ id, widget, selected }) => {
    const label = widget.type.split("_").join(" ");
    let renderString = "";
    const inputs = widget.inputs;

    if (inputs.text !== undefined) {
      if (inputs.text) {
        renderString = inputs.text;
      } else {
        renderString = "No text";
      }
    } else if (inputs.attribute) {
      if (!inputs.attribute.device || !inputs.attribute.attribute) {
        renderString = "Undefined";
      } else {
        renderString =
          inputs.attribute.device + ":" + inputs.attribute.attribute;
      }
    } else if (inputs.command) {
      renderString = inputs.command.device + ":" + inputs.command.command;
    } else if (inputs.device) {
      renderString = inputs.device;
    } else if (inputs.attributes) {
      renderString = inputs.attributes.length + " attributes";
    } else {
    }
    if (renderString.length > 40) {
      renderString = renderString.slice(0, 37) + "...";
    }
    const selectedCss = selected ? "selected" : "";
    return (
      <div className={"widget-layer " + selectedCss}>
        <div style={{ float: "right" }}>
          <Button
            title="Move this layer up"
            className="btn arrow-button"
            // onClick={() => this.moveWidget(id, true)}
            onClick={() =>
              window.alert(
                "Need to add order:int to database before implementing this"
              )
            }
          >
            <FontAwesomeIcon icon="arrow-alt-circle-up" />{" "}
          </Button>
          <Button
            title="Move this layers down"
            className="btn arrow-button"
            onClick={() =>
              window.alert(
                "Need to add order:int to database before implementing this"
              )
            }
            // onClick={() => this.moveWidget(id, false)}
          >
            <FontAwesomeIcon icon="arrow-alt-circle-down" />{" "}
          </Button>
        </div>
        <div className="layer-content" onClick={e => this.selectLayer(e, id)}>
          <span className="label">
            {label} {widget.width}×{widget.height}
          </span>
          <div style={{ fontSize: "0.8em" }}>{renderString}</div>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state: RootState) {
  return {
    selectedDashboard: getSelectedDashboard(state),
    widgets: getWidgets(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSelectWidgets: (ids: string[]) => dispatch(selectWidgets(ids)),
    onReorderWidget: (widgets: Widget[]) => dispatch(reorderWidgets(widgets)),
    onDeleteWidget: () => dispatch(deleteWidget())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardLayers);
