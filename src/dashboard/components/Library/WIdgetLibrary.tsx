import React, { Component } from "react";

import LibraryWidget from "./LibraryWidget";
import { bundles } from "../../widgets";

interface Props {
  render: boolean;
}
export default class WidgetLibrary extends Component<Props> {
  render() {
    if (!this.props.render) {
      return null;
    }
    return (
      <div className="Library">
        {bundles.map((bundle, i) => {
          return <LibraryWidget key={i} bundle={bundle} />;
        })}
      </div>
    );
  }
}
