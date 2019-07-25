import React, { PropsWithChildren } from "react";
import { Route } from "react-router-dom";

import LogInOut from "../../user/components/LogInOut/LogInOut";

import "./Navbar.css";

export function Navbar(props: PropsWithChildren<{}>) {
  return (
    <div className="Navbar">
      <div className="navigation">
        <Route
          path="/:tangoDB/:section"
          render={({ match }) => {
            const { tangoDB, section } = match.params;
            const sections = [
              ["Devices", "devices"],
              ["Dashboards", "dashboard"]
            ];

            const links = sections.map(([name, identifier]) => (
              <a
                key={identifier}
                className={identifier === section ? "active" : ""}
                href={`/${tangoDB}/${identifier}`}
              >
                {name}
              </a>
            ));

            return <div className="page-links">{links}</div>;
          }}
        />
      </div>
      {props.children || null}
      <LogInOut />
    </div>
  );
}
