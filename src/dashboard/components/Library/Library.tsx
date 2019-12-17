import React, { Component } from "react";

import LibraryWidget from "./LibraryWidget";
import { bundles } from "../../widgets";
import SidebarTabs from "../SidebarTabs";
import DashboardSettings from "../DashboardSettings";
import { getGroupDashboardCount } from "../../dashboardRepo";
import { SharedDashboards } from "../../types";

interface Props {
  selectedTab: "dashboards" | "library";
  onTabChange: (x: "dashboards" | "library") => void;
}

interface State {
  sharedDashboards: SharedDashboards;
}

export default class Library extends Component<Props, State> {

  public constructor(props){
    super(props);
    this.state = {
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
    const { onTabChange, selectedTab } = this.props;
    const { sharedDashboards } = this.state;
    return (
      <div>
        <SidebarTabs selectedTab={selectedTab} onTabChange={onTabChange} />
        {selectedTab === "library" ? (
          <div className="Library">
            {bundles.map((bundle, i) => {
              return <LibraryWidget key={i} bundle={bundle} />;
            })}
          </div>
        ) : (
          <DashboardSettings sharedDashboards={sharedDashboards} onSharedDashboardLoad={this.onSharedDashboardLoad}/>
        )}
      </div>
    );
  }
}
