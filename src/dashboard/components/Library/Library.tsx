import React, { Component } from "react";

<<<<<<< HEAD
import SidebarTabs from "../SidebarTabs";
import DashboardLibrary from "./DashboardLibrary";
import WidgetLibrary from "./WIdgetLibrary";

interface Props {
=======
import LibraryWidget from "./LibraryWidget";
import { bundles } from "../../widgets";
import SidebarTabs from "../SidebarTabs";
import DashboardSettings from "../DashboardSettings";


interface Props{
>>>>>>> origin/master
  selectedTab: "dashboards" | "library";
  onTabChange: (x: "dashboards" | "library") => void;
}

export default class Library extends Component<Props> {
  public render() {
<<<<<<< HEAD
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
=======
    const {onTabChange, selectedTab} = this.props;
    return (
      <div>
        <SidebarTabs 
        selectedTab={selectedTab}
        onTabChange={onTabChange}
         />
        {selectedTab === "library" ?
        <div className="Library">
          {bundles.map((bundle, i) => {
            return <LibraryWidget key={i} bundle={bundle} />;
          })}
        </div>
        :
        <DashboardSettings
        />}
      </div>
    );
  }

}


>>>>>>> origin/master
