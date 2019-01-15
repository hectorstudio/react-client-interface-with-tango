import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import userSaga from "../../shared/user/state/saga";
import rootReducer from "./reducers";

const loggerMiddlware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const __REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(
  rootReducer,
  __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(loggerMiddlware, sagaMiddleware)
);

console.log(userSaga);

// sagaMiddleware.runSaga(userSaga);
export default store;
