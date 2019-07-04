import React, { PropsWithChildren } from "react";
import { Route, Link } from "react-router-dom";

import LogInOut from "../../user/components/LogInOut/LogInOut";

import "./Navbar.css";

export function Navbar(props: PropsWithChildren<{}>) {
  return (
    <div className="layout-navbar">
      <Route
        path="/:tangoDB/"
        render={({ match, location }) => {
          const tangoDB = match.params.tangoDB;
          return (
            <div className="page-links" style={{ fontSize: "0.75em" }}>
              <Link to={{ ...location, pathname: `/${tangoDB}` }}>
                Devices
              </Link>
              <a href={`/${tangoDB}/dashboard`}>Dashboards</a>
            </div>
          );
        }}
      />
      {props.children || null}
      <LogInOut />
    </div>
  );
}
