import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import { emit, socket, init as websocketInit } from "../actions/websockets";

import rootReducer from "../reducers/rootReducer";
import rootSaga from "../actions/sagas";
import { LOGIN } from "../actions/actionTypes";

export default function configureStore(tangoDB) {
  const ws = socket(tangoDB)
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any;

  const thunkMiddleware = thunk.withExtraArgument({ emit: emit.bind(null, ws) });
  const sagaMiddleware = createSagaMiddleware();
  const loggerMiddleware = createLogger({
    actionTransformer: action =>
      action.type === LOGIN
        ? { ...action, password: action.password.replace(/./g, "*") }
        : action
  });

  const store = createStore(
    rootReducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunkMiddleware, loggerMiddleware, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);
  websocketInit(ws, store);

  return store;
}
