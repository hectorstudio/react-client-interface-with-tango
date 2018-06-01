import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import DeviceList from './DeviceList/DeviceList';
import DeviceViewer from './DeviceViewer/DeviceViewer';
import ErrorDisplay from './ErrorDisplay/ErrorDisplay';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header>
            WebJive
          </header>
          <div className="left-column">
            <DeviceList />
          </div>
          <div className="right-column">
            <ErrorDisplay/>
            <Route path='/devices/:device*' component={DeviceViewer}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
