import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
import "./DashboardSettings.css";

import { deleteDashboard} from "../dashboardRepo";
interface Props {
  dashboards: Dashboard[];
  isLoggedIn: boolean;
}
interface State {
  dashboards: Dashboard[];
}

interface Dashboard {
  name: string;
  id: string;
}
class DashboardSettings extends Component<Props, State> {
  public render() {
    const { dashboards, isLoggedIn } = this.props;
    if (!isLoggedIn){
      return (
        <NotLoggedIn>
          You have to be logged in to view and manage your dashboards.
        </NotLoggedIn>
      )
    }
    return (
      <div className="dashboard-settings">
        <div>
        <span className="title">
        Your dashboards
        </span>
        <button
          className="btn-new-dashboard"
          onClick={this.newDashboard}
        >
          New
        </button>
        </div>
        {dashboards.map((value, key) => (
          <Fragment key={key}>{value.name}</Fragment>
        ))}
        {dashboards.length === 0 &&
          <div style={{ fontStyle: "italic", padding: "0.5em" }} >No dashboards available</div>
        }
      </div>
    );
  }
  private newDashboard = () => {
    return "fu";
  }
}
function mapStateToProps(state) {
  return {
    isLoggedIn: getIsLoggedIn(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // onGoToLogin: () => dispatch(openLoginDialog())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSettings);