import React, { Component } from "react";

import {
  IWidgetBundle
} from "../../types";

import LibraryWidget from "./LibraryWidget";

interface IProps {
  widgetBundles: IWidgetBundle[];
}

export default class Library extends Component<IProps> {
  public render() {
    return (
      <div className="Library">
        {this.props.widgetBundles.map((bundle, i) => {
          return <LibraryWidget key={i} bundle={bundle} />;
        })}
      </div>
    );
    /*
    const builtIn = this.props.widgetDefinitions.filter(
      definition => definition.__canvas__ == null
    );

    const custom = this.props.widgetDefinitions.filter(
      definition => definition.__canvas__ != null
    );

    return (
      <div className="Library">
        <h1>Built-In</h1>
        {builtIn.map((definition, i) => {
          return <LibraryWidget key={i} definition={definition} />;
        })}
        {this.props.showCustom && (
          <Fragment>
            <h1>Custom</h1>
            {custom.map((definition, i) => {
              return <LibraryWidget key={i} definition={definition} />;
            })}
          </Fragment>
        )}
      </div>
    );
    */
  }
}
