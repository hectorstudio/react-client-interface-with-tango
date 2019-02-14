import React, { Component } from "react";
import cx from "classnames";

interface Props {
  onClick: () => void;
  disabled: boolean;
  mode: "edit" | "run";
}

export default class ModeToggleButton extends Component<Props> {
  public render() {
    const { onClick, mode, disabled } = this.props;

    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          fontSize: "small",
          width: "2.5em",
          textAlign: "center"
        }}
        className={cx("form-control fa", {
          "fa-play": mode === "edit",
          "fa-pause": mode === "run"
        })}
        disabled={disabled}
      />
    );
  }
}
