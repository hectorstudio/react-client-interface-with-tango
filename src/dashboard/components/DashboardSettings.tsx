import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
import "./DashboardSettings.css";
import { getDashboards } from "../state/selectors";
import { RootState } from "../state/reducers";
import { deleteDashboard } from "../dashboardRepo";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import queryString from "query-string";

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
    if (!isLoggedIn) {
      return (
        <NotLoggedIn>
          You have to be logged in to view and manage your dashboards.
        </NotLoggedIn>
      );
    }
    const search = location.search;
    console.log("JFDKLSFJDLKFJ");
    console.log(location);
    const test = location.host + location.pathname + "";
    const parsed = queryString.parse(search);
    const id = String(parsed.id || "");
    return (
      <div className="dashboard-settings">
        <div>
          <span className="title">Your dashboards</span>
          <button className="btn-new-dashboard" onClick={this.newDashboard}>
            New
          </button>
          <Link to={location.pathname + "?id=5c9e20639333ee18ce6d0e44"}>
            NEW
          </Link>

          <Route
            path="/:tangoDB/"
            render={({ match, location }) => {
              const tangoDB = match.params.tangoDB;
              return (
                <div className="page-links" style={{ fontSize: "0.75em" }}>
                  <Link to={location.pathname + "?id=5c9e20639333ee18ce6d0e44"}>
                    Overview
                  </Link>
                  <a href={`/${tangoDB}/dashboard`}>Dashboard</a>
                </div>
              );
            }}
          />


        </div>
        {dashboards.map((value, key) => (
          <Fragment key={key}>{value.name}</Fragment>
        ))}
        {dashboards.length === 0 && (
          <div style={{ fontStyle: "italic", padding: "0.5em" }}>
            No dashboards available
          </div>
        )}
      </div>
    );
  }
  private newDashboard = () => {
    return "fu";
  };
}
function mapStateToProps(state: RootState) {
  return {
    dashboards: getDashboards(state),
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
