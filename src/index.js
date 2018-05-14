import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux'
import App from './App';
import './index.css';

const store = configureStore();

render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();