import React, { Component } from 'react';
import DeviceList from './DeviceList/DeviceList';
import DeviceViewer from './DeviceViewer/DeviceViewer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          WebJive
        </header>
        <div className="left-column">
          <DeviceList />
        </div>
        <div className="right-column">
          <DeviceViewer />
        </div>
      </div>
    );
  }
}

export default App;
