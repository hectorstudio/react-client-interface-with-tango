import React, { Component } from "react";
import Inspector from "./Inspector/Inspector";
import Library from "./Library/Library";
import MultipleSelection from "./Inspector/MultipleSelect";
import { Widget } from "../types";

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
  constructor(props: Props) {
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
            nbrSelectedWidgets={selectedWidgets.length}
            widget={selectedWidgets[0]}
            isRootCanvas={true}
            tangoDB={tangoDB}
            render={true}
          />
        ) : (
          <MultipleSelection
            nbrSelectedWidgets={selectedWidgets.length}
            widgets={selectedWidgets}
            isRootCanvas={true}
            tangoDB={tangoDB}
            render={true}
          />
        )}
      </div>
    );
  }
}
