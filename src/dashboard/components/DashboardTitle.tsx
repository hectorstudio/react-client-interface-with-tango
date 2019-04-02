import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import { getSelectedDashboard } from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import { renameDashboard } from "../state/actionCreators";

interface Props {
  dashboard: Dashboard;
  onTitleChange: (dashboard: Dashboard) => void;
}

class DashboardTitle extends Component<Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    const { id, name } = this.props.dashboard;
    return (
      <span className="dashboard-menu">
        <input
          type="text"
          value={name || "Untitled dashboard"}
          onChange={e =>
            this.props.onTitleChange({ id, name: e.target.value })
          }
        />
        {id}
      </span>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    dashboard: getSelectedDashboard(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onTitleChange: (dashboard: Dashboard) => {
      return dispatch(renameDashboard(dashboard));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
