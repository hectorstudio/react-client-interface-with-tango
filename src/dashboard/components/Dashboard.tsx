import React, { Component } from "react";
import classNames from "classnames";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import queryString from "query-string";

import EditCanvas from "./EditCanvas/EditCanvas";
import RunCanvas from "./RunCanvas/RunCanvas";
import { DeviceProvider } from "./DevicesProvider";

import { save as saveToRepo } from "../dashboardRepo";
import { load as loadFromRepo } from "../dashboardRepo";

import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import {
  getWidgets,
  getMode,
  getCanvases,
  getSelectedCanvas,
  getSelectedWidgets
} from "../state/selectors";

import {
  selectCanvas,
  toggleMode,
  preloadDashboard
} from "../state/actionCreators";
import { Widget, Canvas } from "../types";
import { RootState } from "../state/reducers";

import "./Dashboard.css";
import ModeToggleButton from "./ModeToggleButton";
import Sidebar from "./Sidebar";

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
    this.toggleMode = this.toggleMode.bind(this);
    this.handleChangeCanvas = this.handleChangeCanvas.bind(this);
  }

  public async componentDidMount() {
    const id = this.parseId();
    if (id) {
      try {
        const { widgets } = await loadFromRepo(id);
        this.props.dispatch(preloadDashboard(id, widgets));
      } catch (err) {
        // console.error(`Failed loading dashboard ${id}: ${err}`);
      }
    }
  }

  public async componentDidUpdate(prevProps) {
    if (prevProps.widgets === this.props.widgets) {
      return;
    }

    const id = this.parseId();
    const res = await saveToRepo(id, this.props.widgets);
    if (res && res.created) {
      this.props.history.replace("?id=" + res.id);
    }
  }

  public render() {
    const { mode, widgets, selectedWidgets } = this.props;
    const { tangoDB } = this.props.match.params;
    const disabled = !this.areAllValid() || !this.isRootCanvas();

    const canvasContents =
      mode === "edit" ? (
        <EditCanvas />
      ) : (
        <RunCanvas widgets={widgets} tangoDB={tangoDB} />
      );

    return (
      <div className="Dashboard">
        <LoginDialog />
        <DeviceProvider tangoDB={tangoDB}>
          <div className="TopBar">
            <form className="form-inline">
              <ModeToggleButton
                onClick={this.toggleMode}
                disabled={disabled}
                mode={mode}
              />
              {false && (
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
              )}
            </form>
            <LogInOut />
          </div>
          <div className={classNames("CanvasArea", mode)}>{canvasContents}</div>
          <Sidebar
            mode={mode}
            tangoDB={tangoDB}
            selectedWidgets={selectedWidgets}
          />
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

  private parseId(): string {
    const search = location.search;
    const parsed = queryString.parse(search);
    return String(parsed.id || "") || ""; // TODO: improve handling of id parameter
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
