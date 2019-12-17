import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../shared/user/state/selectors";
import "./DashboardSettings.css";
import { getDashboards, getSelectedDashboard } from "../state/selectors";
import { RootState } from "../state/reducers";
import { deleteDashboard } from "../state/actionCreators";
import DeleteDashboardModal from "./modals/DeleteDashboardModal";
import { Dashboard, SharedDashboards } from "../types";
import { Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch } from "redux";
import { Button } from "react-bootstrap";
import { getGroupDashboards } from "../dashboardRepo";

interface Props {
  dashboards: Dashboard[];
  isLoggedIn: boolean;
  selectedDashboard: Dashboard;
  sharedDashboards: SharedDashboards;
  onSharedDashboardLoad: (sharedDashboards: SharedDashboards) => void;
  onDeleteDashboard: (id: string) => void;
}

interface State {
  deleteDashboardModalId: string;
  expandedGroups: { [group: string]: boolean };
}

class DashboardSettings extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.handleDeleteDashboard = this.handleDeleteDashboard.bind(this);
    this.state = {
      deleteDashboardModalId: "",
      expandedGroups: {}
    };
  }
  public render() {
    const { dashboards, isLoggedIn } = this.props;
    const {
      dashboards: groupDashboards,
      availableGroupDashboards
    } = this.props.sharedDashboards;
    const groupsWithSharedDashboards = Object.keys(
      availableGroupDashboards
    ).filter(group => availableGroupDashboards[group].count > 0);

    if (!isLoggedIn) {
      return (
        <NotLoggedIn>
          You have to be logged in to view and manage your dashboards.
        </NotLoggedIn>
      );
    }
    return (
      <div className="dashboard-settings">
        <div className="dashboard-settings-title">My dashboards</div>
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
        {dashboards.map(dashboard => this.DashboardRow(dashboard))}
        {/* SHARED DASHBOARDS */}
        <div className="dashboard-settings-title">Shared dashboards</div>

        {groupsWithSharedDashboards.map(groupName => {
          return (
            <Fragment key={groupName}>
              {this.groupDashboardTitle(
                groupName,
                availableGroupDashboards[groupName].count,
                this.state.expandedGroups[groupName]
              )}
              {this.state.expandedGroups[groupName] &&
                groupDashboards
                  .filter(dashboard => dashboard.group === groupName)
                  .map(dashboard => this.DashboardRow(dashboard))}
            </Fragment>
          );
        })}
        {groupsWithSharedDashboards.length === 0 && (
          <div style={{ fontStyle: "italic", padding: "0.5em" }}>
            There are no shared dashboards in any of your groups
          </div>
        )}
      </div>
    );
  }
  groupDashboardTitle = (
    groupName: string,
    count: number,
    expanded: boolean
  ) => {
    if (expanded) {
      return (
        <div className="dashboard-settings-title subtitle">
          {groupName} ({count})
          <Button
            className="btn btn-link"
            onClick={() => this.collapseGroup(groupName)}
          >
            <FontAwesomeIcon icon="chevron-up" />{" "}
          </Button>
        </div>
      );
    }
    return (
      <div className="dashboard-settings-title subtitle">
        {groupName} ({count})
        <Button
          title="Load dashboards shared with this group"
          onClick={() => this.expandGroup(groupName)}
          className="btn btn-link"
        >
          <FontAwesomeIcon icon="chevron-down" />{" "}
        </Button>
      </div>
    );
  };

  expandGroup = async (groupName: string) => {
    const {
      availableGroupDashboards,
      dashboards
    } = this.props.sharedDashboards;
    const loaded = availableGroupDashboards[groupName].loaded;
    let groupDashboards: Dashboard[] = [];
    if (!loaded) {
      groupDashboards = await getGroupDashboards(groupName);
      availableGroupDashboards[groupName].loaded = true;
      dashboards.push(...groupDashboards);
      this.props.onSharedDashboardLoad({
        availableGroupDashboards,
        dashboards: dashboards.filter(
          (value, index, self) => self.indexOf(value) === index
        )
      });
    }
    const { expandedGroups } = this.state;
    this.setState({ expandedGroups: { ...expandedGroups, [groupName]: true } });
  };
  collapseGroup = (groupName: string) => {
    const { expandedGroups } = this.state;
    this.setState({
      expandedGroups: { ...expandedGroups, [groupName]: false }
    });
  };
  DashboardRow = (dashboard: Dashboard) => {
    const { id: selectedDashboardId } = this.props.selectedDashboard;
    return (
      <Fragment key={dashboard.id}>
        <div
          className={
            "dashboard-row " +
            (dashboard.id === selectedDashboardId ? "selected" : "")
          }
        >
          {selectedDashboardId !== dashboard.id ? (
            <Route
              path="/:tangoDB/dashboard"
              render={({ match }) => (
                <a
                  title={`View dashboard ${dashboard.name ||
                    "Untitled dashboard"}`}
                  className="dashboard-link"
                  href={`${match.url}?id=${dashboard.id}`}
                >
                  {dashboard.name || "Untitled dashboard"}
                </a>
              )}
            />
          ) : (
            <span>{dashboard.name || "Untitled dashboard"}</span>
          )}
          <div
            style={{
              width: "6.5em",
              textAlign: "right",
              alignSelf: "flex-start"
            }}
          >
            <button
              title={`Delete dashboard '${dashboard.name ||
                "Untitled dashboard"}'`}
              className="delete-button"
              onClick={() =>
                this.setState({ deleteDashboardModalId: dashboard.id })
              }
            >
              <FontAwesomeIcon icon="trash" />
            </button>
          </div>
        </div>

        {this.state.deleteDashboardModalId === dashboard.id && (
          <DeleteDashboardModal
            id={dashboard.id}
            name={dashboard.name}
            onClose={() => this.setState({ deleteDashboardModalId: "" })}
            onDelete={this.handleDeleteDashboard}
          />
        )}
      </Fragment>
    );
  };

  private handleDeleteDashboard(id: string) {
    this.props.onDeleteDashboard(id);
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

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onDeleteDashboard: (id: string) => dispatch(deleteDashboard(id))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSettings);
