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
  tangoDB: string;
  selectedWidgets: Widget[];
}

export default class Sidebar extends Component<Props> {
  public render() {
    const { mode, selectedWidgets, tangoDB } = this.props;

    if (mode === "run") {
      return null;
    }

    return (
      <div className="Sidebar">
        {selectedWidgets.length === 0 ? (
          <Library />
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
