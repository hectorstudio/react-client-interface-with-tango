import React, { Fragment } from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";

class ShowLogs extends React.Component {
  render() {
    return (
      <Route
        path="/:tangoDB/"
        render={({ match, location }) => {
          const tangoDB = match.params.tangoDB;
          const to = { ...location, pathname: `/${tangoDB}` };

          return (
            <Link to={to} style={{ fontSize: "0.75em" }}>
              Overview
            </Link>
          );
        }}
      />
    );
  }
}

export default ShowLogs;
