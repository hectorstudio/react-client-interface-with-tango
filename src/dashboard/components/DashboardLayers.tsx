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
import { moveSingleOrderIndex } from "../state/reducers/selectedDashboard/lib";

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
        <div style={{ maxHeight: "400px", overflow: "scroll", overflowX: "hidden" }}>
          {widgets
            .sort((a, b) => a.order - b.order)
            .map((widget) => (
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
          className="btn btn-outline-secondary btn-sm btn-layer-action"
        >
          <FontAwesomeIcon icon="trash" />{" "}
        </Button>
        <Button
          title="Group selected layers"
          onClick={() => window.alert("not implemented yet")}
          disabled={selectedDashboard.selectedIds.length < 2}
          className="btn btn-outline-secondary btn-sm btn-layer-action"
        >
          <FontAwesomeIcon icon="layer-group" />{" "}
        </Button>
      </div>
    );
  }
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
  };
  moveWidget = (order: number, up: boolean) => {
    const { widgets } = this.props;
    const newWidgets = moveSingleOrderIndex(widgets, order, up);
    this.props.onReorderWidget(newWidgets);
  };
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
            onClick={() => this.moveWidget(widget.order, true)}
          >
            <FontAwesomeIcon icon="arrow-alt-circle-up" />{" "}
          </Button>
          <Button
            title="Move this layers down"
            className="btn arrow-button"
            onClick={() => this.moveWidget(widget.order, false)}
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
