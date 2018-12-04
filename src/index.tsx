import * as React from 'react';

import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './index.css';
import { Route, BrowserRouter } from "react-router-dom";


render(
  <BrowserRouter>
    <Route path={process.env.REACT_APP_BASE_URL + ":tangoDB/"} component={App} />
  </BrowserRouter>,
  document.getElementById('root')
);