import React, { Component } from "react";

interface Props {
  selectedTab: string;
  onTabChange: (newVal:string) => void;
}
import "./SidebarTabs.css";

export default class SidebarTabs extends Component<Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    const {onTabChange, selectedTab} = this.props;
    return (
      <div className="sidebar-tabs">
        <ul className="nav section-chooser">
          <li
            className={
              "toggle-button toggle-button-left " + (selectedTab === "library" ? "toggle-button-selected" : "")
            }
            key="library"
            onClick={e => onTabChange("library")}
          >
            Library
          </li>
          <li
            className={"toggle-button toggle-button-right " + (selectedTab === "dashboards" ? "toggle-button-selected" : "")}
            key="dashboards"
            onClick={e => onTabChange("dashboards")}
          >
            Dashboards
          </li>
        </ul>
      </div>
    );
  }
}
