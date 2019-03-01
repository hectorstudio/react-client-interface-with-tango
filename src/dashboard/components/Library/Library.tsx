import React, { Component } from "react";

import LibraryWidget from "./LibraryWidget";
import { bundles } from "../../widgets";

export default class Library extends Component {
  public render() {
    return (
      <div className="Library">
        {bundles.map((bundle, i) => {
          return <LibraryWidget key={i} bundle={bundle} />;
        })}
      </div>
    );
  }
}
