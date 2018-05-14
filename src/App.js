import React, { Component } from 'react';
import DeviceList from './DeviceList/DeviceList';
import DeviceViewer from './DeviceViewer/DeviceViewer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">WebJive</h1>
        </header>
        <div className="container-fluid">
          <div className="row">
            <div className="md-col-3">
              <DeviceList />
            </div>
            <div className="md-col-9">
              <DeviceViewer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
