import React, { Component, Fragment } from "react";
import NotLoggedIn from "../../../jive/components/DeviceViewer/NotLoggedIn/NotLoggedIn";
import { connect } from "react-redux";
import { getIsLoggedIn } from "../../../shared/user/state/selectors";
import "./DashboardLibrary.css";
import { getDashboards, getSelectedDashboard } from "../../state/selectors";
import { RootState } from "../../state/reducers";
import { deleteDashboard } from "../../state/actionCreators";
import DeleteDashboardModal from "../modals/DeleteDashboardModal";
import { Dashboard, SharedDashboards, Widget } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch } from "redux";
import { Button } from "react-bootstrap";
import { loadDashboard, saveDashboard } from "../../state/actionCreators";
import { getGroupDashboards, getGroupDashboardCount } from "../../dashboardRepo";

interface Props {

  render:boolean;
  dashboards: Dashboard[];
  isLoggedIn: boolean;
  selectedDashboard: Dashboard;
  onDeleteDashboard: (id: string) => void;
  loadDashboard: (id: string) => void;
  saveDashboard: (id: string, name: string, widgets: Widget[]) => void;
}

interface State {
  deleteDashboardModalId: string;
  expandedGroups: { [group: string]: boolean };
  sharedDashboards: SharedDashboards;
}

class DashboardLibrary extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.handleDeleteDashboard = this.handleDeleteDashboard.bind(this);
    this.state = {
      deleteDashboardModalId: "",
      expandedGroups: {},
      sharedDashboards: {
        dashboards: [],
        availableGroupDashboards: {}
      }
    };
  }

  public async componentDidMount() {
    const meta = await getGroupDashboardCount();
    const keys = Object.keys(meta);
    const sharedDashboards: SharedDashboards = {
      dashboards: [],
      availableGroupDashboards: {}
    };
    keys.forEach(key => {
      sharedDashboards.availableGroupDashboards[key] = {
        count: meta[key],
        loaded: false
      };
    });
    this.setState({ sharedDashboards });
  }
  onSharedDashboardLoad = (sharedDashboards:SharedDashboards) => this.setState({sharedDashboards})
  
  public render() {
    if (!this.props.render){
      return null;
    }
    const { dashboards, isLoggedIn } = this.props;
    const {
      dashboards: groupDashboards,
      availableGroupDashboards
    } = this.state.sharedDashboards;
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
          <button
            title="Create a new dashboard"
            onClick={() => this.setSelectedDashboard("")}
            className="dashboard-link"
          >
            New
          </button>
        </div>
        {dashboards.map(dashboard => this.DashboardRow(dashboard, false))}
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
                  .map(dashboard => this.DashboardRow(dashboard, true))}
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
    } = this.state.sharedDashboards;
    const loaded = availableGroupDashboards[groupName].loaded;
    let groupDashboards: Dashboard[] = [];
    if (!loaded) {
      groupDashboards = await getGroupDashboards(groupName);
      availableGroupDashboards[groupName].loaded = true;
      dashboards.push(...groupDashboards);
      this.setState({sharedDashboards:{
        availableGroupDashboards,
        dashboards: dashboards.filter(
          (value, index, self) => self.indexOf(value) === index
        )
      }});
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
  setSelectedDashboard = (id: string) => {
    if (id){
      this.props.loadDashboard(id);
    }else{
      //creates a new dashboard, loads it, and selects it
      this.props.saveDashboard("", "Untitled dashboard", []);
    }
    
  };
  DashboardRow = (dashboard: Dashboard, shared: boolean) => {
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
            <button
              onClick={() => this.setSelectedDashboard(dashboard.id)}
              className="dashboard-link"
            >
              {dashboard.name || "Untitled dashboard"}
            </button>
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
            {!shared && (
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
            )}
            {shared && (
              <span
                title={"This dashboard is owned by " + dashboard.user}
                style={{
                  color: "#666",
                  fontSize: "0.8em",
                  fontStyle: "italic"
                }}
              >
                <FontAwesomeIcon icon="user" /> {dashboard.user}
              </span>
            )}
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
    saveDashboard: (id: string, name: string, widgets: Widget[]) =>
    dispatch(saveDashboard(id, name, widgets)),
    onDeleteDashboard: (id: string) => dispatch(deleteDashboard(id)),
    loadDashboard: (id: string) => dispatch(loadDashboard(id))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardLibrary);
