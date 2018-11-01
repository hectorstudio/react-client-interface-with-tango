import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import UserAware from "./UserAware";

import "./App.css";

class App extends Component {
  public render() {
    return (
      <UserAware>
        <BrowserRouter>
          <Route path="/" component={Layout} />
        </BrowserRouter>
      </UserAware>
    );
  }
}

export default App;
