import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
import "./DashboardSettings.css";
import { getDashboards } from "../state/selectors";
import { RootState } from "../state/reducers";
import { deleteDashboard } from "../state/actionCreators";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import queryString from "query-string";
import DeleteDashboardModal from "./modals/DeleteDashboardModal";

interface Props {
  dashboards: Dashboard[];
  isLoggedIn: boolean;
  onDeleteProperty: (id:string) => void;
}
interface State {
  deleteDashboardModalId: string;
}

interface Dashboard {
  name: string;
  id: string;
}
class DashboardSettings extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      deleteDashboardModalId: ""
    };

    this.handleDeleteProperty = this.handleDeleteProperty.bind(this);
  }
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
                onClick={() => this.setState({ deleteDashboardModalId: value.id })}
              >
                <i className="fa fa-trash " />
              </button>
            </div>

            {this.state.deleteDashboardModalId === value.id && (
          <DeleteDashboardModal
            id={value.id}
            name={value.name}
            onClose={() => this.setState({ deleteDashboardModalId: "" })}
            onDelete={this.handleDeleteProperty}
          />
        )}
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

  private handleDeleteProperty(id:string) {
    this.props.onDeleteProperty(id);
    this.setState({ deleteDashboardModalId: "" });
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
    onDeleteProperty: (id:string) => dispatch(deleteDashboard(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSettings);
