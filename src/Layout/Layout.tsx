import React from 'react';
import { Route } from 'react-router-dom';
import * as qs from 'query-string';

import DeviceList from '../DeviceList/DeviceList';
import DeviceViewer from '../DeviceViewer/DeviceViewer';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

import './Layout.css';

const BaseLayout = ({children}) =>
  <div className="Layout">
    {children}
  </div>;

const MainView = ({className}) =>
  <div className={className}>
    <ErrorDisplay/>
    <Route path='/devices/:device*' component={DeviceViewer}/>
  </div>;

const DefaultLayout = () =>
  <BaseLayout>
    <div className="left-column">
      <DeviceList/>
    </div>
    <MainView className="right-column"/>
  </BaseLayout>;

const SimpleLayout = () => 
  <BaseLayout>
    <MainView className="double-column"/> 
  </BaseLayout>;

const Layout = ({location: {search}}) =>
  'no_sidebar' in qs.parse(search)
    ? <SimpleLayout/>
    : <DefaultLayout/>;

export default Layout;
