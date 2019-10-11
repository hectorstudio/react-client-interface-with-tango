import React, { Component } from "react";
import moment from "moment";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import {
  getSelectedDashboard,
  getUserName,
  getNotification,
  getMode,
  hasSelectedWidgets,
  getUserGroups
} from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import {
  renameDashboard,
  cloneDashboard,
  undo,
  redo,
  duplicateWidget,
  shareDashboard
} from "../state/actionCreators";
import { Notification } from "../types";
import { Dispatch } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShareDashboardModal from "./modals/ShareDashboardModal";

interface Props {
  dashboard: Dashboard;
  loggedInUser: string;
  notification: Notification;
  mode: "edit" | "run";
  hasSelectedWidgets: boolean;
  onTitleChange: (id: string, name: string) => void;
  onClone: (id: string, newUser: string) => void;
  onDuplicateWidget: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShareDashboard: (id: string, group: string) => void;
  userGroups: string[];
}

interface State {
  wipName: string | null;
  showShareModal: boolean;
}

// TODO: displaying notifications is outside of the scope of this component and should be factored out at some point, e.g. to TopBar

class DashboardTitle extends Component<Props, State> {
  public inputRef: any;

  constructor(props) {
    super(props);
    this.handleShareDashboard = this.handleShareDashboard.bind(this);
    this.state = { wipName: null, showShareModal: false };
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.dashboard !== this.props.dashboard) {
      this.setState({ wipName: null });
    }
  }

  private handleShareDashboard(id: string, group: string) {
    this.props.onShareDashboard(id, group);
    this.setState({ showShareModal: false });
  }

  public render() {
    const { dashboard, loggedInUser, mode, userGroups } = this.props;
    const { id, user: owner, group, lastUpdatedBy, updateTime } = dashboard;
    const isMine = loggedInUser === owner;
    const inEditMode = mode === "edit";
    const showRecentlyEditedMessage =
      wasRecently(updateTime) &&
      lastUpdatedBy &&
      lastUpdatedBy !== loggedInUser;
    const editableTitle = (isMine || !owner) && inEditMode;
    const isSharedWithMe = userGroups.includes(group || "") && !isMine;

    const showOwnedByElseMsg = !isMine && owner;
    const showSharedMessage = isSharedWithMe;
    const clonable = !isMine && owner;
    const { level, msg: notificationMsg } = this.props.notification;
    const shareButtonColor =
      isMine && group ? "#17a6b7" : isMine ? "inherit" : "greytext";
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
      <>
        {this.state.showShareModal && (
          <ShareDashboardModal
            id={dashboard.id}
            name={dashboard.name}
            userGroups={userGroups}
            current={dashboard.group}
            onClose={() => this.setState({ showShareModal: false })}
            onShare={this.handleShareDashboard}
          />
        )}
        <div className="dashboard-menu">
          <input
            ref={ref => (this.inputRef = ref)}
            type="text"
            value={name}
            disabled={!editableTitle}
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
          {inEditMode && (
            <>
              <button
                className="dashboard-menu-button"
                title="Undo last action"
                onClick={this.props.onUndo}
                disabled={undoDisabled}
              >
                <FontAwesomeIcon icon="undo" />
              </button>
              <button
                className="dashboard-menu-button"
                title="Redo last action"
                onClick={this.props.onRedo}
                disabled={redoDisabled}
              >
                <FontAwesomeIcon icon="redo" />
              </button>
              <button
                className="dashboard-menu-button"
                title="Duplicate currently selected widgets"
                onClick={this.props.onDuplicateWidget}
                disabled={!this.props.hasSelectedWidgets}
              >
                <FontAwesomeIcon icon="clone" />
              </button>
            </>
          )}
          {inEditMode && userGroups && userGroups.length > 0 && (
            <button
              className="dashboard-menu-button"
              style={{
                color: shareButtonColor
              }}
              disabled={!dashboard.id || !isMine}
              title={
                dashboard.group
                  ? "This dashboard is shared with the group '" +
                    dashboard.group +
                    "'"
                  : "Share this dashboard with a user group"
              }
              onClick={() => this.setState({ showShareModal: true })}
            >
              <FontAwesomeIcon icon="share-alt" />
            </button>
          )}
          {inEditMode && notificationMsg && !clonable && (
            <span className={`notification-msg " + ${level}`}>
              {notificationMsg}
            </span>
          )}
          {showOwnedByElseMsg && inEditMode && (
            <span className="notification-msg " title={`This dashboard is owned by ${owner}`}>
              <FontAwesomeIcon icon="user" /> {owner}</span>
          )}
          {showSharedMessage &&  inEditMode && (
            <span  className="notification-msg " title={`This dashboard is shared for edit with the group ${dashboard.group}`}>
              <FontAwesomeIcon icon="share-alt" /> {dashboard.group}
            </span>
          )}
          {showRecentlyEditedMessage &&  inEditMode && (
            <span  className="notification-msg " title={`This dashboard is currently being edited by ${lastUpdatedBy}`}>
               <FontAwesomeIcon icon="user-edit" />  {lastUpdatedBy}
            </span>
          )}
          {clonable &&  inEditMode && (
            <button
              onClick={() => this.props.onClone(id, loggedInUser)}
              className="btn-clone"
              title="Clone this dashboard to your personal dashboard library"
            >
              Clone
            </button>
          )}
        </div>
      </>
    );
  }
}
function wasRecently(timestamp: Date | null) {
  if (!moment(timestamp || "").isValid()) {
    return false;
  }
  const diffInSeconds = moment().diff(moment(timestamp || "")) / 1000;
  return diffInSeconds < 60;
}

function mapStateToProps(state: RootState) {
  return {
    dashboard: getSelectedDashboard(state),
    loggedInUser: getUserName(state),
    notification: getNotification(state),
    hasSelectedWidgets: hasSelectedWidgets(state),
    userGroups: getUserGroups(state),
    mode: getMode(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
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
    },
    onDuplicateWidget: () => {
      dispatch(duplicateWidget());
    },
    onShareDashboard: (id: string, group: string) =>
      dispatch(shareDashboard(id, group))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
