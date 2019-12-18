import React, { Component } from "react";

import SidebarTabs from "../SidebarTabs";
import DashboardLibrary from "./DashboardLibrary";
import WidgetLibrary from "./WIdgetLibrary";

interface Props {
  selectedTab: "dashboards" | "library";
  onTabChange: (x: "dashboards" | "library") => void;
}

export default class Library extends Component<Props> {
  public render() {
    const { onTabChange, selectedTab } = this.props;
    return (
      <div>
        <SidebarTabs selectedTab={selectedTab} onTabChange={onTabChange} />
        {/* by sending a 'render' props instead of conditional rendering here, the component won't get unmounted by
      changing tabs, and the state won't be lost */}
        <WidgetLibrary render={selectedTab === "library"} />
        <DashboardLibrary render={selectedTab === "dashboards"} />
      </div>
    );
  }
}
