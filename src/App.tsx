import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Layout from './Layout/Layout';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/' component={Layout}/>
      </BrowserRouter>
    );
  }
}

export default App;
