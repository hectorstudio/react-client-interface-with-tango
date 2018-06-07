import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

import { emit, init as websocketInit } from '../actions/websockets'

import rootReducer from '../reducers/rootReducer';

const logger = createLogger({});

export default function configureStore() {
  
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk.withExtraArgument({ emit }), logger)
  );
  websocketInit( store );

  return store;
}
