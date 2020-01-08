import React, { Component } from "react";
import { Widget } from "../types";

interface Props {
  widgets: Widget[];
}
/**
 * work in progress, currently only listing the type of each widget. Planned features are described in https://gitlab.com/MaxIV/webjive-features/issues/27
 */
export default class DashboardLayers extends Component<Props> {
  public render() {
    const { widgets } = this.props;
    return (
      <div>
        <small>
          <i>
            Work in progress,currently only listing the type of each widget.
            Planned features are described <a href='https://gitlab.com/MaxIV/webjive-features/issues/27' target='_blank'>here</a>
            
          </i>
        </small>

        {widgets.map(widget => (
          <div>{widget.type}</div>
        ))}
      </div>
    );
  }
}
