import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DeviceList from './DeviceList/DeviceList';
import DeviceViewer from './DeviceViewer/DeviceViewer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WebJive</h1>
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
