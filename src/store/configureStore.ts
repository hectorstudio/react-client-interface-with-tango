import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootReducer from "../reducers/rootReducer";
import rootSaga from "../actions/sagas";
import { LOGIN } from "../actions/actionTypes";

export default function configureStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any;

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
    applyMiddleware(loggerMiddleware, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
