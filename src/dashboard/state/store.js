import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";
import rootReducer from "./reducers";

const loggerMiddlware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const __REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(
  rootReducer,
  __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(loggerMiddlware, sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
export default store;
