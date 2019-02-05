import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { connect } from "react-redux";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";

// import queryString from "query-string";
// import { save as saveToRepo } from "../dashboardRepo";
// import { load as loadFromRepo } from "../dashboardRepo";

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
import { getWidgets, getMode, getSelectedWidget } from "../state/selectors";
import { IWidget, IWidgetDefinition } from "../types";
import { RouteComponentProps } from "react-router";

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

interface IMatch {
  tangoDB: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  dispatch: (action: object) => void;
  mode: "edit" | "run";
  widgets: IWidget[];
  selectedWidget: IWidget;
}

interface IState {
  canvases: typeof DEFAULT_CANVASES;
  selectedCanvasIndex: number;
}

class Dashboard extends Component<IProps, IState> {
  public constructor(props) {
    super(props);

    this.state = {
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

  public render() {
    const { mode, widgets, selectedWidget } = this.props;
    const { tangoDB } = this.props.match.params;
    const disabled = !this.areAllValid() || !this.isRootCanvas();

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
                disabled={disabled}
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
                onSelectWidget={this.handleSelectWidget}
                onDeleteWidget={this.handleDeleteWidget}
                selectedWidget={this.props.selectedWidget}
                onAddWidget={this.handleAddWidget}
              />
            ) : (
              <RunCanvas widgets={widgets} tangoDB={tangoDB} />
            )}
          </div>
          {mode === "edit" && (
            <div className="Sidebar">
              {selectedWidget == null ? (
                <Library />
              ) : (
                <Inspector
                  widget={selectedWidget}
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

  private toggleMode() {
    this.props.dispatch({ type: TOGGLE_MODE });
  }

  private handleSelectWidget(id: string) {
    this.props.dispatch({ type: SELECT_WIDGET, id });
  }

  private handleDeleteWidget(id: string) {
    this.props.dispatch({ type: DELETE_WIDGET, id });
  }

  private handleAddWidget(definition: IWidgetDefinition, x: number, y: number) {
    this.props.dispatch({ type: ADD_WIDGET, x, y, definition });
  }

  private handleChangeCanvas(event) {
    const selectedCanvasIndex = parseInt(event.target.value, 10);
    this.setState({ selectedCanvasIndex });
  }

  private isRootCanvas() {
    return this.state.selectedCanvasIndex === 0;
  }

  private areAllValid() {
    const { widgets } = this.props;
    return widgets.reduce((prev, widget) => prev && widget.valid, true);
  }
}

function mapStateToProps(state) {
  return {
    widgets: getWidgets(state),
    selectedWidget: getSelectedWidget(state),
    mode: getMode(state)
  };
}

export default connect(mapStateToProps)(
  DragDropContext(HTML5Backend)(Dashboard)
);
