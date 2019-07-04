import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import * as qs from "query-string";

import DeviceList from "../DeviceList/DeviceList";
import DeviceViewer from "../DeviceViewer/DeviceViewer";
import HomeViewer from "../HomeViewer/HomeViewer";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";

import LoginDialog from "../../../shared/user/components/LoginDialog/LoginDialog";
import { Navbar } from "../../../shared/ui/navbar/Navbar";

import "./Layout.css";

const BaseLayout = ({ children }) => <div className="Layout">{children}</div>;

const MainView = ({ className }) => (
  <div className={className}>
    <LoginDialog />
    <ErrorDisplay />
    <Route
      exact={true}
      path={"/:tangoDB/devices/:domain/:family/:member"}
      render={({ match, location }) => {
        // Is there no simpler way to append /server than to reconstruct the whole URL?
        const { tangoDB, domain, family, member } = match.params;
        const pathname = `/${tangoDB}/devices/${domain}/${family}/${member}/server`;
        const to = { ...location, pathname };
        return <Redirect to={to} />;
      }}
    />
    <Route
      path={"/:tangoDB/devices/:domain/:family/:member/:tab"}
      render={props => {
        const { tangoDB, domain, family, member, tab } = props.match.params;
        const deviceName = `${domain}/${family}/${member}`;

        return (
          <DeviceViewer
            tangoDB={tangoDB}
            deviceName={deviceName}
            selectedTab={tab}
          />
        );
      }}
    />
    <Route path="/:tangoDB/devices" exact={true} component={HomeViewer} />
  </div>
);

const DefaultLayout = () => (
  <BaseLayout>
    <Navbar />
    <div className="left-column">
      <Switch>
        <Route
          path={"/:tangoDB/devices/:domain/:family/:member"}
          render={({ match, location }) => {
            const { tangoDB, domain, family, member } = match.params;
            const device = `${domain}/${family}/${member}`;

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
