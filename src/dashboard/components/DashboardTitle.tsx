import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import {
  getSelectedDashboard,
  getUserName,
  getNotification
} from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import {
  renameDashboard,
  cloneDashboard,
  saveDashboard
} from "../state/actionCreators";
import { Notification } from "../types";

interface Props {
  dashboard: Dashboard;
  onTitleChange: (
    event: React.KeyboardEvent<HTMLInputElement>,
    dashboard: Dashboard,
    oldName: string,
    inputRef: any
  ) => void;
  onBlur: (dashboard: Dashboard, oldName: string) => void;
  onClone: (id: string, newUser: string) => void;
  loggedInUser: string;
  notification: Notification;
}
interface State {
  name: string;
}
class DashboardTitle extends Component<Props, State> {
  public inputRef: any;

  constructor(props) {
    super(props);
    this.state = { name: "" };
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.dashboard !== this.props.dashboard) {
      this.setState({ name: nextProps.dashboard.name });
    }
  }
  public render() {
    const {
      id,
      user: owner,
      name: oldName,
      insertTime,
      updateTime
    } = this.props.dashboard;
    const { name } = this.state;
    const { loggedInUser } = this.props;
    const isMine = loggedInUser === owner;
    const editable = isMine || !owner;
    const clonable = !isMine && owner;
    const {
      level,
      sourceAction,
      msg: notificationMsg
    } = this.props.notification;
    if (!loggedInUser) {
      return (
        <div className="dashboard-menu">
          <span style={{fontSize: "1.2em", marginLeft: "2em"}}>{name}</span>
        </div>
      );
    }

    return (
      <div className="dashboard-menu">
        <input
          ref={ref => (this.inputRef = ref)}
          type="text"
          value={name || "Untitled dashboard"}
          disabled={!editable}
          onChange={e => this.setState({ name: e.target.value })}
          onKeyPress={e =>
            this.props.onTitleChange(
              e,
              {
                id,
                name,
                user: owner,
                redirect: false,
                insertTime,
                updateTime
              },
              oldName,
              this.inputRef
            )
          }
          onBlur={() =>
            this.props.onBlur(
              {
                id,
                name,
                user: owner,
                redirect: false,
                insertTime,
                updateTime
              },
              oldName
            )
          }
        />
        {notificationMsg && (
          <span className={"notification-msg "}>{notificationMsg}</span>
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
    notification: getNotification(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onBlur: (dashboard: Dashboard, oldName: string) => {
      const { id, name } = dashboard;
      if (oldName === name) {
        return;
      }
      if (!dashboard.id) {
        dispatch(saveDashboard(id, name, []));
      } else {
        return dispatch(renameDashboard(dashboard));
      }
    },
    onTitleChange: (
      e: React.KeyboardEvent<HTMLInputElement>,
      dashboard: Dashboard,
      oldName: string,
      inputRef: any
    ) => {
      if (e.key !== "Enter") {
        return;
      }
      inputRef.blur();
      if (oldName === dashboard.name) {
        return;
      }
      if (!dashboard.id) {
        const { id, name } = dashboard;
        dispatch(saveDashboard(id, name, []));
      } else {
        return dispatch(renameDashboard(dashboard));
      }
    },
    onClone: (id: string, newUser: string) => {
      return dispatch(cloneDashboard(id, newUser));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
