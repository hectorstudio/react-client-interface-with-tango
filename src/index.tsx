import * as React from 'react';

import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import InfoPage from "./InfoPage/InfoPage";

import './index.css';
import { Route, BrowserRouter } from "react-router-dom";


render(
  <BrowserRouter>
    <div>
      <Route path={"/:tangoDB/"} component={App} />
      <Route path="/" exact={true} component={InfoPage}  />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);