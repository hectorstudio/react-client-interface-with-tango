import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import queryString from "query-string";
import { connect } from "react-redux";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";

import { save as saveToRepo } from "../dashboardRepo";
import { load as loadFromRepo } from "../dashboardRepo";

import { complexWidgetDefinition } from "./ComplexWidget/ComplexWidget";

import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import {
  SELECT_WIDGET,
  DELETE_WIDGET,
  ADD_WIDGET,
  TOGGLE_MODE
} from "../state/actionTypes";

import "./Dashboard.css";
import { DeviceProvider } from "./DevicesProvider";

const GRID_TILE_SIZE = 15;
const DEFAULT_CANVASES = [
  {
    id: 0,
    name: "Root",
    widgets: []
  },
  {
    id: 1,
    name: "Subcanvas 1",
    widgets: []
  },
  {
    id: 2,
    name: "Subcanvas 2",
    widgets: []
  },
  {
    id: 3,
    name: "Subcanvas 3",
    widgets: []
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedCanvasIndex: 0,
      canvases: DEFAULT_CANVASES
    };

    // const id = this.parseId();
    // if (id) {
    //   loadFromRepo(id).then(res => {
    //     if (res) {
    //       this.setState({ canvases: res.canvases });
    //     }
    //   });
    // }

    this.toggleMode = this.toggleMode.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
    this.handleSelectWidget = this.handleSelectWidget.bind(this);
    this.handleDeleteWidget = this.handleDeleteWidget.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleChangeCanvas = this.handleChangeCanvas.bind(this);
  }

  // parseId() {
  //   const search = this.props.location.search;
  //   const parsed = queryString.parse(search);
  //   return parsed.id || "";
  // }

  // componentDidUpdate() {
  //   var id = this.parseId();
  //   saveToRepo(id, this.state.canvases)
  //     .then(res => {
  //       if (res.created) {
  //         this.props.history.replace("?id=" + res.id);
  //       }
  //     })
  //     .catch(function() {
  //       console.log("Couldn't reach dashboard repo");
  //     });
  // }

  toggleMode() {
    this.props.dispatch({ type: TOGGLE_MODE });
  }

  handleSelectWidget(index) {
    this.props.dispatch({ type: SELECT_WIDGET, index });
  }

  handleDeleteWidget(index) {
    this.props.dispatch({ type: DELETE_WIDGET, index });
  }

  handleAddWidget(definition, x, y) {
    this.props.dispatch({ type: ADD_WIDGET, x, y, definition });
  }

  handleParamChange(param, value) {
    this.props.dispatch({ type: SET_WIDGET_PARAM, param, value });
  }

  handleChangeCanvas(event) {
    const selectedCanvasIndex = parseInt(event.target.value, 10);
    this.setState({ selectedCanvasIndex });
  }

  isRootCanvas() {
    return this.state.selectedCanvasIndex === 0;
  }

  render() {
    const { mode, widgets, areAllValid } = this.props;
    const { tangoDB } = this.props.match.params;

    return (
      <div className="Dashboard">
        <DeviceProvider tangoDB={tangoDB}>
          <LogInOut />
          <LoginDialog />
          <div className="TopBar">
            <form className="form-inline">
              <button
                type="button"
                onClick={this.toggleMode}
                style={{
                  fontSize: "small",
                  width: "2.5em",
                  textAlign: "center"
                }}
                className={classNames("form-control fa", {
                  "fa-play": mode === "edit",
                  "fa-pause": mode === "run"
                })}
                disabled={!areAllValid || !this.isRootCanvas()}
              />
              <select
                className="form-control"
                style={{
                  marginLeft: "0.5em",
                  height: "2em"
                }}
                onChange={this.handleChangeCanvas}
              >
                {this.state.canvases.map((canvas, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? "Root" : canvas.name}
                  </option>
                ))}
              </select>
              {false && (
                <button
                  onClick={() => alert(JSON.stringify(this.state.canvases))}
                >
                  Dump
                </button>
              )}
            </form>
          </div>
          <div className={classNames("CanvasArea", mode)}>
            {mode === "edit" ? (
              <EditCanvas
                widgetsOld={widgets}
                onMoveWidget={this.handleMoveWidget}
                onSelectWidget={this.handleSelectWidget}
                onDeleteWidget={this.handleDeleteWidget}
                selectedWidgetIndex={this.state.selectedWidgetIndex}
                onAddWidget={this.handleAddWidget}
              />
            ) : (
              <RunCanvas
                widgets={widgets}
                tangoDB={tangoDB}
              />
            )}
          </div>
          {mode === "edit" && (
            <div className="Sidebar">
              {this.props.selectedWidgetIndex === -1 ? (
                <Library showCustom={this.state.selectedCanvasIndex === 0} />
              ) : (
                <Inspector
                  widget={this.props.selectedWidget}
                  deviceNames={this.state.deviceNames}
                  onParamChange={this.handleParamChange}
                  onDeviceChange={this.handleDeviceChange}
                  onDeviceRemove={this.handleDeviceRemove}
                  onAttributeChange={this.handleAttributeChange}
                  isRootCanvas={this.isRootCanvas()}
                  tangoDB={tangoDB}
                />
              )}
            </div>
          )}
        </DeviceProvider>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { widgets, selectedIndex } = state.widgets;
  const selectedWidget = widgets[selectedIndex];
  const areAllValid = widgets.reduce(
    (prev, widget) => prev && widget.valid,
    true
  );

  return {
    widgets,
    selectedWidget,
    selectedWidgetIndex: selectedIndex,
    areAllValid,
    mode: state.ui.mode
  };
}

export default connect(mapStateToProps)(
  DragDropContext(HTML5Backend)(Dashboard)
);
