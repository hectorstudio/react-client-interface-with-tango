import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import { getSelectedDashboard, getUserName } from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import { renameDashboard, cloneDashboard } from "../state/actionCreators";

interface Props {
  dashboard: Dashboard;
  onTitleChange: (dashboard: Dashboard) => void;
  onClone: (id: string, newUser: string) => void;
  loggedInUser: string;
}

class DashboardTitle extends Component<Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    const { id, name, user:owner } = this.props.dashboard;
    const { loggedInUser } = this.props;
    const isMine = loggedInUser === owner;
    const editable = isMine || !owner;
    const clonable = !isMine && loggedInUser && owner;
    return (
      <span className="dashboard-menu">
        <input
          type="text"
          value={name || "Untitled dashboard"}
          disabled={!editable}
          onChange={e => this.props.onTitleChange({ id, name: e.target.value })}
        />
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
      </span>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    dashboard: getSelectedDashboard(state),
    loggedInUser: getUserName(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onTitleChange: (dashboard: Dashboard) => {
      return dispatch(renameDashboard(dashboard));
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
