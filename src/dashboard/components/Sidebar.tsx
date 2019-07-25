import React, { Component } from "react";
import Inspector from "./Inspector/Inspector";
import Library from "./Library/Library";

import { Widget } from "../types";

const MultipleSelection = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    }}
  >
    <span
      style={{
        fontWeight: "bold",
        color: "lightgray"
      }}
    >
      Multiple selection
    </span>
  </div>
);

interface Props {
  mode: "run" | "edit";
  selectedTab: "dashboards" | "library";
  tangoDB: string;
  selectedWidgets: Widget[];
}
interface State {
  selectedTab: "dashboards" | "library";
}

export default class Sidebar extends Component<Props, State> {
  constructor(props) {
    super(props);
    const { selectedTab } = this.props;
    this.state = { selectedTab };
  }
  public render() {
    const { mode, selectedWidgets, tangoDB } = this.props;
    const { selectedTab } = this.state;
    if (mode === "run") {
      return null;
    }

    return (
      <div className="Sidebar">
        {selectedWidgets.length === 0 ? (
          <Library
            selectedTab={selectedTab}
            onTabChange={newVal => this.setState({ selectedTab: newVal })}
          />
        ) : selectedWidgets.length === 1 ? (
          <Inspector
            widget={selectedWidgets[0]}
            isRootCanvas={/*this.isRootCanvas()*/ true}
            tangoDB={tangoDB}
          />
        ) : (
          <MultipleSelection />
        )}
      </div>
    );
  }
}
