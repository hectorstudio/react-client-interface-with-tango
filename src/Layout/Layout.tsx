import React from "react";
import { Route } from "react-router-dom";
import * as qs from "query-string";

import DeviceList from "../DeviceList/DeviceList";
import DeviceViewer from "../DeviceViewer/DeviceViewer";
// import HomeViewer from "../HomeViewer/HomeViewer";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import LogInOut from "../LogInOut/LogInOut";
import ModalDialog from "../Modal/Modal";
import "./Layout.css";

const BaseLayout = ({ children }) => <div className="Layout">{children}</div>;

const MainView = ({ className }) => (
  <div className={className}>
    <LogInOut />
    <ErrorDisplay />
    <Route path={process.env.REACT_APP_BASE_URL + ":tangoDB/*"} exact={true} component={ModalDialog} />
    <Route path={process.env.REACT_APP_BASE_URL + ":tangoDB/devices/:device*"} component={DeviceViewer} />
    {/* <Route path="/:tangoDB/" exact={true} component={HomeViewer} /> */}
  </div>
);

const DefaultLayout = () => (
  <BaseLayout>
    <div className="left-column">
      <Route path={process.env.REACT_APP_BASE_URL + ":tangoDB"} component={DeviceList} />
    </div>
    <MainView className="right-column" />
  </BaseLayout>
);

const SimpleLayout = () => (
  <BaseLayout>
    <MainView className="double-column" />
  </BaseLayout>
);

const Layout = ({ location: { search } }) =>
  "no_sidebar" in qs.parse(search) ? <SimpleLayout /> : <DefaultLayout />;

export default Layout;
