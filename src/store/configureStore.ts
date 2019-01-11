import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootReducer from "../reducers/rootReducer";
import rootSaga from "../actions/sagas";
import { LOGIN, ATTRIBUTE_CHANGE } from "../actions/actionTypes";

function createLoggerMiddleware(supressAttributeChanges?) {
  return createLogger({
    actionTransformer: action =>
      action.type === LOGIN
        ? { ...action, password: action.password.replace(/./g, "*") }
        : action,
    predicate: (_, action) =>
      supressAttributeChanges !== true || action.type !== ATTRIBUTE_CHANGE
  });
}

export default function configureStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any;

  const sagaMiddleware = createSagaMiddleware();
  const loggerMiddlware = createLoggerMiddleware();

  const store = createStore(
    rootReducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(loggerMiddlware, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
