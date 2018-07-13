import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

import { emit, init as websocketInit } from '../actions/websockets'

import rootReducer from '../reducers/rootReducer';

export default function configureStore() {
  const {__REDUX_DEVTOOLS_EXTENSION__} = window as any;

  const store = createStore(
    rootReducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
      thunk.withExtraArgument({ emit }),
      createLogger({})
    )
  );
  websocketInit( store );

  return store;
}
