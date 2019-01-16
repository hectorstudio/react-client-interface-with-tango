import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import UserAware from "../shared/user/components/UserAware";
import Layout from "./Layout/Layout";
import configureStore from "./store/configureStore";
import InfoPage from "./InfoPage/InfoPage";

import "./index.css";
import "./App.css";

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <UserAware>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true} component={InfoPage} />
            <Route path="/" component={Layout} />
          </Switch>
        </BrowserRouter>
      </UserAware>
    </Provider>
  );
};

export default App;
