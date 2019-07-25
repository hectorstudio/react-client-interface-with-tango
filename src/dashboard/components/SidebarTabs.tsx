import React, { Component } from "react";
import "./SidebarTabs.css";

interface Props {
  selectedTab: string;
  onTabChange: (newVal: "library" | "dashboards") => void;
}

export default class SidebarTabs extends Component<Props> {
  public render() {
    const { onTabChange, selectedTab } = this.props;
    return (
      <div className="sidebar-tabs">
        <ul className="nav section-chooser">
          <li
            className={
              "toggle-button toggle-button-left " +
              (selectedTab === "library" ? "toggle-button-selected" : "")
            }
            key="library"
            onClick={e => onTabChange("library")}
          >
            Library
          </li>
          <li
            className={
              "toggle-button toggle-button-right " +
              (selectedTab === "dashboards" ? "toggle-button-selected" : "")
            }
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
