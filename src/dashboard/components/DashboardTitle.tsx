import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect, Dispatch } from "react-redux";
import {
  getSelectedDashboard,
  getUserName,
  getNotification,
  getMode
} from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import { renameDashboard, cloneDashboard } from "../state/actionCreators";
import { Notification } from "../types";
import { DashboardAction } from "../state/actions";

interface Props {
  dashboard: Dashboard;
  loggedInUser: string;
  notification: Notification;
  mode: "edit" | "run";
  onTitleChange: (id: string, name: string) => void;
  onClone: (id: string, newUser: string) => void;
}

interface State {
  wipName: string | null;
}

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
    const editable = (isMine || !owner) && mode !== "run";
    const clonable = !isMine && owner;
    const { level, msg: notificationMsg } = this.props.notification;

    if (!loggedInUser) {
      return (
        <div className="dashboard-menu">
          {id && <span style={{ marginLeft: "0.5em" }}>{dashboard.name}</span>}
          <span className="notification-msg ">
            You need to be logged in to save dashboards
          </span>
        </div>
      );
    }

    const { wipName } = this.state;
    const name =
      wipName != null ? wipName : dashboard.name || "Untitled dashboard";

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
        {notificationMsg && !clonable && (
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
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
