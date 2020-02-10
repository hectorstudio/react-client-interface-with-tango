import React, { Component } from "react";
import "./SidebarTabs.css";

interface Props {
  selectedTab: string;
  onTabChange: (newVal: "library" | "dashboards") => void;
}

export default class SidebarTabs extends Component<Props> {
  public render() {
<<<<<<< HEAD
    const { onTabChange, selectedTab } = this.props;
=======
    const {onTabChange, selectedTab} = this.props;
>>>>>>> origin/master
    return (
      <div className="sidebar-tabs">
        <ul className="nav section-chooser">
          <li
            className={
<<<<<<< HEAD
              "toggle-button toggle-button-left " +
              (selectedTab === "library" ? "toggle-button-selected" : "")
=======
              "toggle-button toggle-button-left " + (selectedTab === "library" ? "toggle-button-selected" : "")
>>>>>>> origin/master
            }
            key="library"
            onClick={e => onTabChange("library")}
          >
<<<<<<< HEAD
            Widgets
          </li>
          <li
            className={
              "toggle-button toggle-button-right " +
              (selectedTab === "dashboards" ? "toggle-button-selected" : "")
            }
=======
            Library
          </li>
          <li
            className={"toggle-button toggle-button-right " + (selectedTab === "dashboards" ? "toggle-button-selected" : "")}
>>>>>>> origin/master
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
