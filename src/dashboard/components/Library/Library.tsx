import React, { Component } from "react";

import LibraryWidget from "./LibraryWidget";
import { bundles } from "../../widgets";
import SidebarTabs from "../SidebarTabs";
import DashboardSettings from "../DashboardSettings";


interface Props{
  selectedTab: string;
  onTabChange: (x:string) => void;
}

export default class Library extends Component<Props> {

  constructor(props){
    super(props);
  }

  public render() {
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
          dashboards={[]}
        />}
      </div>
    );
  }

}


