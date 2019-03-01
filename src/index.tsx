import React from "react";
import { render } from "react-dom";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import JiveApp from "./jive/App";
import DashboardApp from "./dashboard/App";

import "bootstrap/dist/css/bootstrap.min.css";

render(
  <BrowserRouter>
    <Switch>
      <Route path={"/:tangoDB/dashboard"} component={DashboardApp} />
      <Route path={"/"} component={JiveApp} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
