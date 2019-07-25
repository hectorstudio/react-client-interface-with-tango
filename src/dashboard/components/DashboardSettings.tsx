import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
import "./DashboardSettings.css";
import { getDashboards, getSelectedDashboard } from "../state/selectors";
import { RootState } from "../state/reducers";
import { deleteDashboard } from "../state/actionCreators";
import DeleteDashboardModal from "./modals/DeleteDashboardModal";
import { Dashboard } from "../types";
import { Route } from "react-router-dom";

interface Props {
  dashboards: Dashboard[];
  isLoggedIn: boolean;
  selectedDashboard: Dashboard;
  onDeleteProperty: (id: string) => void;
}

interface State {
  deleteDashboardModalId: string;
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
    const { id: selectedDashboardId } = this.props.selectedDashboard;
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
          <div>
            {" "}
            <Route
              path="/:tangoDB/dashboard"
              render={({ match }) => (
                <a
                  className="dashboard-link float-right"
                  href={`${match.url}`}
                  title="Create a new dashboard"
                >
                  New
                </a>
              )}
            />
          </div>
        </div>
        {dashboards.map((value, key) => (
          <Fragment key={key}>
            <div
              className={
                "dashboard-row " +
                (value.id === selectedDashboardId ? "selected" : "")
              }
            >
              {selectedDashboardId !== value.id ? (
                <Route
                  path="/:tangoDB/dashboard"
                  render={({ match }) => (
                    <a
                      title={`View dashboard ${value.name ||
                        "Untitled dashboard"}`}
                      className="dashboard-link"
                      href={`${match.url}?id=${value.id}`}
                    >
                      {value.name || "Untitled dashboard"}
                    </a>
                  )}
                />
              ) : (
                <span>{value.name || "Untitled dashboard"}</span>
              )}

              <button
                title={`Delete dashboard ${value.name || "Untitled dashboard"}`}
                className="delete-button"
                onClick={() =>
                  this.setState({ deleteDashboardModalId: value.id })
                }
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

  private handleDeleteProperty(id: string) {
    this.props.onDeleteProperty(id);
    this.setState({ deleteDashboardModalId: "" });
  }
}
function mapStateToProps(state: RootState) {
  return {
    dashboards: getDashboards(state),
    isLoggedIn: getIsLoggedIn(state),
    selectedDashboard: getSelectedDashboard(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeleteProperty: (id: string) => dispatch(deleteDashboard(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSettings);
