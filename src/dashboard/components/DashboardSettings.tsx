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
    return (
      <div className="dashboard-settings">
          <div className="dashboard-row">
            <div>Your dashboards</div>
            <div>
              {" "}
              <a
                className="dashboard-link float-right"
                href={`${location.pathname}`}
                title="Create a new dashboard"
              >
                New
              </a>
            </div>
          </div>
        {dashboards.map((value, key) => (
          <Fragment key={key}>
            <div className="dashboard-row">
              <a
                title={`View dashboard ${value.name}`}
                className="dashboard-link"
                href={`${location.pathname}?id=${value.id}`}
              >
                {value.name}
              </a>
              <button
                title={`Delete dashboard ${value.name}`}
                className="delete-button"
              >
                <i className="fa fa-trash " />
              </button>
            </div>
          </Fragment>
        ))}
        {dashboards.length === 0 && (
          <div style={{ fontStyle: "italic", padding: "0.5em" }}>
            No dashboards available
          </div>
        )}
      </div>
    );
  }
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
