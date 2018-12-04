import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import UserAware from "./UserAware";
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import "./App.css";

const App = ({match}) => {
    const store = configureStore(match.params.tangoDB);
    return (
      <Provider store={store}>
      <UserAware>
        <BrowserRouter>
          <Route path="/" component={Layout} />
        </BrowserRouter>
      </UserAware>
      </Provider>
    );
}

export default App;
