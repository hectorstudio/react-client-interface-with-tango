import React, { Component } from "react";
import { Provider } from "react-redux";

import store from "./state/store";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route } from "react-router-dom";
import UserAware from "../shared/user/components/UserAware";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons'

library.add( faUndo, faRedo)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <UserAware>
            <Route path="/:tangoDB/dashboard" component={Dashboard} />
          </UserAware>
        </BrowserRouter>
      </Provider>
    );
  }
}
