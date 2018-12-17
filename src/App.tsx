import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import UserAware from "./UserAware";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import "./App.css";

import Dashboard from "./Dashboard/Dashboard";

const App = ({ match }) => {
  const store = configureStore(match.params.tangoDB);
  return (
    <Provider store={store}>
      <UserAware>
        <BrowserRouter>
          <Switch>
            <Route
              path={"/:tangoDB/dashboard"}
              exact={true}
              component={Dashboard}
            />
            <Route path="/" component={Layout} />
          </Switch>
        </BrowserRouter>
      </UserAware>
    </Provider>
  );
};

export default App;
