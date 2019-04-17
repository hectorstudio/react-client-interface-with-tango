import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";
import rootReducer from "./reducers";

const loggerMiddlware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ } = window;
const composeEnhancer = __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(loggerMiddlware, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
export default store;
