import React, { Component } from "react";
import Inspector from "./Inspector/Inspector";
import Library from "./Library/Library";
<<<<<<< HEAD
import { Widget } from "../types";

=======

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
>>>>>>> origin/master

interface Props {
  mode: "run" | "edit";
  selectedTab: "dashboards" | "library";
  tangoDB: string;
  selectedWidgets: Widget[];
}
<<<<<<< HEAD
interface State {
=======
interface State{
>>>>>>> origin/master
  selectedTab: "dashboards" | "library";
}

export default class Sidebar extends Component<Props, State> {
<<<<<<< HEAD
  constructor(props: Props) {
    super(props);
    const { selectedTab } = this.props;
    this.state = { selectedTab };
  }
  public render() {
    const { mode, selectedWidgets, tangoDB } = this.props;
    const { selectedTab } = this.state;
=======
  constructor(props){
    super(props);
    const {selectedTab} = this.props;
    this.state = {selectedTab};
  }
  public render() {
    const { mode, selectedWidgets, tangoDB } = this.props;
    const {selectedTab} = this.state;
>>>>>>> origin/master
    if (mode === "run") {
      return null;
    }

    return (
      <div className="Sidebar">
        {selectedWidgets.length === 0 ? (
<<<<<<< HEAD
          <Library
            selectedTab={selectedTab}
            onTabChange={newVal => this.setState({ selectedTab: newVal })}
          />
        ):(
          <Inspector
            nbrSelectedWidgets={selectedWidgets.length}
            widgets={selectedWidgets}
            isRootCanvas={true}
            tangoDB={tangoDB}
            render={true}
          />
        )}
      </div>
    )
=======
          <Library 
          selectedTab={selectedTab}
          onTabChange={(newVal) => this.setState({selectedTab: newVal})}
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
>>>>>>> origin/master
  }
}
