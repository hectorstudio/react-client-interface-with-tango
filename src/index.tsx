import React from "react";

import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { Route, BrowserRouter, Switch } from "react-router-dom";

import Jive from "./jive/App";
import Dashboard from "./dashboard/Dashboard";

render(
  <BrowserRouter>
    <Switch>
      <Route path={"/:tangoDB/dashboard"} component={Dashboard} />
      <Route path={"/"} component={Jive} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
