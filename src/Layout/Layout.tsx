import React from 'react';
import { Route } from 'react-router-dom';
import * as qs from 'query-string';

import DeviceList from '../DeviceList/DeviceList';
import DeviceViewer from '../DeviceViewer/DeviceViewer';
import HomeViewer from '../HomeViewer/HomeViewer';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import Dashboard from '../Dashboard/Dashboard';
import ModalDialog from '../Modal/Modal';

import './Layout.css';

const BaseLayout = ({children}) =>
  <div className="Layout">
    {children}
  </div>;

const MainView = ({className}) =>
  <div className={className}>
    <ErrorDisplay/>
    <ModalDialog/>
    <Route path='/dashboard' exact={true} component={Dashboard}/>
    <Route path='/devices/:device*' component={DeviceViewer}/>
    <Route path='/' exact={true} component={HomeViewer}/>
  </div>;

const DefaultLayout = () =>
  <BaseLayout>
    <div className="left-column">
      <Route path='/' component={DeviceList}/>
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
