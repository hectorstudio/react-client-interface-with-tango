import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import UserAware from "../shared/user/components/UserAware";
import Layout from "./components/Layout/Layout";
import configureStore from "./state/store/configureStore";
import InfoPage from "./components/InfoPage/InfoPage";

import "font-awesome/css/font-awesome.min.css";
import "./App.css";

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <UserAware>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true} component={InfoPage} />
            <Route
              path="/:tangoDB"
              exact={true}
              render={({ match }) => (
                <Redirect to={`/${match.params.tangoDB}/devices`} />
              )}
            />
            <Route path="/:tangoDB/devices" component={Layout} />
          </Switch>
        </BrowserRouter>
      </UserAware>
    </Provider>
  );
};

export default App;
