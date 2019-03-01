import React, { Component } from "react";

interface Props {
  onClick: () => void;
  disabled: boolean;
  mode: "edit" | "run";
}

export default class ModeToggleButton extends Component<Props> {
  public render() {
    const { onClick, mode, disabled } = this.props;
    const [label, icon] =
      mode === "run" ? ["Edit", "pencil"] : ["Start", "play"];

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "0.25em 0.5em",
          borderRadius: "0.25em",
          cursor: disabled ? "not-allowed" : "",
          backgroundColor: "white",
          border: "1px solid rgba(0, 0, 0, 0.2)"
        }}
        tabIndex={-1}
      >
        <span className={`fa fa-${icon}`} /> {label}
      </button>
    );
  }
}
