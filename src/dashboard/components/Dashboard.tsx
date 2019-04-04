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
import { loadDashboard } from "../state/actionCreators";
import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import {
  getWidgets,
  getMode,
  getCanvases,
  getSelectedCanvas,
  getSelectedWidgets,
  getSelectedDashboard,
  getRedirectRequest
} from "../state/selectors";

import {
  selectCanvas,
  toggleMode,
  dashboardLoaded
} from "../state/actionCreators";
import { Widget, Canvas, Dashboard as DashboardInterface } from "../types";
import { RootState } from "../state/reducers";

import "./Dashboard.css";
import ModeToggleButton from "./ModeToggleButton";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

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
  selectedDashboard: DashboardInterface;
  getRedirectRequest: string;
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
      this.props.dispatch(loadDashboard(this.parseId()));
    }
  }

  public async componentDidUpdate(prevProps) {
    const { getRedirectRequest: redirectId} = this.props;
    const id = this.parseId();
    if (redirectId && redirectId !== id) {
      // The state has been updated with a flag indicating that we should navigate
      // to a new dashboard.
      this.props.history.replace("?id=" + redirectId);
      return;
    }
    if (prevProps.widgets === this.props.widgets) {
      return;
    }

    try {
      const res = await saveToRepo(id, this.props.widgets);
      if (res && res.created) {
        this.props.history.replace("?id=" + res.id);
      }
    } catch (exception) {
      console.log(exception);
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
          <TopBar
            mode={mode}
            onToggleMode={this.toggleMode}
            modeToggleDisabled={disabled}
          />
          <div className={classNames("CanvasArea", mode)}>{canvasContents}</div>
          <Sidebar
            mode={mode}
            selectedTab="dashboards"
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
    selectedDashboard: getSelectedDashboard(state),
    getRedirectRequest: getRedirectRequest(state),
    selectedWidgets: getSelectedWidgets(state),
    mode: getMode(state),
    selectedCanvas: getSelectedCanvas(state),
    canvases: getCanvases(state)
  };
}

export default connect(mapStateToProps)(
  DragDropContext(HTML5Backend)(Dashboard)
);
