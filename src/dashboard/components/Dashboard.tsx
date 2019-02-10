import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import EditCanvas from "./EditCanvas/EditCanvas";
import Library from "./Library/Library";
import RunCanvas from "./RunCanvas/RunCanvas";
import Inspector from "./Inspector/Inspector";
import { DeviceProvider } from "./DevicesProvider";

// import queryString from "query-string";
// import { save as saveToRepo } from "../dashboardRepo";
// import { load as loadFromRepo } from "../dashboardRepo";

import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import {
  getWidgets,
  getMode,
  getCanvases,
  getSelectedCanvas,
  getSelectedWidgets
} from "../state/selectors";

import { selectCanvas, toggleMode } from "../state/actionCreators";
import { Widget, Canvas } from "../types";
import { RootState } from "../state/reducers";

import "./Dashboard.css";

interface Match {
  tangoDB: string;
}

interface Props extends RouteComponentProps<Match> {
  dispatch: (action: object) => void;
  mode: "edit" | "run";
  widgets: Widget[];
  selectedWidgets: Widget[];
  canvases: Canvas[];
  selectedCanvas: Canvas;
}

class Dashboard extends Component<Props> {
  public constructor(props) {
    super(props);

    // const id = this.parseId();
    // if (id) {
    //   loadFromRepo(id).then(res => {
    //     if (res) {
    //       this.setState({ canvases: res.canvases });
    //     }
    //   });
    // }

    this.toggleMode = this.toggleMode.bind(this);
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
    const { mode, widgets, selectedWidgets } = this.props;
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
                value={this.props.selectedCanvas.id}
                onChange={this.handleChangeCanvas}
              >
                {this.props.canvases.map((canvas, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? "Root" : canvas.name}
                  </option>
                ))}
              </select>
            </form>
          </div>
          <div className={classNames("CanvasArea", mode)}>
            {mode === "edit" ? (
              <EditCanvas />
            ) : (
              <RunCanvas widgets={widgets} tangoDB={tangoDB} />
            )}
          </div>
          {mode === "edit" && (
            <div className="Sidebar">
              {selectedWidgets.length === 0 ? (
                <Library />
              ) : selectedWidgets.length === 1 ? (
                <Inspector
                  widget={selectedWidgets[0]}
                  isRootCanvas={this.isRootCanvas()}
                  tangoDB={tangoDB}
                />
              ) : (
                "Multiple selection"
              )}
            </div>
          )}
        </DeviceProvider>
      </div>
    );
  }

  private toggleMode() {
    this.props.dispatch(toggleMode());
  }

  private handleChangeCanvas(event) {
    const id = event.target.value;
    this.props.dispatch(selectCanvas(id));
  }

  private isRootCanvas() {
    return this.props.selectedCanvas.id === "0";
  }

  private areAllValid() {
    const { widgets } = this.props;
    return widgets.reduce((prev, widget) => prev && widget.valid, true);
  }
}

function mapStateToProps(state: RootState) {
  return {
    widgets: getWidgets(state),
    selectedWidgets: getSelectedWidgets(state),
    mode: getMode(state),
    selectedCanvas: getSelectedCanvas(state),
    canvases: getCanvases(state)
  };
}

export default connect(mapStateToProps)(
  DragDropContext(HTML5Backend)(Dashboard)
);
