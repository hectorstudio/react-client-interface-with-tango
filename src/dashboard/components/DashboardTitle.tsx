import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import {
  getSelectedDashboard,
  getUserName,
  getNotification,
  getMode
} from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import {
  renameDashboard,
  cloneDashboard,
  undo,
  redo
} from "../state/actionCreators";
import { Notification } from "../types";
import { DashboardAction } from "../state/actions";
import { Dispatch } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  dashboard: Dashboard;
  loggedInUser: string;
  notification: Notification;
  mode: "edit" | "run";
  onTitleChange: (id: string, name: string) => void;
  onClone: (id: string, newUser: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

interface State {
  wipName: string | null;
}

// TODO: displaying notifications is outside of the scope of this component and should be factored out at some point, e.g. to TopBar

class DashboardTitle extends Component<Props, State> {
  public inputRef: any;

  constructor(props) {
    super(props);
    this.state = { wipName: null };
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.dashboard !== this.props.dashboard) {
      this.setState({ wipName: null });
    }
  }

  public render() {
    const { dashboard, loggedInUser, mode } = this.props;
    const { id, user: owner } = dashboard;

    const isMine = loggedInUser === owner;
    const inEditMode = mode === "edit";
    const editable = (isMine || !owner) && inEditMode;
    const clonable = !isMine && owner;
    const { level, msg: notificationMsg } = this.props.notification;

    if (!loggedInUser) {
      return (
        <div className="dashboard-menu">
          {id && <span style={{ marginLeft: "0.5em" }}>{dashboard.name}</span>}
          {inEditMode && (
            <span className="notification-msg ">
              You need to be logged in to save dashboards
            </span>
          )}
        </div>
      );
    }

    const { wipName } = this.state;
    const name =
      wipName != null ? wipName : dashboard.name || "Untitled dashboard";
    const redoDisabled = this.props.dashboard.history.redoLength === 0;
    const undoDisabled = this.props.dashboard.history.undoLength === 0;
    return (
      <div className="dashboard-menu">
        <input
          ref={ref => (this.inputRef = ref)}
          type="text"
          value={name}
          disabled={!editable}
          onChange={e => this.setState({ wipName: e.target.value })}
          onKeyPress={e => {
            if (e.key === "Enter" && wipName != null) {
              this.props.onTitleChange(id, wipName);
              e.currentTarget.blur();
            }
          }}
          onBlur={() => this.setState({ wipName: null })}
          onFocus={() => this.inputRef.select()}
        />
        <button
          style={{
            padding: "0.25em 0.5em",
            borderRadius: "0.25em",
            backgroundColor: "white",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            cursor: undoDisabled ? "not-allowed" : "pointer"
          }}
          title="Undo last action"
          onClick={this.props.onUndo}
          disabled={undoDisabled}
        >
          <FontAwesomeIcon icon="undo" />
        </button>
        <button
          style={{
            padding: "0.25em 0.5em",
            borderRadius: "0.25em",
            backgroundColor: "white",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            cursor: redoDisabled ? "not-allowed" : "pointer"
          }}
          title="Redo last action"
          onClick={this.props.onRedo}
          disabled={redoDisabled}
        >
          <FontAwesomeIcon icon="redo" />
        </button>
        {inEditMode && notificationMsg && !clonable && (
          <span className={`notification-msg " + ${level}`}>
            {notificationMsg}
          </span>
        )}
        {clonable && (
          <span style={{ fontStyle: "italic" }}>
            This dashboard is owned by {owner} and cannot be edited
            <button
              onClick={() => this.props.onClone(id, loggedInUser)}
              className="btn-clone"
            >
              Clone Dashboard
            </button>
          </span>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    dashboard: getSelectedDashboard(state),
    loggedInUser: getUserName(state),
    notification: getNotification(state),
    mode: getMode(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch<DashboardAction>) {
  return {
    onTitleChange: (id: string, name: string) => {
      dispatch(renameDashboard(id, name));
    },
    onClone: (id: string, newUser: string) => {
      dispatch(cloneDashboard(id, newUser));
    },
    onUndo: () => {
      dispatch(undo());
    },
    onRedo: () => {
      dispatch(redo());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
