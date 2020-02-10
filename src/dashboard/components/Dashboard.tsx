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
import { saveDashboard } from "../state/actionCreators";
import { loadDashboard } from "../state/actionCreators";
import LoginDialog from "../../shared/user/components/LoginDialog/LoginDialog";

import {
  getWidgets,
  getMode,
  getCanvases,
  getSelectedCanvas,
  getSelectedWidgets,
  getSelectedDashboard
} from "../state/selectors";

import { toggleMode } from "../state/actionCreators";
import { Widget, Canvas, Dashboard as DashboardInterface } from "../types";
import { RootState } from "../state/reducers";

import "./Dashboard.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
<<<<<<< HEAD
import NewSideBar from "./NewSideBar";

=======
>>>>>>> origin/master

interface Match {
  tangoDB: string;
}

interface Props extends RouteComponentProps<Match> {
  toggleMode: () => void;
  loadDashboard: (id: string) => void;
  saveDashboard: (id: string, name: string, widgets: Widget[]) => void;
  mode: "edit" | "run";
  widgets: Widget[];
  selectedWidgets: Widget[];
  canvases: Canvas[];
  selectedCanvas: Canvas;
  selectedDashboard: DashboardInterface;
  isLoggedIn: boolean;
}

class Dashboard extends Component<Props> {
  public constructor(props) {
    super(props);
    this.toggleMode = this.toggleMode.bind(this);
  }

  public async componentDidMount() {
<<<<<<< HEAD
    const id = this.parseId();
=======
    const redirectId = this.props.selectedDashboard.redirect;
    const id = redirectId ? this.props.selectedDashboard.id : this.parseId();
>>>>>>> origin/master
    if (id) {
      this.props.loadDashboard(id);
    }
  }

  public async componentDidUpdate(prevProps) {
<<<<<<< HEAD
    const {id:currentId, name} = this.props.selectedDashboard;
    const {name:oldName} = prevProps;
    const id = this.parseId();
    if (currentId !== id) {
      if (currentId) {
        this.props.history.replace("?id=" + currentId);
      } else {
        this.props.history.replace("?");
      }
    }
    if (name && name !== oldName){
      document.title = name + " - Webjive";
=======
    // update if url currently is missing and the selcted one has one?
    const redirect = this.props.selectedDashboard.redirect;
    const currentId = this.props.selectedDashboard.id;
    const id = this.parseId();

    if (redirect && currentId !== id) {
      // The state has been updated with a flag indicating that we should navigate
      // to a new dashboard.
      this.props.history.replace("?id=" + this.props.selectedDashboard.id);
      return;
    }
    const justLoggedInOnAnonymous =
      this.props.isLoggedIn && this.props.widgets.length > 0 && !id;

    if (
      JSON.stringify(prevProps.widgets) ===
        JSON.stringify(this.props.widgets) &&
      !justLoggedInOnAnonymous
    ) {
      return;
    }
    if (this.props.isLoggedIn) {
      this.props.saveDashboard(
        id,
        this.props.selectedDashboard.name,
        this.props.widgets
      );
>>>>>>> origin/master
    }
  }

  public render() {
    const { mode, widgets, selectedWidgets } = this.props;
    const { tangoDB } = this.props.match.params;
    const disabled = !this.areAllValid() || !this.isRootCanvas();

    const canvasContents =
      mode === "edit" ? (
        <EditCanvas widgets={widgets} tangoDB={tangoDB} />
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
<<<<<<< HEAD
          {/* <NewSideBar
            mode={mode}
            selectedMenu="DASHBOARD_LIBRARY"
            tangoDB={tangoDB}
            selectedWidgets={selectedWidgets}
          ></NewSideBar> */}
          <Sidebar
            mode={mode}
            selectedTab="dashboards"
=======
          <Sidebar
            mode={mode}
            selectedTab="library"
>>>>>>> origin/master
            tangoDB={tangoDB}
            selectedWidgets={selectedWidgets}
          />
        </DeviceProvider>
      </div>
    );
  }

  private toggleMode() {
    this.props.toggleMode();
  }
  private isRootCanvas() {
    return this.props.selectedCanvas.id === "0";
  }

  private areAllValid() {
    const { widgets } = this.props;
    return widgets.reduce((prev, widget) => prev && widget.valid, true);
  }

  private parseId(): string {
    /* eslint-disable no-restricted-globals */
    const search = location.search;
    const parsed = queryString.parse(search);
    return String(parsed.id || "") || ""; // TODO: improve handling of id parameter
  }
}

function mapStateToProps(state: RootState) {
  return {
    widgets: getWidgets(state),
    selectedDashboard: getSelectedDashboard(state),
    selectedWidgets: getSelectedWidgets(state),
    mode: getMode(state),
    selectedCanvas: getSelectedCanvas(state),
    canvases: getCanvases(state),
    isLoggedIn: getIsLoggedIn(state)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    saveDashboard: (id: string, name: string, widgets: Widget[]) =>
      dispatch(saveDashboard(id, name, widgets)),
    toggleMode: () => dispatch(toggleMode()),
    loadDashboard: (id: string) => dispatch(loadDashboard(id))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragDropContext(HTML5Backend)(Dashboard));
