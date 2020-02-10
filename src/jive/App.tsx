import React from "react";
<<<<<<< HEAD
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
=======
import { BrowserRouter, Route, Switch } from "react-router-dom";
>>>>>>> origin/master
import { Provider } from "react-redux";

import UserAware from "../shared/user/components/UserAware";
import Layout from "./components/Layout/Layout";
import configureStore from "./state/store/configureStore";
import InfoPage from "./components/InfoPage/InfoPage";

<<<<<<< HEAD
import "font-awesome/css/font-awesome.min.css";
=======
import "font-awesome/css/font-awesome.min.css"; 
>>>>>>> origin/master
import "./App.css";

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <UserAware>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true} component={InfoPage} />
<<<<<<< HEAD
            <Route
              path="/:tangoDB"
              exact={true}
              render={({ match }) => (
                <Redirect to={`/${match.params.tangoDB}/devices`} />
              )}
            />
            <Route path="/:tangoDB/devices" component={Layout} />
=======
            <Route path="/" component={Layout} />
>>>>>>> origin/master
          </Switch>
        </BrowserRouter>
      </UserAware>
    </Provider>
  );
};

export default App;
