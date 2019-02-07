import React from "react";
import { Route, Switch } from "react-router-dom";
import * as qs from "query-string";

import DeviceList from "../DeviceList/DeviceList";
import DeviceViewer from "../DeviceViewer/DeviceViewer";
import HomeViewer from "../HomeViewer/HomeViewer";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";

import LogInOut from "../../../shared/user/components/LogInOut/LogInOut";
import LoginDialog from "../../../shared/user/components/LoginDialog/LoginDialog";

import "./Layout.css";

function extractRouteParams(match, history) {
  const { tangoDB, device: deviceName } = match.params;
  const { hash } = history.location;
  const selectedTab = hash.substr(1) || null;
  return { tangoDB, deviceName, selectedTab };
}

const BaseLayout = ({ children }) => <div className="Layout">{children}</div>;

const MainView = ({ className }) => (
  <div className={className}>
    <LogInOut />
    <LoginDialog />
    <ErrorDisplay />
    <Route
      path={"/:tangoDB/devices/:device*"}
      render={props => {
        const { match, history } = props;
        const params = extractRouteParams(match, history);
        const { tangoDB, deviceName, selectedTab } = params;
        return (
          <DeviceViewer
            tangoDB={tangoDB}
            deviceName={deviceName}
            selectedTab={selectedTab}
          />
        );
      }}
    />
    <Route path="/:tangoDB/" exact={true} component={HomeViewer} />
  </div>
);

const DefaultLayout = () => (
  <BaseLayout>
    <div className="left-column">
      <Switch>
        <Route
          path={"/:tangoDB/devices/:device*"}
          render={({ match, location }) => {
            const { tangoDB, device } = match.params;
            return (
              <DeviceList
                location={location}
                tangoDB={tangoDB}
                currentDeviceName={device}
              />
            );
          }}
        />
        <Route
          path={"/:tangoDB"}
          render={({ match, location }) => {
            const { tangoDB } = match.params;
            return <DeviceList location={location} tangoDB={tangoDB} />;
          }}
        />
      </Switch>
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
